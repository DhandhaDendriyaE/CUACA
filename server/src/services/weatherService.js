const { fetch } = require('undici'); // Pastikan sudah `npm install undici`

const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const parseLocation = (input) => {
  if (/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(input)) {
    const [lat, lon] = input.split(',').map(x => x.trim());
    return `q=${lat},${lon}`;
  }
  return `q=${encodeURIComponent(input)}`;
};

async function getWeather3Days(location) {
  const API_KEY = process.env.WEATHER_API_KEY;
  if (!API_KEY) throw new Error('WEATHER_API_KEY not set in .env');

  const queryParam = parseLocation(location);
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&${queryParam}&days=3&aqi=no`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`WeatherAPI ${res.status}: ${text}`);
    }

    const data = await res.json();
    const { location: loc } = data;
    const forecastDays = data.forecast.forecastday;

    // Tentukan tanggal: kemarin, hari ini, besok (tanpa mutasi Date)
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    const dates = [
      { label: 'yesterday', date: new Date(year, month, day - 1) },
      { label: 'today',     date: new Date(year, month, day) },
      { label: 'tomorrow',  date: new Date(year, month, day + 1) }
    ];

    const days = [];
    for (const d of dates) {
      const targetDateStr = formatDate(d.date);
      const fd = forecastDays.find(fd => fd.date === targetDateStr);
      
      if (!fd) {
        // Jika tidak ada data (misal: historis tidak tersedia), buat dummy
        days.push({
          period: d.label,
          date: targetDateStr,
          temperature: 28,
          high: 32,
          low: 25,
          humidity: 75,
          precipitation: 0,
          wind: 8,
          pressure: 1010,
          condition: 'Data tidak tersedia',
          icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
          time: null
        });
        continue;
      }

      const dayData = fd.day;
      // Cari data jam 12 siang untuk tekanan & waktu
      const noonHour = fd.hour.find(h => {
        const hourTime = new Date(h.time).getUTCHours();
        return hourTime === 12;
      }) || fd.hour[Math.min(12, fd.hour.length - 1)] || {};

      days.push({
        period: d.label,
        date: targetDateStr,
        temperature: dayData.avgtemp_c,    // ✅ rata-rata
        high: dayData.maxtemp_c,           // ✅ maksimum
        low: dayData.mintemp_c,            // ✅ minimum
        humidity: dayData.avghumidity,
        precipitation: dayData.totalprecip_mm,
        wind: dayData.maxwind_kph,
        pressure: noonHour.pressure_mb,
        condition: dayData.condition?.text || 'Cerah',
        icon: dayData.condition?.icon || '//cdn.weatherapi.com/weather/64x64/day/113.png',
        time: noonHour.time 
          ? new Date(noonHour.time).toLocaleTimeString('id-ID', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })
          : null
      });
    }

    return {
      city: loc.name,
      country: loc.country,
      lat: loc.lat,
      lon: loc.lon,
      localtime: loc.localtime,
      days // ✅ array 3 hari: [kemarin, hari ini, besok]
    };
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      throw new Error('WeatherAPI timeout (5s)');
    }
    throw err;
  }
}

module.exports = { getWeather3Days };