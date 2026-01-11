
const { Pool } = require('pg');
require('dotenv').config();
const { hashPassword } = require('./../services/passwordService');

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD || undefined,
  database: process.env.PGDATABASE
});

// ✅ GET /api/admin/pengunjung → lihat semua pengunjung
exports.getAllPengunjung = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM pengunjung ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get pengunjung error:', err);
    res.status(500).json({ error: 'Gagal mengambil data pengunjung' });
  }
};

// ✅ PUT /api/admin/pengunjung/:id → edit pengunjung
exports.updatePengunjung = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Nama dan email wajib diisi' });
  }

  try {
    // Cek apakah email sudah dipakai oleh pengunjung lain
    const emailCheck = await pool.query(
      'SELECT id FROM pengunjung WHERE email = $1 AND id != $2',
      [email, id]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Email sudah digunakan' });
    }

    const result = await pool.query(
      'UPDATE pengunjung SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email',
      [name, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pengunjung tidak ditemukan' });
    }

    res.json({ message: 'Data pengunjung berhasil diperbarui', user: result.rows[0] });
  } catch (err) {
    console.error('Update pengunjung error:', err);
    res.status(500).json({ error: 'Gagal memperbarui data' });
  }
};

// ✅ DELETE /api/admin/pengunjung/:id → hapus pengunjung
exports.deletePengunjung = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM pengunjung WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pengunjung tidak ditemukan' });
    }

    res.json({ message: 'Pengunjung berhasil dihapus' });
  } catch (err) {
    console.error('Delete pengunjung error:', err);
    res.status(500).json({ error: 'Gagal menghapus pengunjung' });
  }
};