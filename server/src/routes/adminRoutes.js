
// src/routes/adminRoutes.js
const express = require('express');
const { 
  getAllPengunjung, 
  updatePengunjung, 
  deletePengunjung 
} = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Semua route dilindungi
router.use(verifyAdmin);

// ✅ Endpoint untuk daftar pengunjung
router.get('/pengunjung', getAllPengunjung); // ← INI HARUS ADA!

router.put('/pengunjung/:id', updatePengunjung);
router.delete('/pengunjung/:id', deletePengunjung);

module.exports = router;