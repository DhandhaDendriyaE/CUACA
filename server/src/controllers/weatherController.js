const { getWeather3Days } = require('../services/weatherService');

exports.getWeatherByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    if (!location) {
      return res.status(400).json({ error: 'Location required' });
    }

    const data = await getWeather3Days(decodeURIComponent(location));
    res.json(data);
  } catch (err) {
    console.error('Controller error:', err.message);
    res.status(500).json({ error: err.message });
  }
};