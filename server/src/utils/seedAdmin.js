
// server/src/utils/seedAdmin.js
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD || undefined,
  database: process.env.PGDATABASE
});

const ADMIN_EMAIL = 'admin@cuaca.id';
const ADMIN_PASSWORD = 'rahasia_admin'; // ← Ganti password di sini!

async function createAdminIfNotExists() {
  try {
    // Cek apakah admin sudah ada
    const result = await pool.query(
      'SELECT id FROM admins WHERE email = $1',
      [ADMIN_EMAIL]
    );

    if (result.rows.length === 0) {
      // Hash password
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      
      // Simpan ke database
      await pool.query(
        'INSERT INTO admins (email, password_hash) VALUES ($1, $2)',
        [ADMIN_EMAIL, hashedPassword]
      );
      
      console.log('✅ Admin berhasil dibuat:');
      console.log('   Email:', ADMIN_EMAIL);
      console.log('   Password:', ADMIN_PASSWORD);
    } else {
      console.log('ℹ️ Admin sudah ada di database');
    }
  } catch (err) {
    console.error('❌ Gagal membuat admin:', err.message);
  } finally {
    await pool.end();
  }
}

module.exports = { createAdminIfNotExists };