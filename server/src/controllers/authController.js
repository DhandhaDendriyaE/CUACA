
const { Pool } = require('pg');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../services/passwordService');

// Konfigurasi database
const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD || undefined,
  database: process.env.PGDATABASE
});

// Secret JWT
const JWT_SECRET = process.env.JWT_SECRET || 'weather_app_secret_2026';

// ─── REGISTER PENGGUNJUNG ───────────────────────────────
exports.registerPengunjung = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nama, email, dan password wajib diisi' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password minimal 6 karakter' });
  }

  try {
    // Cek duplikat email
    const emailCheck = await pool.query(
      'SELECT id FROM pengunjung WHERE email = $1',
      [email]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Email sudah terdaftar' });
    }

    // Hash password & simpan
    const hashedPassword = await hashPassword(password);
    const result = await pool.query(
      `INSERT INTO pengunjung (name, email, password_hash)
       VALUES ($1, $2, $3) RETURNING id, name, email`,
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: 'Pendaftaran berhasil',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Gagal mendaftar' });
  }
};

// ─── LOGIN PENGGUNJUNG ──────────────────────────────────
exports.loginPengunjung = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi' });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, email, password_hash FROM pengunjung WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const user = result.rows[0];
    const isMatch = await comparePassword(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'pengunjung' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'pengunjung'
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Gagal login' });
  }
};

// ─── LOGIN ADMIN ────────────────────────────────────────
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi' });
  }

  try {
    const result = await pool.query(
      'SELECT id, email, password_hash FROM admins WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const admin = result.rows[0];
    const isMatch = await comparePassword(password, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login admin berhasil',
      token,
      user: {
        id: admin.id,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Gagal login sebagai admin' });
  }
};