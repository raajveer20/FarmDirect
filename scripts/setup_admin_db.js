import pg from 'pg';

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

async function setupAdminDb() {
  console.log('🚀 Connecting to PostgreSQL farmdirect database...');
  
  // 1. Create admins table
  const createTableQuery = `
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
    CREATE INDEX IF NOT EXISTS idx_admins_admin_id ON admins(admin_id);
    CREATE INDEX IF NOT EXISTS idx_admins_phone ON admins(phone);
  `;
  
  await pool.query(createTableQuery);
  console.log('✅ Created table `admins` with indexes.');

  // 2. Seed verified administrative fleet officers
  const seedOfficers = [
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

  for (const officer of seedOfficers) {
    const insertQuery = `
      INSERT INTO admins (admin_id, full_name, phone, email, designation, department, zone, access_level, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'ACTIVE')
      ON CONFLICT (admin_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        designation = EXCLUDED.designation,
        department = EXCLUDED.department,
        zone = EXCLUDED.zone,
        access_level = EXCLUDED.access_level;
    `;
    await pool.query(insertQuery, [
      officer.admin_id,
      officer.full_name,
      officer.phone,
      officer.email,
      officer.designation,
      officer.department,
      officer.zone,
      officer.access_level
    ]);
  }

  console.log(`✅ Seeded ${seedOfficers.length} verified administrative officers.`);

  // 3. Print verification table
  const { rows } = await pool.query('SELECT admin_id, full_name, phone, designation, department, zone FROM admins ORDER BY id ASC;');
  console.log('\n--- ACTIVE ADMIN DATABASE ENTITIES ---');
  console.table(rows);

  await pool.end();
}

setupAdminDb().catch(err => {
  console.error('❌ Error setting up admin db:', err);
  process.exit(1);
});
