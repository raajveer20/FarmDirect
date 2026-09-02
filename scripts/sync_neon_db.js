import pg from 'pg';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('❌ No DATABASE_URL found in environment.');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function syncNeon() {
  console.log('🚀 Connecting to Neon Cloud PostgreSQL:', connectionString.split('@')[1]?.split('/')[0]);

  // 1. Create tables
  const schemaSql = `
    -- Products
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

    -- Orders
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

    -- Payouts
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

    -- Users
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

    -- OTP Records
    CREATE TABLE IF NOT EXISTS otp_records (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255),
      phone VARCHAR(50),
      otp VARCHAR(10) NOT NULL,
      role VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW(),
      verified BOOLEAN DEFAULT false
    );

    -- Government Verified Farmers Registry
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
      certified_crops VARCHAR(255)
    );

    -- Admins Table
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
  `;

  await pool.query(schemaSql);
  console.log('✅ Schema tables verified/created in Neon Cloud DB.');

  // 2. Seed govt_verified_farmers
  const farmers = [
    {
      farmer_id: 'MP-SEH-2024-8841',
      full_name: 'Ramesh Patel',
      aadhaar_number: '9823-4512-6701',
      khasra_number: 'Khasra #214/1',
      village: 'Bhaironda',
      tehsil: 'Budhni',
      district: 'Sehore',
      state: 'Madhya Pradesh',
      land_size_acres: 4.5,
      phone: '9876543210',
      kcc_number: 'KCC-SBI-992140',
      fpo_membership: 'Narmada Valley Farmers Producer Co.',
      bank_upi_id: 'ramesh.patel@okhdfcbank',
      certified_crops: 'Sharbati Wheat, Soybeans, Chana'
    },
    {
      farmer_id: 'MH-NSK-2024-5120',
      full_name: 'Sunita Bai Deshmukh',
      aadhaar_number: '8744-1290-3341',
      khasra_number: 'Khasra #108/3',
      village: 'Pimpalgaon',
      tehsil: 'Niphad',
      district: 'Nashik',
      state: 'Maharashtra',
      land_size_acres: 6.2,
      phone: '9823456789',
      kcc_number: 'KCC-BOB-441208',
      fpo_membership: 'Sahyadri Agri Farmers Collective',
      bank_upi_id: 'sunita.deshmukh@sbi',
      certified_crops: 'Table Grapes, Pomegranate, Onion'
    },
    {
      farmer_id: 'PB-LDH-2024-3992',
      full_name: 'Harpreet Singh',
      aadhaar_number: '7612-9844-5510',
      khasra_number: 'Khasra #512/4',
      village: 'Sahnewal',
      tehsil: 'Ludhiana East',
      district: 'Ludhiana',
      state: 'Punjab',
      land_size_acres: 8.0,
      phone: '9811233445',
      kcc_number: 'KCC-PNB-883190',
      fpo_membership: 'Malwa Grain & Organic Federation',
      bank_upi_id: 'harpreet.kisan@icici',
      certified_crops: 'Basmati Rice, Wheat, Mustard'
    },
    {
      farmer_id: 'AP-GNT-2024-1184',
      full_name: 'Naveen Reddy',
      aadhaar_number: '6521-8890-4412',
      khasra_number: 'Khasra #331/2',
      village: 'Mangalagiri',
      tehsil: 'Guntur Rural',
      district: 'Guntur',
      state: 'Andhra Pradesh',
      land_size_acres: 3.8,
      phone: '9100977665',
      kcc_number: 'KCC-AND-110294',
      fpo_membership: 'Krishna Delta Spice FPO',
      bank_upi_id: 'naveen.reddy@upi',
      certified_crops: 'Guntur Red Chilli, Turmeric, Cotton'
    },
    {
      farmer_id: 'TN-ERD-2024-7731',
      full_name: 'Kavitha Murugan',
      aadhaar_number: '5412-3344-9981',
      khasra_number: 'Khasra #89/1',
      village: 'Perundurai',
      tehsil: 'Erode',
      district: 'Erode',
      state: 'Tamil Nadu',
      land_size_acres: 5.0,
      phone: '9443011223',
      kcc_number: 'KCC-IOB-772190',
      fpo_membership: 'Kongu Mandalam Natural Farmers',
      bank_upi_id: 'kavitha.farm@okaxis',
      certified_crops: 'Salem Turmeric, Tender Coconut, Banana'
    }
  ];

  for (const f of farmers) {
    await pool.query(`
      INSERT INTO govt_verified_farmers (
        farmer_id, full_name, aadhaar_number, khasra_number, village,
        tehsil, district, state, land_size_acres, phone, kcc_number,
        fpo_membership, bank_upi_id, certified_crops
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (farmer_id) DO UPDATE SET
        phone = EXCLUDED.phone,
        bank_upi_id = EXCLUDED.bank_upi_id,
        kcc_number = EXCLUDED.kcc_number;
    `, [
      f.farmer_id, f.full_name, f.aadhaar_number, f.khasra_number, f.village,
      f.tehsil, f.district, f.state, f.land_size_acres, f.phone, f.kcc_number,
      f.fpo_membership, f.bank_upi_id, f.certified_crops
    ]);
  }
  console.log(`✅ Seeded ${farmers.length} government verified farmers in Neon.`);

  // 3. Seed Admins
  const admins = [
    {
      admin_id: 'ADM-8821',
      full_name: 'Gurpreet Singh',
      phone: '9811233445',
      email: 'gurpreet.ops@farmdirect.in',
      designation: 'Chief Fleet Operations Controller',
      department: 'Logistics & Real-time Route Operations',
      zone: 'Central & North India Hubs',
      access_level: 'SUPER_ADMIN'
    },
    {
      admin_id: 'LOG-OPS-101',
      full_name: 'Rajesh Sharma',
      phone: '9823045678',
      email: 'rajesh.logistics@farmdirect.in',
      designation: 'Regional Cold-Chain Dispatch Director',
      department: 'Perishables & Reefer Fleet Dispatch',
      zone: 'West Zone (Nashik & Nagpur Agro-Corridor)',
      access_level: 'FLEET_CONTROLLER'
    },
    {
      admin_id: 'ADM-4019',
      full_name: 'Ananya Sen',
      phone: '9443198765',
      email: 'ananya.audit@farmdirect.in',
      designation: 'Escrow Settlement & Audit Controller',
      department: 'Financial Settlement & Payout Approvals',
      zone: 'National Escrow Clearing Unit',
      access_level: 'FINANCE_AUDIT'
    },
    {
      admin_id: 'ADM-5502',
      full_name: 'Vikramaditya Roy',
      phone: '9100912345',
      email: 'vikram.compliance@farmdirect.in',
      designation: 'Surveillance & Anti-Middleman Enforcement Lead',
      department: 'Registry Compliance & Fraud Prevention',
      zone: 'National Agricultural Gatekeeping',
      access_level: 'SECURITY_ENFORCER'
    }
  ];

  for (const a of admins) {
    await pool.query(`
      INSERT INTO admins (
        admin_id, full_name, phone, email, designation, department, zone, access_level, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'ACTIVE')
      ON CONFLICT (admin_id) DO UPDATE SET
        phone = EXCLUDED.phone,
        full_name = EXCLUDED.full_name,
        designation = EXCLUDED.designation;
    `, [
      a.admin_id, a.full_name, a.phone, a.email, a.designation,
      a.department, a.zone, a.access_level
    ]);
  }
  console.log(`✅ Seeded ${admins.length} verified admins in Neon.`);

  const tablesRes = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;");
  console.log('📊 Active Tables in Neon Cloud PostgreSQL:', tablesRes.rows.map(r => r.table_name));

  await pool.end();
}

syncNeon().catch(err => {
  console.error('❌ Error syncing Neon DB:', err);
  process.exit(1);
});
