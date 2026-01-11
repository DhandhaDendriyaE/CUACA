
// src/routes/authRoutes.js
const express = require('express');
const { 
  registerPengunjung, 
  loginPengunjung,
  loginAdmin              // ← tambahkan ini
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerPengunjung);
router.post('/login', loginPengunjung);
router.post('/login-admin', loginAdmin); // ← endpoint baru

module.exports = router;