const express = require('express');
const { getWeatherByLocation } = require('../controllers/weatherController');

const router = express.Router();

router.get('/:location', getWeatherByLocation);

module.exports = router;