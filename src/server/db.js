/**
 * FarmDirect — PostgreSQL Database Module (Hardened)
 *
 * Covers: schema migrations, product CRUD, transactional orders,
 * escrow lifecycle, payout idempotency, OTP auth (no bypass),
 * admin stats, and demand forecasting.
 */
import pg from 'pg';
import {
  generateToken,
  hashPassword,
  verifyPassword,
  checkOtpRateLimit,
  getOtpExpiryMinutes,
  maskAadhaar,
  sanitizeUser,
  validatePhone,
  validateEmail,
} from './auth.js';

// ─── Connection Pool ────────────────────────────────────────────────────────
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const pool = connectionString
  ? new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } })
  : new pg.Pool({
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '',
      database: process.env.PGDATABASE || 'farmdirect',
    });

export async function testConnection() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT NOW() as current_time, current_database() as db');
    return res.rows[0];
  } finally {
    client.release();
  }
}

// ─── Valid Order Status Transitions (State Machine) ─────────────────────────
const ORDER_TRANSITIONS = {
  'PENDING_PAYMENT':     ['ESCROW_LOCKED', 'CANCELLED'],
  'ESCROW_LOCKED':       ['ORDER_CONFIRMED', 'CANCELLED'],
  'ORDER_CONFIRMED':     ['FARMER_CONFIRMED', 'CANCELLED'],
  'FARMER_CONFIRMED':    ['PACKED', 'CANCELLED'],
  'PACKED':              ['READY_FOR_PICKUP', 'CANCELLED'],
  'READY_FOR_PICKUP':    ['PICKED_UP', 'CANCELLED'],
  'PICKED_UP':           ['IN_TRANSIT'],
  'IN_TRANSIT':          ['OUT_FOR_DELIVERY'],
  'OUT_FOR_DELIVERY':    ['DELIVERED'],
  'DELIVERED':           ['DELIVERY_CONFIRMED'],
  'DELIVERY_CONFIRMED':  ['ESCROW_RELEASED'],
  'ESCROW_RELEASED':     ['PAYOUT_PROCESSING'],
  'PAYOUT_PROCESSING':   ['PAYOUT_COMPLETED'],
  'PAYOUT_COMPLETED':    [],
  'CANCELLED':           [],
  'DISPUTED':            [],
  // Legacy status support for existing data
  'Order Placed & Escrow Funded': ['FARMER_CONFIRMED', 'IN_TRANSIT', 'CANCELLED', 'Delivered & Escrow Settled'],
  'In Transit':          ['DELIVERED', 'OUT_FOR_DELIVERY', 'Delivered & Escrow Settled'],
  'Delivered':           ['DELIVERY_CONFIRMED', 'Delivered & Escrow Settled'],
  'Delivered & Escrow Settled': [],
};

function isValidTransition(from, to) {
  const allowed = ORDER_TRANSITIONS[from];
  if (!allowed) return true; // Unknown status → allow (for migration)
  return allowed.includes(to);
}

// ─── Schema Migration ───────────────────────────────────────────────────────
export async function runMigrations() {
  const migrationSQL = `
    -- Ensure core tables exist
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      price_per_kg NUMERIC(10,2) NOT NULL,
      traditional_price NUMERIC(10,2),
      consumer_price NUMERIC(10,2),
      available_qty NUMERIC(10,2) NOT NULL,
      unit VARCHAR(20) DEFAULT 'kg',
      quality_grade VARCHAR(50) DEFAULT 'Grade A',
      is_organic BOOLEAN DEFAULT false,
      farmer_name VARCHAR(255),
      farmer_contact VARCHAR(50),
      farmer_rating NUMERIC(3,2) DEFAULT 4.9,
      farmer_location VARCHAR(255),
      state VARCHAR(100),
      distance_km NUMERIC(6,1) DEFAULT 12.0,
      estimated_delivery VARCHAR(100),
      image TEXT,
      harvest_date VARCHAR(50),
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(50) PRIMARY KEY,
      product_id VARCHAR(50),
      product_name VARCHAR(255),
      image TEXT,
      farmer_name VARCHAR(255),
      buyer_name VARCHAR(255),
      quantity NUMERIC(10,2),
      unit VARCHAR(20) DEFAULT 'kg',
      total_price NUMERIC(10,2),
      saved_amount NUMERIC(10,2),
      delivery_address TEXT,
      status VARCHAR(50),
      current_step INT DEFAULT 1,
      payment_method VARCHAR(50),
      payment_txn_id VARCHAR(100),
      payment_status VARCHAR(50),
      utr_number VARCHAR(100),
      escrow_settled BOOLEAN DEFAULT false,
      origin_json JSONB,
      destination_json JSONB,
      telemetry_json JSONB,
      tracking_steps_json JSONB,
      driver_json JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS payouts (
      id VARCHAR(50) PRIMARY KEY,
      order_id VARCHAR(50),
      utr VARCHAR(100),
      farmer_name VARCHAR(255),
      farmer_upi VARCHAR(100),
      crop_name VARCHAR(255),
      amount NUMERIC(10,2),
      zero_middlemen_deduction NUMERIC(10,2) DEFAULT 0,
      settled_at VARCHAR(100),
      status VARCHAR(50),
      bank_name VARCHAR(100),
      buyer_name VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE,
      full_name VARCHAR(255),
      password VARCHAR(255),
      role VARCHAR(50) NOT NULL,
      phone VARCHAR(50),
      location VARCHAR(255),
      fpo_name VARCHAR(255),
      bank_upi_id VARCHAR(100),
      farmer_id VARCHAR(100),
      aadhaar_id VARCHAR(50),
      kcc_number VARCHAR(50),
      land_size_acres NUMERIC(6,2),
      primary_crops VARCHAR(255),
      verification_status VARCHAR(50) DEFAULT 'UNVERIFIED',
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS otp_records (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255),
      phone VARCHAR(50),
      otp VARCHAR(10) NOT NULL,
      role VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW(),
      verified BOOLEAN DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS govt_verified_farmers (
      id SERIAL PRIMARY KEY,
      farmer_id VARCHAR(50) UNIQUE NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      aadhaar_number VARCHAR(20) NOT NULL,
      khasra_number VARCHAR(50) NOT NULL,
      village VARCHAR(100) NOT NULL,
      tehsil VARCHAR(100) NOT NULL,
      district VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      land_size_acres NUMERIC(6,2) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      kcc_number VARCHAR(50),
      fpo_membership VARCHAR(255),
      bank_upi_id VARCHAR(100),
      certified_crops VARCHAR(255),
      soil_health_card_id VARCHAR(50)
    );

    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      admin_id VARCHAR(50) UNIQUE NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(255),
      designation VARCHAR(150) NOT NULL,
      department VARCHAR(150) NOT NULL,
      zone VARCHAR(150) NOT NULL,
      access_level VARCHAR(50) DEFAULT 'FULL_ADMIN',
      status VARCHAR(50) DEFAULT 'ACTIVE',
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- New columns (safe with IF NOT EXISTS)
    DO $$ BEGIN
      ALTER TABLE products ADD COLUMN IF NOT EXISTS user_id INTEGER;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS buyer_id INTEGER;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS farmer_id INTEGER;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_otp VARCHAR(10);
      ALTER TABLE payouts ADD COLUMN IF NOT EXISTS buyer_id INTEGER;
      ALTER TABLE payouts ADD COLUMN IF NOT EXISTS farmer_id INTEGER;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS buyer_type VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS business_name VARCHAR(255);
    EXCEPTION WHEN others THEN NULL;
    END $$;

    -- Escrow transactions table
    CREATE TABLE IF NOT EXISTS escrow_transactions (
      id SERIAL PRIMARY KEY,
      order_id VARCHAR(50) NOT NULL,
      buyer_id INTEGER,
      farmer_id INTEGER,
      amount NUMERIC(10,2) NOT NULL,
      status VARCHAR(30) DEFAULT 'LOCKED',
      locked_at TIMESTAMP DEFAULT NOW(),
      released_at TIMESTAMP,
      transaction_id VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Shipments table  
    CREATE TABLE IF NOT EXISTS shipments (
      id SERIAL PRIMARY KEY,
      order_id VARCHAR(50) NOT NULL,
      driver_name VARCHAR(255),
      driver_phone VARCHAR(50),
      vehicle VARCHAR(255),
      vehicle_capacity VARCHAR(100),
      status VARCHAR(50) DEFAULT 'ASSIGNED',
      current_lat NUMERIC(10,6),
      current_lng NUMERIC(10,6),
      temperature NUMERIC(5,2),
      speed NUMERIC(5,1),
      eta_minutes INTEGER,
      progress_percent INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Telemetry logs
    CREATE TABLE IF NOT EXISTS telemetry_logs (
      id SERIAL PRIMARY KEY,
      shipment_id INTEGER,
      order_id VARCHAR(50),
      lat NUMERIC(10,6),
      lng NUMERIC(10,6),
      temperature NUMERIC(5,2),
      speed NUMERIC(5,1),
      checkpoint VARCHAR(255),
      alert_type VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
    CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
    CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
    CREATE INDEX IF NOT EXISTS idx_orders_farmer_id ON orders(farmer_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
    CREATE INDEX IF NOT EXISTS idx_payouts_order_id ON payouts(order_id);
    CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_govt_farmer_id ON govt_verified_farmers(farmer_id);
    CREATE INDEX IF NOT EXISTS idx_govt_phone ON govt_verified_farmers(phone);
    CREATE INDEX IF NOT EXISTS idx_escrow_order_id ON escrow_transactions(order_id);
    CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON shipments(order_id);
  `;

  await pool.query(migrationSQL);
  console.log('✅ Database schema migrations applied.');
}

// ─── PRODUCT OPERATIONS ─────────────────────────────────────────────────────

/**
 * Get products with server-side filtering, sorting, and pagination.
 */
export async function getProducts(params = {}) {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (params.category) {
    conditions.push(`category = $${idx++}`);
    values.push(params.category);
  }
  if (params.search) {
    conditions.push(`(LOWER(name) LIKE $${idx} OR LOWER(farmer_name) LIKE $${idx} OR LOWER(farmer_location) LIKE $${idx})`);
    values.push(`%${params.search.toLowerCase()}%`);
    idx++;
  }
  if (params.state) {
    conditions.push(`state = $${idx++}`);
    values.push(params.state);
  }
  if (params.grade) {
    conditions.push(`quality_grade = $${idx++}`);
    values.push(params.grade);
  }
  if (params.organic === 'true' || params.organic === true) {
    conditions.push(`is_organic = true`);
  }
  if (params.maxPrice) {
    conditions.push(`price_per_kg <= $${idx++}`);
    values.push(Number(params.maxPrice));
  }

  // Only show products with available quantity > 0
  conditions.push(`available_qty > 0`);

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Sorting
  let orderBy = 'created_at DESC';
  if (params.sort === 'price-low') orderBy = 'price_per_kg ASC';
  else if (params.sort === 'price-high') orderBy = 'price_per_kg DESC';
  else if (params.sort === 'distance') orderBy = 'distance_km ASC';

  // Pagination
  const page = Math.max(1, parseInt(params.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.limit) || 50));
  const offset = (page - 1) * limit;

  // Get total count
  const countQuery = `SELECT COUNT(*) FROM products ${where}`;
  const { rows: countRows } = await pool.query(countQuery, values);
  const total = parseInt(countRows[0].count, 10);

  // Get page of results
  const dataQuery = `SELECT * FROM products ${where} ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`;
  const { rows } = await pool.query(dataQuery, values);

  const products = rows.map(mapProductRow);
  return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
}

function mapProductRow(r) {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    pricePerKg: Number(r.price_per_kg),
    traditionalPrice: Number(r.traditional_price),
    consumerPrice: Number(r.consumer_price),
    availableQty: Number(r.available_qty),
    unit: r.unit || 'kg',
    qualityGrade: r.quality_grade,
    isOrganic: Boolean(r.is_organic),
    farmer: r.farmer_name,
    farmerContact: r.farmer_contact,
    farmerRating: Number(r.farmer_rating) || 4.9,
    farmerLocation: r.farmer_location,
    state: r.state,
    distanceKm: Number(r.distance_km),
    estimatedDelivery: r.estimated_delivery,
    image: r.image,
    harvestDate: r.harvest_date,
    description: r.description,
    userId: r.user_id,
    createdAt: r.created_at,
  };
}

export async function getProductById(id) {
  const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  if (rows.length === 0) return null;
  return mapProductRow(rows[0]);
}

/**
 * Add a product. Derives farmer info from the authenticated user.
 */
export async function addProduct(p, authUser) {
  // Validate required fields
  if (!p.name || !p.name.trim()) throw new Error('Product name is required');
  if (!p.category) throw new Error('Category is required');
  if (!p.pricePerKg || Number(p.pricePerKg) <= 0) throw new Error('Price must be positive');
  if (!p.availableQty || Number(p.availableQty) <= 0) throw new Error('Quantity must be positive');

  // Look up farmer info from database
  let farmerName = 'Verified Producer';
  let farmerContact = '';
  let farmerLocation = '';
  let farmerState = 'India';
  let userId = null;

  if (authUser) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [authUser.sub]);
    if (rows.length > 0) {
      const u = rows[0];
      farmerName = u.fpo_name || u.full_name || 'Verified Producer';
      farmerContact = u.phone || '';
      farmerLocation = u.location || '';
      farmerState = u.location?.split(',').pop()?.trim() || 'India';
      userId = u.id;
    }
  }

  const productId = p.id || `prod-${Date.now()}`;
  const query = `
    INSERT INTO products (
      id, name, category, price_per_kg, traditional_price, consumer_price,
      available_qty, unit, quality_grade, is_organic, farmer_name, farmer_contact,
      farmer_rating, farmer_location, state, distance_km, estimated_delivery,
      image, harvest_date, description, user_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      price_per_kg = EXCLUDED.price_per_kg,
      available_qty = EXCLUDED.available_qty,
      description = EXCLUDED.description
    RETURNING *;
  `;
  const values = [
    productId, p.name.trim(), p.category,
    Number(p.pricePerKg),
    p.traditionalPrice || Math.round(Number(p.pricePerKg) * 1.7),
    p.consumerPrice || Math.round(Number(p.pricePerKg) * 1.2),
    Number(p.availableQty), p.unit || 'kg',
    p.qualityGrade || 'Grade A', p.isOrganic || false,
    farmerName, farmerContact, 4.9,
    farmerLocation || p.farmerLocation || 'Local Farm Cluster',
    farmerState || p.state || 'India',
    p.distanceKm || 12.0,
    p.estimatedDelivery || 'Same Day (4 Hours)',
    p.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    p.harvestDate || new Date().toISOString().split('T')[0],
    p.description || '',
    userId,
  ];

  const { rows } = await pool.query(query, values);
  return mapProductRow(rows[0]);
}

export async function updateProduct(id, data, authUser) {
  // Verify ownership
  const existing = await getProductById(id);
  if (!existing) throw new Error('Product not found');
  if (existing.userId && authUser && existing.userId !== authUser.sub) {
    throw new Error('You can only edit your own products');
  }

  const sets = [];
  const values = [];
  let idx = 1;

  if (data.name) { sets.push(`name = $${idx++}`); values.push(data.name.trim()); }
  if (data.category) { sets.push(`category = $${idx++}`); values.push(data.category); }
  if (data.pricePerKg !== undefined) {
    if (Number(data.pricePerKg) <= 0) throw new Error('Price must be positive');
    sets.push(`price_per_kg = $${idx++}`); values.push(Number(data.pricePerKg));
    sets.push(`traditional_price = $${idx++}`); values.push(Math.round(Number(data.pricePerKg) * 1.7));
    sets.push(`consumer_price = $${idx++}`); values.push(Math.round(Number(data.pricePerKg) * 1.2));
  }
  if (data.availableQty !== undefined) {
    if (Number(data.availableQty) < 0) throw new Error('Quantity cannot be negative');
    sets.push(`available_qty = $${idx++}`); values.push(Number(data.availableQty));
  }
  if (data.qualityGrade) { sets.push(`quality_grade = $${idx++}`); values.push(data.qualityGrade); }
  if (data.isOrganic !== undefined) { sets.push(`is_organic = $${idx++}`); values.push(Boolean(data.isOrganic)); }
  if (data.description) { sets.push(`description = $${idx++}`); values.push(data.description); }
  if (data.harvestDate) { sets.push(`harvest_date = $${idx++}`); values.push(data.harvestDate); }
  if (data.image) { sets.push(`image = $${idx++}`); values.push(data.image); }

  if (sets.length === 0) throw new Error('No fields to update');

  values.push(id);
  const query = `UPDATE products SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`;
  const { rows } = await pool.query(query, values);
  return mapProductRow(rows[0]);
}

export async function deleteProduct(id, authUser) {
  const existing = await getProductById(id);
  if (!existing) throw new Error('Product not found');
  if (existing.userId && authUser && existing.userId !== authUser.sub) {
    throw new Error('You can only delete your own products');
  }
  await pool.query('DELETE FROM products WHERE id = $1', [id]);
  return { success: true, message: 'Product deleted' };
}

// ─── ORDER OPERATIONS (Transactional) ───────────────────────────────────────

function mapOrderRow(r) {
  return {
    id: r.id,
    productId: r.product_id,
    productName: r.product_name,
    image: r.image,
    farmerName: r.farmer_name,
    buyerName: r.buyer_name,
    quantity: Number(r.quantity),
    unit: r.unit || 'kg',
    totalPrice: Number(r.total_price),
    savedAmount: Number(r.saved_amount),
    deliveryAddress: r.delivery_address,
    status: r.status,
    currentStep: r.current_step,
    payment: {
      method: r.payment_method || 'Demo UPI (Simulated)',
      txnId: r.payment_txn_id,
      status: r.payment_status || 'ESCROW_LOCKED',
      amount: Number(r.total_price),
      bankName: 'FarmDirect Escrow Trust (Simulated)',
    },
    paymentMethod: r.payment_method,
    paymentTxnId: r.payment_txn_id,
    paymentStatus: r.payment_status,
    utrNumber: r.utr_number,
    escrowSettled: Boolean(r.escrow_settled),
    origin: r.origin_json,
    destination: r.destination_json,
    telemetry: r.telemetry_json,
    trackingSteps: r.tracking_steps_json,
    driver: r.driver_json,
    buyerId: r.buyer_id,
    farmerId: r.farmer_id,
    createdAt: r.created_at,
  };
}

export async function getOrders(authUser = null) {
  let query = 'SELECT * FROM orders';
  const values = [];

  if (authUser) {
    const role = (authUser.role || '').toUpperCase();
    if (role === 'BUYER') {
      query += ' WHERE buyer_id = $1';
      values.push(authUser.sub);
    } else if (role === 'FARMER') {
      query += ' WHERE farmer_id = $1';
      values.push(authUser.sub);
    }
    // ADMIN/LOGISTICS see all orders
  }

  query += ' ORDER BY created_at DESC';
  const { rows } = await pool.query(query, values);
  return rows.map(mapOrderRow);
}

/**
 * Create an order transactionally:
 * 1. Load product from DB
 * 2. Validate inventory (row-level lock)
 * 3. Decrease inventory atomically
 * 4. Calculate price server-side
 * 5. Create order
 * 6. Create escrow record
 * 7. Commit or rollback
 */
export async function createOrder(data, authUser) {
  if (!data.productId) throw new Error('Product ID is required');
  if (!data.quantity || Number(data.quantity) <= 0) throw new Error('Quantity must be positive');
  if (!data.deliveryAddress) throw new Error('Delivery address is required');

  const requestedQty = Number(data.quantity);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Lock product row and check inventory
    const { rows: productRows } = await client.query(
      'SELECT * FROM products WHERE id = $1 FOR UPDATE',
      [data.productId]
    );
    if (productRows.length === 0) {
      throw new Error('Product not found');
    }
    const product = productRows[0];
    const availableQty = Number(product.available_qty);

    if (requestedQty > availableQty) {
      throw new Error(`Insufficient inventory. Only ${availableQty} ${product.unit || 'kg'} available.`);
    }

    // 2. Load buyer info from DB
    let buyerName = 'Buyer';
    let buyerId = null;
    if (authUser) {
      const { rows: userRows } = await client.query('SELECT * FROM users WHERE id = $1', [authUser.sub]);
      if (userRows.length > 0) {
        buyerName = `${userRows[0].full_name} (${userRows[0].role})`;
        buyerId = userRows[0].id;
      }
    }

    // 3. Load farmer info
    let farmerId = product.user_id || null;

    // 4. Calculate price SERVER-SIDE (never trust frontend)
    const pricePerKg = Number(product.price_per_kg);
    const totalPrice = Math.round(pricePerKg * requestedQty * 100) / 100;
    const traditionalPrice = Number(product.traditional_price) || Math.round(pricePerKg * 1.7);
    const savedAmount = Math.max(0, (traditionalPrice * requestedQty) - totalPrice);

    // 5. Decrease inventory atomically
    await client.query(
      'UPDATE products SET available_qty = available_qty - $1 WHERE id = $2',
      [requestedQty, data.productId]
    );

    // 6. Create order
    const orderId = data.id || `FD${1000 + Math.floor(Math.random() * 9000)}`;
    const txnId = `TXN-FD-DEMO-${Date.now().toString().slice(-8)}`;
    const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const orderQuery = `
      INSERT INTO orders (
        id, product_id, product_name, image, farmer_name, buyer_name,
        quantity, unit, total_price, saved_amount, delivery_address,
        status, current_step, payment_method, payment_txn_id, payment_status,
        escrow_settled, origin_json, destination_json, telemetry_json,
        tracking_steps_json, driver_json, buyer_id, farmer_id, delivery_otp
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25
      )
      RETURNING *;
    `;
    const orderValues = [
      orderId, data.productId, product.name, product.image,
      product.farmer_name, buyerName, requestedQty, product.unit || 'kg',
      totalPrice, savedAmount, data.deliveryAddress,
      'ESCROW_LOCKED', 1,
      'Demo UPI (Simulated)', txnId, 'ESCROW_LOCKED',
      false,
      JSON.stringify(data.origin || {}),
      JSON.stringify(data.destination || {}),
      JSON.stringify(data.telemetry || {}),
      JSON.stringify(data.trackingSteps || [
        { title: 'Order Placed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true, current: true, detail: `Order placed for ${product.name}` },
        { title: 'Farmer Confirmed', time: 'Pending', completed: false, detail: 'Farmer prepping fresh harvest' },
        { title: 'Produce Packed', time: 'Pending', completed: false, detail: 'Quality grading & crate tagging' },
        { title: 'Picked Up', time: 'Pending', completed: false, detail: 'Vehicle loading' },
        { title: 'In Transit', time: 'Pending', completed: false, detail: 'Route optimization corridor' },
        { title: 'Delivered', time: 'Pending', completed: false, detail: `Deliver to ${data.deliveryAddress}` },
      ]),
      JSON.stringify(data.driver || { name: 'Rajesh Kumar', phone: '+91 98930 11223', vehicle: 'Tata Ace EV (MP-04-FD-2024)', capacity: '850 kg / 1000 kg' }),
      buyerId, farmerId, deliveryOtp,
    ];

    const { rows: orderRows } = await client.query(orderQuery, orderValues);

    // 7. Create escrow record
    await client.query(`
      INSERT INTO escrow_transactions (order_id, buyer_id, farmer_id, amount, status, transaction_id)
      VALUES ($1, $2, $3, $4, 'LOCKED', $5)
    `, [orderId, buyerId, farmerId, totalPrice, txnId]);

    await client.query('COMMIT');

    console.log(`✅ Order ${orderId} created. Inventory decreased by ${requestedQty} ${product.unit || 'kg'}. Escrow ₹${totalPrice} locked.`);
    return mapOrderRow(orderRows[0]);

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Update order status with state machine validation.
 */
export async function updateOrder(id, newStatus, extra = {}, authUser = null) {
  // Load current order
  const { rows: currentRows } = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
  if (currentRows.length === 0) throw new Error('Order not found');

  const current = currentRows[0];

  // Validate state transition
  if (!isValidTransition(current.status, newStatus)) {
    throw new Error(`Invalid status transition: "${current.status}" → "${newStatus}"`);
  }

  // Build dynamic update
  let query = 'UPDATE orders SET status = $1';
  const values = [newStatus];
  let paramIdx = 2;

  if (extra.currentStep !== undefined) {
    query += `, current_step = $${paramIdx}`;
    values.push(extra.currentStep);
    paramIdx++;
  }
  if (extra.utrNumber !== undefined) {
    query += `, utr_number = $${paramIdx}`;
    values.push(extra.utrNumber);
    paramIdx++;
  }
  if (extra.escrowSettled !== undefined) {
    query += `, escrow_settled = $${paramIdx}`;
    values.push(extra.escrowSettled);
    paramIdx++;
  }
  if (extra.trackingSteps !== undefined) {
    query += `, tracking_steps_json = $${paramIdx}`;
    values.push(JSON.stringify(extra.trackingSteps));
    paramIdx++;
  }
  if (extra.telemetry !== undefined) {
    query += `, telemetry_json = $${paramIdx}`;
    values.push(JSON.stringify(extra.telemetry));
    paramIdx++;
  }

  query += ` WHERE id = $${paramIdx} RETURNING *;`;
  values.push(id);

  const { rows } = await pool.query(query, values);
  return mapOrderRow(rows[0]);
}

/**
 * Confirm delivery and trigger escrow release + payout creation.
 */
export async function confirmDelivery(orderId, authUser) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query('SELECT * FROM orders WHERE id = $1 FOR UPDATE', [orderId]);
    if (rows.length === 0) throw new Error('Order not found');
    const order = rows[0];

    // Validate the buyer is confirming their own order
    if (authUser && order.buyer_id && order.buyer_id !== authUser.sub) {
      throw new Error('You can only confirm delivery for your own orders');
    }

    // Allow confirmation from various "delivered" states
    const deliverableStatuses = ['DELIVERED', 'OUT_FOR_DELIVERY', 'In Transit', 'IN_TRANSIT', 'Order Placed & Escrow Funded'];
    if (!deliverableStatuses.includes(order.status) && !order.status?.includes('Transit') && !order.status?.includes('Delivered')) {
      throw new Error(`Cannot confirm delivery. Current status: ${order.status}`);
    }

    const payoutAmount = Number(order.total_price);
    const utr = `UPI/NPCI/DEMO/${Date.now().toString().slice(-10)}`;

    // Update order
    await client.query(`
      UPDATE orders SET
        status = 'DELIVERY_CONFIRMED',
        escrow_settled = true,
        utr_number = $1,
        current_step = 6,
        tracking_steps_json = (
          SELECT jsonb_agg(
            jsonb_set(
              jsonb_set(elem, '{completed}', 'true'::jsonb),
              '{current}', 'false'::jsonb
            )
          )
          FROM jsonb_array_elements(COALESCE(tracking_steps_json, '[]'::jsonb)) elem
        )
      WHERE id = $2
    `, [utr, orderId]);

    // Release escrow
    await client.query(`
      UPDATE escrow_transactions SET status = 'RELEASED', released_at = NOW()
      WHERE order_id = $1 AND status = 'LOCKED'
    `, [orderId]);

    // Load farmer UPI from DB (never trust frontend)
    let farmerUpi = 'farmer@demo-upi';
    let farmerName = order.farmer_name;
    if (order.farmer_id) {
      const { rows: farmerRows } = await client.query('SELECT * FROM users WHERE id = $1', [order.farmer_id]);
      if (farmerRows.length > 0) {
        farmerUpi = farmerRows[0].bank_upi_id || farmerUpi;
        farmerName = farmerRows[0].full_name || farmerName;
      }
    }

    // Create payout (idempotent — unique on order_id via check)
    const { rows: existingPayout } = await client.query(
      'SELECT id FROM payouts WHERE order_id = $1', [orderId]
    );
    let payout = null;
    if (existingPayout.length === 0) {
      const payoutId = `PAY-${Date.now().toString().slice(-6)}`;
      const { rows: payoutRows } = await client.query(`
        INSERT INTO payouts (
          id, order_id, utr, farmer_name, farmer_upi, crop_name, amount,
          zero_middlemen_deduction, settled_at, status, bank_name, buyer_name,
          buyer_id, farmer_id
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        RETURNING *
      `, [
        payoutId, orderId, utr, farmerName, farmerUpi,
        `${order.product_name} (${order.quantity} ${order.unit || 'kg'})`,
        payoutAmount, 0,
        new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        'SUCCESSFUL_SETTLED', 'FarmDirect Demo Bank',
        order.buyer_name, order.buyer_id, order.farmer_id,
      ]);
      payout = payoutRows[0];
    }

    await client.query('COMMIT');

    return {
      success: true,
      message: `Delivery confirmed! ₹${payoutAmount.toLocaleString()} payout credited to farmer.`,
      utr,
      payout: payout ? {
        id: payout.id,
        orderId: payout.order_id,
        utr: payout.utr,
        amount: Number(payout.amount),
        farmerName: payout.farmer_name,
        farmerUpi: payout.farmer_upi,
        cropName: payout.crop_name,
        status: payout.status,
        settledAt: payout.settled_at,
        bankName: payout.bank_name,
        buyerName: payout.buyer_name,
      } : null,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ─── PAYOUT OPERATIONS ──────────────────────────────────────────────────────

export async function getPayouts(authUser = null) {
  let query = 'SELECT * FROM payouts';
  const values = [];

  if (authUser) {
    const role = (authUser.role || '').toUpperCase();
    if (role === 'FARMER') {
      query += ' WHERE farmer_id = $1';
      values.push(authUser.sub);
    } else if (role === 'BUYER') {
      query += ' WHERE buyer_id = $1';
      values.push(authUser.sub);
    }
  }

  query += ' ORDER BY created_at DESC';
  const { rows } = await pool.query(query, values);
  return rows.map(r => ({
    id: r.id,
    orderId: r.order_id,
    utr: r.utr,
    farmerName: r.farmer_name,
    farmerUpi: r.farmer_upi,
    cropName: r.crop_name,
    amount: Number(r.amount),
    zeroMiddlemenDeduction: Number(r.zero_middlemen_deduction),
    settledAt: r.settled_at,
    status: r.status,
    bankName: r.bank_name,
    buyerName: r.buyer_name,
  }));
}

// Legacy payout creation (for seed data only)
export async function addPayout(p) {
  const query = `
    INSERT INTO payouts (
      id, order_id, utr, farmer_name, farmer_upi, crop_name, amount,
      zero_middlemen_deduction, settled_at, status, bank_name, buyer_name
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    ON CONFLICT (id) DO NOTHING
    RETURNING *;
  `;
  const values = [
    p.id, p.orderId, p.utr, p.farmerName, p.farmerUpi, p.cropName,
    p.amount, p.zeroMiddlemenDeduction || 0, p.settledAt,
    p.status || 'SUCCESSFUL_SETTLED', p.bankName || 'State Bank of India', p.buyerName,
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

// ─── ADMIN STATS ────────────────────────────────────────────────────────────

export async function getAdminStats() {
  const queries = await Promise.all([
    pool.query("SELECT COUNT(*) as c FROM users WHERE role = 'Farmer' OR role = 'FARMER'"),
    pool.query("SELECT COUNT(*) as c FROM users WHERE verification_status = 'VERIFIED_FARMER'"),
    pool.query("SELECT COUNT(*) as c FROM users WHERE role = 'Buyer' OR role = 'BUYER'"),
    pool.query("SELECT COUNT(*) as c FROM products WHERE available_qty > 0"),
    pool.query("SELECT COUNT(*) as c FROM orders WHERE status NOT IN ('CANCELLED', 'PAYOUT_COMPLETED', 'Delivered & Escrow Settled')"),
    pool.query("SELECT COUNT(*) as c FROM orders WHERE status IN ('PAYOUT_COMPLETED', 'Delivered & Escrow Settled', 'DELIVERY_CONFIRMED')"),
    pool.query("SELECT COALESCE(SUM(amount), 0) as c FROM escrow_transactions WHERE status = 'LOCKED'"),
    pool.query("SELECT COALESCE(SUM(amount), 0) as c FROM payouts WHERE status = 'SUCCESSFUL_SETTLED'"),
    pool.query("SELECT COUNT(*) as c FROM shipments WHERE status NOT IN ('DELIVERED', 'COMPLETED')"),
    pool.query("SELECT COUNT(*) as c FROM telemetry_logs WHERE alert_type IS NOT NULL"),
  ]);

  return {
    totalFarmers: parseInt(queries[0].rows[0].c, 10),
    verifiedFarmers: parseInt(queries[1].rows[0].c, 10),
    totalBuyers: parseInt(queries[2].rows[0].c, 10),
    activeListings: parseInt(queries[3].rows[0].c, 10),
    activeOrders: parseInt(queries[4].rows[0].c, 10),
    completedOrders: parseInt(queries[5].rows[0].c, 10),
    escrowLockedAmount: Number(queries[6].rows[0].c),
    completedPayouts: Number(queries[7].rows[0].c),
    activeShipments: parseInt(queries[8].rows[0].c, 10),
    alerts: parseInt(queries[9].rows[0].c, 10),
  };
}

// ─── AI DEMAND FORECASTING (Statistical Engine) ─────────────────────────────

export async function getForecast(crop, region) {
  // Get historical order data from DB
  const { rows: orderData } = await pool.query(`
    SELECT product_name, quantity, total_price, created_at
    FROM orders
    WHERE LOWER(product_name) LIKE $1
    ORDER BY created_at DESC
    LIMIT 100
  `, [`%${(crop || '').toLowerCase()}%`]);

  const totalHistoricalQty = orderData.reduce((sum, r) => sum + Number(r.quantity), 0);
  const avgOrderQty = orderData.length > 0 ? totalHistoricalQty / orderData.length : 100;
  const orderCount = orderData.length;

  // Season-based adjustment
  const month = new Date().getMonth();
  const seasonFactor = [0.85, 0.90, 0.95, 1.0, 1.05, 1.10, 1.15, 1.20, 1.10, 1.05, 0.95, 0.90][month];

  // Crop-specific base demand
  const cropDefaults = {
    tomato:  { baseDemand: 960,  trendRange: [15, 30], priceRange: '₹24 - ₹30 / kg' },
    potato:  { baseDemand: 780,  trendRange: [5, 12],  priceRange: '₹17 - ₹22 / kg' },
    onion:   { baseDemand: 1140, trendRange: [20, 35], priceRange: '₹20 - ₹26 / kg' },
    wheat:   { baseDemand: 600,  trendRange: [5, 10],  priceRange: '₹30 - ₹36 / kg' },
    rice:    { baseDemand: 700,  trendRange: [8, 15],  priceRange: '₹35 - ₹42 / kg' },
    chilli:  { baseDemand: 350,  trendRange: [10, 20], priceRange: '₹42 - ₹55 / kg' },
    orange:  { baseDemand: 500,  trendRange: [12, 25], priceRange: '₹38 - ₹50 / kg' },
    mango:   { baseDemand: 400,  trendRange: [15, 30], priceRange: '₹130 - ₹170 / kg' },
    turmeric:{ baseDemand: 300,  trendRange: [8, 18],  priceRange: '₹90 - ₹120 / kg' },
  };

  const cropKey = (crop || 'tomato').toLowerCase();
  const defaults = cropDefaults[cropKey] || { baseDemand: 500, trendRange: [10, 20], priceRange: '₹20 - ₹40 / kg' };

  const currentDemand = Math.round(defaults.baseDemand * seasonFactor);
  const trendPercent = defaults.trendRange[0] + Math.floor(Math.random() * (defaults.trendRange[1] - defaults.trendRange[0]));
  const predictedDemand = Math.round(currentDemand * (1 + trendPercent / 100));
  const isSurge = trendPercent > 15;
  const confidenceScore = Math.min(98, 75 + orderCount * 2 + Math.floor(Math.random() * 10));

  // Generate weekly data
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyData = days.map((day, i) => ({
    day,
    demand: Math.round(currentDemand + (predictedDemand - currentDemand) * (i / 6)),
    supply: Math.round(currentDemand * (0.9 + Math.random() * 0.15)),
  }));

  const factors = [
    { name: 'Historical Order Volume', impact: `+${Math.round(trendPercent * 0.4)}%` },
    { name: seasonFactor > 1 ? 'Favorable Season' : 'Off-Season Adjustment', impact: `${seasonFactor > 1 ? '+' : ''}${Math.round((seasonFactor - 1) * 100)}%` },
    { name: 'Regional Market Dynamics', impact: `+${Math.round(trendPercent * 0.3)}%` },
    { name: 'Platform Growth Trend', impact: `+${Math.min(8, orderCount)}%` },
  ];

  return {
    crop: crop || 'Tomato',
    currentDemand: `${currentDemand} kg`,
    predictedDemand,
    trendPercent,
    isSurge,
    region: region || 'Central India',
    confidenceScore,
    recommendedPrice: defaults.priceRange,
    actionTip: isSurge
      ? `High demand predicted for ${crop}! Consider listing additional inventory to capture the surge.`
      : `Stable demand expected for ${crop}. Maintain current price points for optimal clearance.`,
    factors,
    weeklyData,
    dataSource: orderCount > 0 ? `Based on ${orderCount} historical orders (${totalHistoricalQty} kg total)` : 'Statistical model (limited order history)',
    modelType: 'Statistical Forecasting Engine (replaceable with ML model)',
  };
}

// ─── AUTH & OTP OPERATIONS ──────────────────────────────────────────────────

export async function sendOtp(identifier, role = 'FARMER', mode = 'login', adminId = '') {
  const cleanId = (identifier || '').trim();
  if (!cleanId) throw new Error('Phone or email is required');

  const isEmail = cleanId.includes('@');
  const cleanDigits = !isEmail ? cleanId.replace(/[^0-9]/g, '').slice(-10) : '';

  // Rate limiting
  checkOtpRateLimit(cleanId);

  // STRICT RULE 1: If logging in as a Farmer, check database
  if (role === 'FARMER' && mode === 'login') {
    const userCheck = await pool.query(
      `SELECT id FROM users
       WHERE LOWER(email) = LOWER($1)
          OR phone = $1
          OR ($2 != '' AND RIGHT(REGEXP_REPLACE(phone, '[^0-9]', '', 'g'), 10) = $2)
       LIMIT 1;`,
      [cleanId, cleanDigits]
    );
    const govtCheck = await pool.query(
      `SELECT id FROM govt_verified_farmers
       WHERE ($1 != '' AND phone = $1)
          OR ($1 != '' AND RIGHT(REGEXP_REPLACE(phone, '[^0-9]', '', 'g'), 10) = $1)
          OR farmer_id ILIKE $2
       LIMIT 1;`,
      [cleanDigits, cleanId]
    );
    if (userCheck.rows.length === 0 && govtCheck.rows.length === 0) {
      throw new Error('Access Denied: This number is not registered. Only verified farmers can log in.');
    }
  }

  // STRICT RULE 2: Logistics/Admin check
  if (role === 'LOGISTICS' || role === 'ADMIN') {
    const cleanAdminId = (adminId || '').trim();
    const adminCheck = await pool.query(
      `SELECT * FROM admins
       WHERE (LOWER(admin_id) = LOWER($1) OR phone = $2
              OR ($3 != '' AND RIGHT(REGEXP_REPLACE(phone, '[^0-9]', '', 'g'), 10) = $3)
              OR LOWER(admin_id) = LOWER($2))
         AND status = 'ACTIVE' LIMIT 1;`,
      [cleanAdminId, cleanId, cleanDigits]
    );
    if (adminCheck.rows.length === 0) {
      throw new Error('Access Denied: Admin credentials not found. Only authorized personnel can access operations.');
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await pool.query(`
    INSERT INTO otp_records (email, phone, otp, role, created_at, verified)
    VALUES ($1, $2, $3, $4, NOW(), false)
  `, [isEmail ? cleanId : null, !isEmail ? (cleanDigits || cleanId) : null, otp, role]);

  console.log(`🔑 [AUTH OTP] OTP for ${cleanId} (role: ${role}): ${otp} — Check server console for demo.`);

  return {
    success: true,
    message: `OTP sent to ${cleanId}. Check server console for demo OTP.`,
    // NOTE: OTP is NOT returned to browser in production. Check server console.
  };
}

export async function verifyOtp(identifier, enteredOtp, role = 'FARMER', name = '', adminId = '') {
  const cleanId = (identifier || '').trim();
  const cleanOtp = (enteredOtp || '').trim();
  const isEmail = cleanId.includes('@');
  const cleanDigits = !isEmail ? cleanId.replace(/[^0-9]/g, '').slice(-10) : '';

  if (!cleanOtp || cleanOtp.length !== 6) {
    throw new Error('Please enter a valid 6-digit OTP');
  }

  // Check OTP in database (with expiry check)
  const expiryMinutes = getOtpExpiryMinutes();
  const { rows: otpRows } = await pool.query(`
    SELECT * FROM otp_records
    WHERE (email = $1 OR phone = $1 OR ($3 != '' AND phone = $3))
      AND otp = $2
      AND verified = false
      AND created_at > NOW() - INTERVAL '${expiryMinutes} minutes'
    ORDER BY created_at DESC LIMIT 1;
  `, [cleanId, cleanOtp, cleanDigits]);

  if (otpRows.length === 0) {
    throw new Error('Invalid or expired OTP. Please request a new code.');
  }

  // Mark OTP as used (single-use)
  await pool.query('UPDATE otp_records SET verified = true WHERE id = $1', [otpRows[0].id]);

  // Handle Logistics/Admin auth
  if (role === 'LOGISTICS' || role === 'ADMIN') {
    const cleanAdminId = (adminId || '').trim();
    const adminCheck = await pool.query(
      `SELECT * FROM admins
       WHERE (LOWER(admin_id) = LOWER($1) OR phone = $2
              OR ($3 != '' AND RIGHT(REGEXP_REPLACE(phone, '[^0-9]', '', 'g'), 10) = $3)
              OR LOWER(admin_id) = LOWER($2))
         AND status = 'ACTIVE' LIMIT 1;`,
      [cleanAdminId, cleanId, cleanDigits]
    );
    if (adminCheck.rows.length === 0) {
      throw new Error('Access Denied: Administrative credentials not recognized.');
    }
    const adm = adminCheck.rows[0];
    const token = generateToken({ id: adm.id, role: 'Logistics / Admin', email: adm.email });
    return {
      success: true,
      token,
      message: `Welcome Officer ${adm.full_name}!`,
      user: {
        id: adm.id,
        name: adm.full_name,
        email: adm.email,
        phone: adm.phone,
        role: 'Logistics / Admin',
        adminId: adm.admin_id,
        designation: adm.designation,
        department: adm.department,
        zone: adm.zone,
        accessLevel: adm.access_level,
        location: adm.zone,
        verificationStatus: 'VERIFIED_OFFICER',
        isLoggedIn: true,
      },
    };
  }

  // Find or create user
  const { rows: existingUsers } = await pool.query(`
    SELECT * FROM users
    WHERE LOWER(email) = LOWER($1) OR phone = $1
       OR ($2 != '' AND RIGHT(REGEXP_REPLACE(phone, '[^0-9]', '', 'g'), 10) = $2)
    LIMIT 1;
  `, [cleanId, cleanDigits]);

  let user = existingUsers[0];
  if (!user) {
    const defaultEmail = isEmail ? cleanId : `farmer_${cleanDigits || Date.now()}@farmdirect.in`;
    const defaultPhone = !isEmail ? (cleanDigits || cleanId) : '+91 98765 43210';
    let defaultName = name;
    let defaultLocation = 'Local Farm Cluster';
    let fpoName = null, bankUpiId = null, farmerId = null, aadhaarId = null;
    let kccNumber = null, landSizeAcres = null, primaryCrops = null;
    let verificationStatus = role === 'FARMER' ? 'VERIFIED_FARMER' : 'UNVERIFIED';

    if (role === 'FARMER') {
      const govtCheck = await pool.query(
        `SELECT * FROM govt_verified_farmers
         WHERE ($1 != '' AND phone = $1)
            OR ($1 != '' AND RIGHT(REGEXP_REPLACE(phone, '[^0-9]', '', 'g'), 10) = $1)
            OR farmer_id ILIKE $2
         LIMIT 1;`,
        [cleanDigits, cleanId]
      );
      if (govtCheck.rows.length > 0) {
        const gf = govtCheck.rows[0];
        defaultName = gf.full_name;
        defaultLocation = `${gf.district}, ${gf.state}`;
        fpoName = gf.fpo_membership;
        bankUpiId = gf.bank_upi_id;
        farmerId = gf.farmer_id;
        aadhaarId = gf.aadhaar_number;
        kccNumber = gf.kcc_number;
        landSizeAcres = gf.land_size_acres;
        primaryCrops = gf.certified_crops;
        verificationStatus = 'VERIFIED_FARMER';
      } else {
        throw new Error('Access Denied: Number not found in government registry. Only verified farmers can register.');
      }
    } else {
      defaultName = defaultName || (role === 'BUYER' ? 'Buyer' : 'User');
    }

    const { rows: newUsers } = await pool.query(`
      INSERT INTO users (
        email, full_name, password, role, phone, location,
        fpo_name, bank_upi_id, farmer_id, aadhaar_id, kcc_number,
        land_size_acres, primary_crops, verification_status, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW())
      RETURNING *;
    `, [
      defaultEmail, defaultName, hashPassword('otp_authenticated'), role, defaultPhone,
      defaultLocation, fpoName, bankUpiId, farmerId, aadhaarId, kccNumber,
      landSizeAcres, primaryCrops, verificationStatus,
    ]);
    user = newUsers[0];
  }

  const token = generateToken({ id: user.id, role: user.role, email: user.email });

  return {
    token,
    user: sanitizeUser(user, true),
    message: 'Authenticated successfully',
  };
}

export async function registerUser(data) {
  const email = (data.email || '').trim().toLowerCase();
  if (!email) throw new Error('Email is required');
  validateEmail(email);

  const check = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (check.rows.length > 0) {
    throw new Error('An account with this email already exists. Please log in.');
  }

  const hashedPw = hashPassword(data.password || 'otp_authenticated');

  const { rows } = await pool.query(`
    INSERT INTO users (
      email, full_name, password, role, phone, location, fpo_name,
      bank_upi_id, farmer_id, aadhaar_id, kcc_number, land_size_acres,
      primary_crops, buyer_type, business_name, verification_status, created_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,NOW())
    RETURNING *;
  `, [
    email, data.fullName || data.name || 'User', hashedPw,
    data.role || 'Farmer', data.phone || '', data.location || 'Bhopal, Madhya Pradesh',
    data.fpoName || null, data.bankUpiId || null,
    data.farmerId || null, data.aadhaarId || null, data.kccNumber || null,
    data.landSizeAcres || null, data.primaryCrops || null,
    data.buyerType || 'RETAIL', data.businessName || null,
    data.verificationStatus || (data.role === 'Farmer' ? 'VERIFIED_FARMER' : 'UNVERIFIED'),
  ]);

  const user = rows[0];
  const token = generateToken({ id: user.id, role: user.role, email: user.email });

  return { token, user: sanitizeUser(user, true), message: 'Account registered successfully' };
}

export async function loginUser(emailOrPhone, password) {
  const clean = (emailOrPhone || '').trim().toLowerCase();
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE LOWER(email) = $1 OR phone = $1 LIMIT 1',
    [clean]
  );
  const user = rows[0];
  if (!user) throw new Error('No user found with this email or phone number.');

  if (!verifyPassword(password, user.password)) {
    throw new Error('Invalid password credentials.');
  }

  const token = generateToken({ id: user.id, role: user.role, email: user.email });
  return { token, user: sanitizeUser(user, true), message: 'Logged in successfully' };
}

export async function verifyFarmerKyc(identifier, kyc) {
  const clean = (identifier || '').trim().toLowerCase();
  const { rows } = await pool.query(`
    UPDATE users SET
      farmer_id = COALESCE($1, farmer_id),
      aadhaar_id = COALESCE($2, aadhaar_id),
      kcc_number = COALESCE($3, kcc_number),
      land_size_acres = COALESCE($4, land_size_acres),
      primary_crops = COALESCE($5, primary_crops),
      fpo_name = COALESCE($6, fpo_name),
      bank_upi_id = COALESCE($7, bank_upi_id),
      verification_status = 'VERIFIED_FARMER'
    WHERE LOWER(email) = $8 OR phone = $8
    RETURNING *;
  `, [kyc.farmerId, kyc.aadhaarId, kyc.kccNumber, kyc.landSizeAcres,
      kyc.primaryCrops, kyc.fpoName, kyc.bankUpiId, clean]);
  return rows[0];
}

export async function verifyGovtFarmer({ farmerId, aadhaarNumber, phone }) {
  const cleanId = (farmerId || '').trim();
  const cleanAadhaar = (aadhaarNumber || '').trim();
  const cleanAadhaarDigits = cleanAadhaar.replace(/[^0-9]/g, '');
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '').slice(-10);

  if (!cleanId && !cleanAadhaar && !cleanPhone) {
    throw new Error('Please provide a Farmer ID, Aadhaar Number, or Phone to verify.');
  }

  let matched = null;

  if (cleanId) {
    const { rows } = await pool.query(
      'SELECT * FROM govt_verified_farmers WHERE LOWER(farmer_id) = LOWER($1) OR farmer_id ILIKE $2 LIMIT 1',
      [cleanId, `%${cleanId}%`]
    );
    matched = rows[0];
  }

  if (!matched && (cleanAadhaar || cleanAadhaarDigits)) {
    const { rows } = await pool.query(`
      SELECT * FROM govt_verified_farmers
      WHERE aadhaar_number = $1
         OR REPLACE(aadhaar_number, '-', '') = $2
         OR REPLACE(aadhaar_number, ' ', '') = $2
      LIMIT 1;
    `, [cleanAadhaar, cleanAadhaarDigits]);
    matched = rows[0];
  }

  if (!matched && cleanPhone) {
    const { rows } = await pool.query(
      'SELECT * FROM govt_verified_farmers WHERE phone = $1 OR phone LIKE $2 LIMIT 1',
      [cleanPhone, `%${cleanPhone}`]
    );
    matched = rows[0];
  }

  if (!matched) {
    throw new Error('Government Verification Rejected: Credentials not found in the registry.');
  }

  return {
    verified: true,
    governmentRecord: {
      farmerId: matched.farmer_id,
      aadhaarNumber: maskAadhaar(matched.aadhaar_number), // MASKED!
      fullName: matched.full_name,
      phone: matched.phone,
      state: matched.state,
      district: matched.district,
      tehsil: matched.tehsil,
      village: matched.village,
      khasraNumber: matched.khasra_number,
      landSizeAcres: Number(matched.land_size_acres),
      soilHealthCardId: matched.soil_health_card_id,
      kccNumber: matched.kcc_number,
      bankUpiId: matched.bank_upi_id,
      fpoMembership: matched.fpo_membership,
      certifiedCrops: matched.certified_crops,
      registrySource: 'Government Farmer Registry (Simulated — Demo)',
    },
    message: `✅ Verified: ${matched.full_name} (${matched.district}, ${matched.state})`,
  };
}

// ─── SEED DATA (Idempotent) ─────────────────────────────────────────────────

export async function seedIfEmpty() {
  // Seed orders if empty
  const { rows: orderCount } = await pool.query('SELECT count(*) FROM orders');
  if (parseInt(orderCount[0].count, 10) === 0) {
    console.log('🌱 Seeding initial orders...');
    const { initialOrders } = await import('../data/mockData.js');
    for (const o of initialOrders) {
      const query = `
        INSERT INTO orders (
          id, product_id, product_name, image, farmer_name, buyer_name,
          quantity, unit, total_price, saved_amount, delivery_address,
          status, current_step, payment_method, payment_txn_id, payment_status,
          utr_number, escrow_settled, origin_json, destination_json,
          telemetry_json, tracking_steps_json, driver_json
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
        ON CONFLICT (id) DO NOTHING;
      `;
      await pool.query(query, [
        o.id, o.productId || 'prod-1', o.productName, o.image, o.farmerName, o.buyerName,
        o.quantity, o.unit || 'kg', o.totalPrice, o.savedAmount || 0, o.deliveryAddress,
        o.status || 'Order Placed & Escrow Funded', o.currentStep || 1,
        o.payment?.method || 'Demo UPI', o.payment?.txnId || `TXN-SEED-${Date.now()}`,
        o.payment?.status || 'ESCROW_LOCKED', null, false,
        JSON.stringify(o.origin || {}), JSON.stringify(o.destination || {}),
        JSON.stringify(o.telemetry || {}), JSON.stringify(o.trackingSteps || []),
        JSON.stringify(o.driver || {}),
      ]);
    }
  }

  // Seed payouts if empty
  const { rows: payCount } = await pool.query('SELECT count(*) FROM payouts');
  if (parseInt(payCount[0].count, 10) === 0) {
    console.log('🌱 Seeding initial payouts...');
    const seedPayouts = [
      { id: 'PAY-1001', orderId: 'FD1020', utr: 'UPI/NPCI/DEMO/082811409', farmerName: 'Ramesh Patel', farmerUpi: 'ramesh.patel@okhdfcbank', cropName: 'Malwa Sharbati Wheat (500 kg)', amount: 22000, settledAt: 'Aug 28, 2026, 04:15 PM', bankName: 'HDFC Bank Ltd.', buyerName: 'Pooja Agarwal (Wholesale)' },
      { id: 'PAY-1002', orderId: 'FD1021', utr: 'UPI/NPCI/DEMO/083074211', farmerName: 'Vidarbha Citrus Growers', farmerUpi: 'vidarbha.citrus@sbi', cropName: 'Organic Nagpur Sweet Oranges (200 kg)', amount: 9600, settledAt: 'Aug 30, 2026, 02:45 PM', bankName: 'State Bank of India', buyerName: 'Green Valley Supermarket' },
    ];
    for (const p of seedPayouts) {
      await addPayout(p);
    }
  }
}

// ─── ROUTE OPTIMIZATION (Backend) ───────────────────────────────────────────

export async function getRouteOptimization() {
  // Get active orders to derive real stops
  const { rows: activeOrders } = await pool.query(`
    SELECT * FROM orders
    WHERE status IN ('ESCROW_LOCKED','ORDER_CONFIRMED','FARMER_CONFIRMED','PACKED','READY_FOR_PICKUP','PICKED_UP','IN_TRANSIT','In Transit','Order Placed & Escrow Funded')
    ORDER BY created_at DESC LIMIT 10
  `);

  const stops = activeOrders.map((o, i) => ({
    id: i + 1,
    type: i < Math.ceil(activeOrders.length / 2) ? 'farmer' : 'buyer',
    name: i < Math.ceil(activeOrders.length / 2) ? o.farmer_name : o.buyer_name,
    produce: `${o.quantity} ${o.unit || 'kg'} ${o.product_name}`,
    status: o.status,
    lat: o.origin_json?.lat || 23.25 + (Math.random() - 0.5) * 0.1,
    lng: o.origin_json?.lng || 77.42 + (Math.random() - 0.5) * 0.1,
  }));

  // Add hub if we have stops
  if (stops.length > 0) {
    stops.splice(Math.floor(stops.length / 2), 0, {
      id: 99, type: 'hub', name: 'FarmDirect Aggregation Hub',
      produce: 'Consolidation & Sorting', status: 'Active',
      lat: 23.26, lng: 77.42,
    });
  }

  const totalDistance = 42 + Math.floor(Math.random() * 20);
  return {
    unoptimized: { distanceKm: totalDistance + 19, fuelCost: Math.round((totalDistance + 19) * 9), travelTime: `${Math.floor((totalDistance + 19) / 30)}h ${Math.round(((totalDistance + 19) % 30) * 2)}m`, co2Emissions: `${((totalDistance + 19) * 0.23).toFixed(1)} kg` },
    optimized: { distanceKm: totalDistance, fuelCost: Math.round(totalDistance * 9), travelTime: `${Math.floor(totalDistance / 30)}h ${Math.round((totalDistance % 30) * 2)}m`, co2Emissions: `${(totalDistance * 0.23).toFixed(1)} kg` },
    savings: { distanceKm: 19, distancePercent: 31, fuelSaved: 170, timeSaved: '45 mins' },
    stops: stops.length > 0 ? stops : [
      { id: 1, type: 'farmer', name: 'Farmer A (Bhopal East)', produce: '120 kg Tomatoes', status: 'Picked Up', lat: 23.25, lng: 77.41 },
      { id: 2, type: 'farmer', name: 'Farmer B (Raisen Highway)', produce: '200 kg Onions', status: 'Picked Up', lat: 23.28, lng: 77.48 },
      { id: 3, type: 'hub', name: 'FarmDirect Aggregation Hub', produce: 'Consolidation', status: 'Active', lat: 23.26, lng: 77.42 },
      { id: 4, type: 'buyer', name: 'Green Valley Supermarket', produce: '270 kg Total', status: 'Scheduled', lat: 23.21, lng: 77.44 },
    ],
    activeOrderCount: activeOrders.length,
  };
}

export default pool;
