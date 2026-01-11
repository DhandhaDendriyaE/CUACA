require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherRoutes = require('./src/routes/weatherRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/weather', weatherRoutes);

const { createAdminIfNotExists } = require('./src/utils/seedAdmin');

  createAdminIfNotExists();;
// Tambahkan setelah route lain
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({
    message: '✅ Weather API ready',
    endpoints: {
      weather: 'GET /api/weather/:location'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});