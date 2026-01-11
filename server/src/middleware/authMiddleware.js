
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD || undefined,
  database: process.env.PGDATABASE
});

const JWT_SECRET = process.env.JWT_SECRET || 'weather_app_secret_2026';

// Verifikasi token & pastikan role = admin
exports.verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Akses ditolak: token tidak ditemukan' });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    // Pastikan role admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Akses khusus admin' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token tidak valid' });
  }
};