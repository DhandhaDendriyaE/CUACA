const express = require('express');
const { 
  getAllPengunjung, 
  updatePengunjung, 
  deletePengunjung 
} = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Semua route di bawah ini dilindungi
router.use(verifyAdmin);

router.get('/pengunjung', getAllPengunjung);
router.put('/pengunjung/:id', updatePengunjung);
router.delete('/pengunjung/:id', deletePengunjung);

module.exports = router;