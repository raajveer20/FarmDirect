import pg from 'pg';
import { initialProducts, initialOrders } from '../data/mockData.js';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const pool = connectionString
  ? new pg.Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    })
  : new pg.Pool({
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '0920',
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

// ================= PRODUCT OPERATIONS =================
export async function getProducts() {
  const { rows } = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  return rows.map(r => ({
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
    description: r.description
  }));
}

export async function addProduct(p) {
  const query = `
    INSERT INTO products (
      id, name, category, price_per_kg, traditional_price, consumer_price,
      available_qty, unit, quality_grade, is_organic, farmer_name, farmer_contact,
      farmer_rating, farmer_location, state, distance_km, estimated_delivery,
      image, harvest_date, description
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      price_per_kg = EXCLUDED.price_per_kg,
      available_qty = EXCLUDED.available_qty
    RETURNING *;
  `;
  const values = [
    p.id, p.name, p.category, p.pricePerKg, p.traditionalPrice || Math.round(p.pricePerKg * 1.7), p.consumerPrice || Math.round(p.pricePerKg * 1.2),
    p.availableQty, p.unit || 'kg', p.qualityGrade || 'Grade A', p.isOrganic || false,
    p.farmer || p.farmerName || 'Verified Producer', p.farmerContact || '+91 00000 00000', p.farmerRating || 4.9,
    p.farmerLocation || 'Local Farm Cluster', p.state || 'India', p.distanceKm || 12.0,
    p.estimatedDelivery || 'Same Day (4 Hours)', p.image || '/images/oranges.jpg', p.harvestDate || '2026-08-30', p.description || ''
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

// ================= ORDER OPERATIONS =================
export async function getOrders() {
  const { rows } = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
  return rows.map(r => ({
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
      method: r.payment_method || 'UPI Instant',
      txnId: r.payment_txn_id,
      status: r.payment_status || 'ESCROW_LOCKED',
      amount: Number(r.total_price),
      bankName: 'State Bank of India (Escrow Trust)',
      vpa: 'buyer@okhdfcbank'
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
    driver: r.driver_json
  }));
}

export async function addOrder(o) {
  const query = `
    INSERT INTO orders (
      id, product_id, product_name, image, farmer_name, buyer_name,
      quantity, unit, total_price, saved_amount, delivery_address,
      status, current_step, payment_method, payment_txn_id, payment_status,
      utr_number, escrow_settled, origin_json, destination_json,
      telemetry_json, tracking_steps_json, driver_json
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
    ) 
    ON CONFLICT (id) DO UPDATE SET
      status = EXCLUDED.status,
      current_step = EXCLUDED.current_step
    RETURNING *;
  `;
  const values = [
    o.id, o.productId || 'prod-1', o.productName, o.image || '/images/oranges.jpg', o.farmerName, o.buyerName,
    o.quantity, o.unit || 'kg', o.totalPrice, o.savedAmount || 0, o.deliveryAddress,
    o.status || 'Order Placed & Escrow Funded', o.currentStep || 1,
    o.payment?.method || o.paymentMethod || 'UPI Instant',
    o.payment?.txnId || o.paymentTxnId || `TXN-FD-UPI-${Date.now().toString().slice(-6)}`,
    o.payment?.status || o.paymentStatus || 'ESCROW_LOCKED',
    o.utrNumber || null, o.escrowSettled || false,
    JSON.stringify(o.origin || {}),
    JSON.stringify(o.destination || {}),
    JSON.stringify(o.telemetry || {}),
    JSON.stringify(o.trackingSteps || []),
    JSON.stringify(o.driver || {})
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function updateOrder(id, status, extra = {}) {
  let query = 'UPDATE orders SET status = $1';
  const values = [status];
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

  query += ` WHERE id = $${paramIdx} RETURNING *;`;
  values.push(id);

  const { rows } = await pool.query(query, values);
  return rows[0];
}

// ================= PAYOUT OPERATIONS =================
export async function getPayouts() {
  const { rows } = await pool.query('SELECT * FROM payouts ORDER BY created_at DESC');
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
    buyerName: r.buyer_name
  }));
}

export async function addPayout(p) {
  const query = `
    INSERT INTO payouts (
      id, order_id, utr, farmer_name, farmer_upi, crop_name, amount,
      zero_middlemen_deduction, settled_at, status, bank_name, buyer_name
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    ON CONFLICT (id) DO NOTHING
    RETURNING *;
  `;
  const values = [
    p.id, p.orderId, p.utr, p.farmerName, p.farmerUpi, p.cropName,
    p.amount, p.zeroMiddlemenDeduction || 0, p.settledAt,
    p.status || 'SUCCESSFUL_SETTLED', p.bankName || 'State Bank of India', p.buyerName
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

// ================= SEED INITIAL DATA =================
export async function seedIfEmpty() {
  // Products table is intentionally kept clean so only real listings created by logged-in farmers appear.

  const { rows: orderCount } = await pool.query('SELECT count(*) FROM orders');
  if (parseInt(orderCount[0].count, 10) === 0) {
    console.log('🌱 Seeding initial orders into PostgreSQL...');
    for (const o of initialOrders) {
      await addOrder(o);
    }
  }

  const { rows: payCount } = await pool.query('SELECT count(*) FROM payouts');
  if (parseInt(payCount[0].count, 10) === 0) {
    console.log('🌱 Seeding initial payouts into PostgreSQL...');
    const seedPayouts = [
      {
        id: 'PAY-1001',
        orderId: 'FD1020',
        utr: 'UPI/NPCI/2026/082811409',
        farmerName: 'Ramesh Patel',
        farmerUpi: 'ramesh.patel@okhdfcbank',
        cropName: 'Malwa Sharbati Wheat (500 kg)',
        amount: 22000,
        zeroMiddlemenDeduction: 0,
        settledAt: 'Aug 28, 2026, 04:15 PM',
        status: 'SUCCESSFUL_SETTLED',
        bankName: 'HDFC Bank Ltd.',
        buyerName: 'Pooja Agarwal (Wholesale)'
      },
      {
        id: 'PAY-1002',
        orderId: 'FD1021',
        utr: 'UPI/NPCI/2026/083074211',
        farmerName: 'Vidarbha Citrus Growers',
        farmerUpi: 'vidarbha.citrus@sbi',
        cropName: 'Organic Nagpur Sweet Oranges (200 kg)',
        amount: 9600,
        zeroMiddlemenDeduction: 0,
        settledAt: 'Aug 30, 2026, 02:45 PM',
        status: 'SUCCESSFUL_SETTLED',
        bankName: 'State Bank of India',
        buyerName: 'Green Valley Supermarket'
      }
    ];
    for (const p of seedPayouts) {
      await addPayout(p);
    }
  }
}

// ================= AUTH & OTP OPERATIONS =================
export async function sendOtp(identifier, role = 'FARMER', mode = 'login', adminId = '') {
  const cleanId = (identifier || '').trim();
  const isEmail = cleanId.includes('@');
  const cleanDigits = !isEmail ? cleanId.replace(/[^0-9]/g, '').slice(-10) : '';

  // STRICT RULE 1: If logging in as a Farmer, ANY number not in our database is NOT allowed to enter!
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
      throw new Error(
        `❌ Access Denied: Mobile number (+91 ${cleanDigits || cleanId}) is not registered in our database. Only registered/verified farmers can log in. Commercial middlemen and unverified numbers are strictly blocked.`
      );
    }
  }

  // STRICT RULE 2: If logging in as Logistics / Admin, check the admins database table!
  if (role === 'LOGISTICS' || role === 'ADMIN') {
    const cleanAdminId = (adminId || '').trim();
    const adminCheck = await pool.query(
      `SELECT * FROM admins 
       WHERE (
         LOWER(admin_id) = LOWER($1) 
         OR phone = $2 
         OR ($3 != '' AND RIGHT(REGEXP_REPLACE(phone, '[^0-9]', '', 'g'), 10) = $3)
         OR LOWER(admin_id) = LOWER($2)
       )
       AND status = 'ACTIVE'
       LIMIT 1;`,
      [cleanAdminId, cleanId, cleanDigits]
    );

    if (adminCheck.rows.length === 0) {
      throw new Error(
        `❌ Access Denied: Admin ID (${cleanAdminId || 'N/A'}) and phone (+91 ${cleanDigits || cleanId}) not found in the Official Operations & Logistics Database. Only authorized administrative personnel can access command operations.`
      );
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const query = `
    INSERT INTO otp_records (email, phone, otp, role, created_at, verified)
    VALUES ($1, $2, $3, $4, NOW(), false)
    RETURNING *;
  `;
  const values = [
    isEmail ? cleanId : null,
    !isEmail ? (cleanDigits || cleanId) : null,
    otp,
    role
  ];
  await pool.query(query, values);
  console.log(`🔑 [AUTH OTP] Sent OTP ${otp} to ${cleanId} for role ${role}`);

  return {
    success: true,
    message: `OTP sent successfully to ${cleanId}`,
    demoOtp: otp
  };
}

export async function verifyOtp(identifier, enteredOtp, role = 'FARMER', name = '', adminId = '') {
  const cleanId = (identifier || '').trim();
  const cleanOtp = (enteredOtp || '').trim();
  const isEmail = cleanId.includes('@');
  const cleanDigits = !isEmail ? cleanId.replace(/[^0-9]/g, '').slice(-10) : '';

  // Check in PostgreSQL otp_records (matches email or normalized 10-digit phone)
  const checkQuery = `
    SELECT * FROM otp_records 
    WHERE (email = $1 OR phone = $1 OR ($3 != '' AND phone = $3)) 
      AND otp = $2 
      AND verified = false
    ORDER BY created_at DESC LIMIT 1;
  `;
  const { rows: otpRows } = await pool.query(checkQuery, [cleanId, cleanOtp, cleanDigits]);

  // If found or if demo fallback code is used
  const isValid = otpRows.length > 0 || cleanOtp === '123456';
  if (!isValid) {
    throw new Error('Invalid or expired OTP. Please check the code and try again.');
  }

  // Mark OTP as verified
  if (otpRows.length > 0) {
    await pool.query('UPDATE otp_records SET verified = true WHERE id = $1', [otpRows[0].id]);
  }

  // Handle Logistics / Admin Authentication via admins table
  if (role === 'LOGISTICS' || role === 'ADMIN') {
    const cleanAdminId = (adminId || '').trim();
    const adminCheck = await pool.query(
      `SELECT * FROM admins 
       WHERE (
         LOWER(admin_id) = LOWER($1) 
         OR phone = $2 
         OR ($3 != '' AND RIGHT(REGEXP_REPLACE(phone, '[^0-9]', '', 'g'), 10) = $3)
         OR LOWER(admin_id) = LOWER($2)
       )
       AND status = 'ACTIVE'
       LIMIT 1;`,
      [cleanAdminId, cleanId, cleanDigits]
    );

    if (adminCheck.rows.length === 0) {
      throw new Error(
        `❌ Access Denied: Administrative credentials not recognized in the official database.`
      );
    }

    const adm = adminCheck.rows[0];
    const token = `token-admin-${adm.admin_id}-${Date.now()}`;
    return {
      success: true,
      token,
      message: `Authentication verified. Welcome Officer ${adm.full_name}!`,
      user: {
        id: adm.id,
        name: adm.full_name,
        email: adm.email,
        phone: adm.phone,
        role: 'Logistics',
        adminId: adm.admin_id,
        designation: adm.designation,
        department: adm.department,
        zone: adm.zone,
        accessLevel: adm.access_level,
        location: adm.zone,
        verificationStatus: 'VERIFIED_OFFICER',
        isLoggedIn: true
      }
    };
  }

  // Check or create user in users table (matches exact email or normalized 10-digit phone)
  const userCheckQuery = `
    SELECT * FROM users 
    WHERE LOWER(email) = LOWER($1) 
       OR phone = $1 
       OR ($2 != '' AND RIGHT(REGEXP_REPLACE(phone, '[^0-9]', '', 'g'), 10) = $2)
    LIMIT 1;
  `;
  const { rows: existingUsers } = await pool.query(userCheckQuery, [cleanId, cleanDigits]);

  let user = existingUsers[0];
  if (!user) {
    const defaultEmail = isEmail ? cleanId : `farmer_${cleanDigits || Date.now()}@farmdirect.in`;
    const defaultPhone = !isEmail ? (cleanDigits || cleanId) : '+91 98765 43210';
    let defaultName = name;
    let defaultLocation = 'Local Farm Cluster';
    let fpoName = null;
    let bankUpiId = null;
    let farmerId = null;
    let aadhaarId = null;
    let kccNumber = null;
    let landSizeAcres = null;
    let primaryCrops = null;
    let verificationStatus = role === 'FARMER' ? 'VERIFIED_FARMER' : 'UNVERIFIED';

    // If it's a farmer, strictly verify against official government land registry!
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
        // STRICT REJECTION: ANY NUMBER DIFFERENT FROM DATABASE CANNOT ENTER!
        throw new Error(
          `❌ Access Denied: Mobile number (+91 ${cleanDigits || cleanId}) is not registered in our database. Commercial middlemen and unverified entities cannot enter FarmDirect.`
        );
      }
    } else {
      defaultName = defaultName || (role === 'BUYER' ? 'Pooja Agarwal' : 'Fleet Dispatcher');
    }

    const insertQuery = `
      INSERT INTO users (
        email, full_name, password, role, phone, location,
        fpo_name, bank_upi_id, farmer_id, aadhaar_id, kcc_number,
        land_size_acres, primary_crops, verification_status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
      RETURNING *;
    `;
    const insertValues = [
      defaultEmail, defaultName, 'otp_authenticated', role, defaultPhone,
      defaultLocation, fpoName, bankUpiId, farmerId, aadhaarId, kccNumber,
      landSizeAcres, primaryCrops, verificationStatus
    ];
    const { rows: newUsers } = await pool.query(insertQuery, insertValues);
    user = newUsers[0];
  }

  const token = `jwt-fd-${user.id}-${Date.now()}`;

  return {
    token,
    user: {
      id: user.id,
      name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      location: user.location,
      verificationStatus: user.verification_status,
      fpoName: user.fpo_name,
      bankUpiId: user.bank_upi_id,
      farmerId: user.farmer_id,
      aadhaarId: user.aadhaar_id,
      kccNumber: user.kcc_number,
      landSizeAcres: user.land_size_acres,
      primaryCrops: user.primary_crops,
      buyerType: user.buyer_type,
      businessName: user.business_name,
      isLoggedIn: true
    },
    message: 'Authenticated successfully'
  };
}

export async function registerUser(data) {
  const email = (data.email || '').trim().toLowerCase();
  if (!email) throw new Error('Email is required');

  const check = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (check.rows.length > 0) {
    throw new Error('An account with this email already exists. Please log in.');
  }

  const query = `
    INSERT INTO users (
      email, full_name, password, role, phone, location, fpo_name,
      bank_upi_id, farmer_id, aadhaar_id, kcc_number, land_size_acres,
      primary_crops, buyer_type, business_name, verification_status, created_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW()
    ) RETURNING *;
  `;
  const values = [
    email,
    data.fullName || data.name || 'User',
    data.password || 'secure_pass',
    data.role || 'Farmer',
    data.phone || '',
    data.location || 'Bhopal, Madhya Pradesh',
    data.fpoName || null,
    data.bankUpiId || 'farmer@upi',
    data.farmerId || null,
    data.aadhaarId || null,
    data.kccNumber || null,
    data.landSizeAcres || null,
    data.primaryCrops || null,
    data.buyerType || 'RETAIL',
    data.businessName || null,
    data.verificationStatus || (data.role === 'Farmer' ? 'VERIFIED_FARMER' : 'UNVERIFIED')
  ];
  const { rows } = await pool.query(query, values);
  const user = rows[0];
  const token = `jwt-fd-${user.id}-${Date.now()}`;

  return {
    token,
    user: {
      id: user.id,
      name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      location: user.location,
      verificationStatus: user.verification_status,
      fpoName: user.fpo_name,
      bankUpiId: user.bank_upi_id,
      farmerId: user.farmer_id,
      aadhaarId: user.aadhaar_id,
      kccNumber: user.kcc_number,
      landSizeAcres: user.land_size_acres,
      primaryCrops: user.primary_crops,
      buyerType: user.buyer_type,
      businessName: user.business_name,
      isLoggedIn: true
    },
    message: 'Account registered successfully in PostgreSQL'
  };
}

export async function loginUser(emailOrPhone, password) {
  const clean = (emailOrPhone || '').trim().toLowerCase();
  const query = `
    SELECT * FROM users WHERE LOWER(email) = $1 OR phone = $1 LIMIT 1;
  `;
  const { rows } = await pool.query(query, [clean]);
  const user = rows[0];

  if (!user) {
    throw new Error('No user found with this email or phone number.');
  }

  if (user.password !== password && user.password !== 'otp_authenticated') {
    throw new Error('Invalid password credentials.');
  }

  const token = `jwt-fd-${user.id}-${Date.now()}`;
  return {
    token,
    user: {
      id: user.id,
      name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      location: user.location,
      verificationStatus: user.verification_status,
      fpoName: user.fpo_name,
      bankUpiId: user.bank_upi_id,
      farmerId: user.farmer_id,
      aadhaarId: user.aadhaar_id,
      kccNumber: user.kcc_number,
      landSizeAcres: user.land_size_acres,
      primaryCrops: user.primary_crops,
      buyerType: user.buyer_type,
      businessName: user.business_name,
      isLoggedIn: true
    },
    message: 'Logged in successfully'
  };
}

export async function verifyFarmerKyc(identifier, kyc) {
  const clean = (identifier || '').trim().toLowerCase();
  const query = `
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
  `;
  const values = [
    kyc.farmerId, kyc.aadhaarId, kyc.kccNumber, kyc.landSizeAcres,
    kyc.primaryCrops, kyc.fpoName, kyc.bankUpiId, clean
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function verifyGovtFarmer({ farmerId, aadhaarNumber, phone }) {
  const cleanId = (farmerId || '').trim();
  const cleanAadhaar = (aadhaarNumber || '').trim();
  const cleanAadhaarDigits = cleanAadhaar.replace(/[^0-9]/g, '');
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '').slice(-10);

  if (!cleanId && !cleanAadhaar && !cleanPhone) {
    throw new Error('Please provide a Government Farmer ID, Aadhaar Number, or Registered Mobile Number to verify.');
  }

  let matched = null;

  // 1. Search by Farmer ID (case-insensitive & trimmed)
  if (cleanId) {
    const { rows } = await pool.query(
      `SELECT * FROM govt_verified_farmers WHERE LOWER(farmer_id) = LOWER($1) OR farmer_id ILIKE $2 LIMIT 1;`,
      [cleanId, `%${cleanId}%`]
    );
    matched = rows[0];
  }

  // 2. If not found by Farmer ID, search by Aadhaar Number (supports with or without hyphens / spaces)
  if (!matched && (cleanAadhaar || cleanAadhaarDigits)) {
    const { rows } = await pool.query(
      `SELECT * FROM govt_verified_farmers 
       WHERE aadhaar_number = $1 
          OR REPLACE(aadhaar_number, '-', '') = $2
          OR REPLACE(aadhaar_number, ' ', '') = $2
       LIMIT 1;`,
      [cleanAadhaar, cleanAadhaarDigits]
    );
    matched = rows[0];
  }

  // 3. If still not found, search by Phone (supports with or without +91 / spaces)
  if (!matched && cleanPhone) {
    const { rows } = await pool.query(
      `SELECT * FROM govt_verified_farmers WHERE phone = $1 OR phone LIKE $2 LIMIT 1;`,
      [cleanPhone, `%${cleanPhone}`]
    );
    matched = rows[0];
  }

  if (!matched) {
    throw new Error(
      `❌ Government Verification Rejected: Credentials [ID: "${cleanId || 'None'}", Aadhaar: "${cleanAadhaar || 'None'}"] not found in the official PM-Kisan & Bhulekh Land Records Registry. Unverified entities and commercial middlemen cannot register as Farmers on FarmDirect.`
    );
  }

  return {
    verified: true,
    governmentRecord: {
      farmerId: matched.farmer_id,
      aadhaarNumber: matched.aadhaar_number,
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
      registrySource: 'Ministry of Agriculture - PM-Kisan & State Bhulekh Land Registry'
    },
    message: `✅ Authenticated as Government-Verified Farmer: ${matched.full_name} (${matched.khasra_number}, ${matched.district}, ${matched.state})`
  };
}

export default pool;
