const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD || undefined,
  database: process.env.PGDATABASE,
  max: 10,
  idleTimeoutMillis: 30000
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('🔥 PostgreSQL error:', err);
});

module.exports = pool;