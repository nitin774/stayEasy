const axios = require('axios');

async function geocode(location) {
  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: location,
        format: 'json',
        limit: 1
      },
      headers: { 'User-Agent': 'mern-app' }
    });

    if (res.data.length === 0) return null;

    const place = res.data[0]; // take first result
    return {
      displayName: place.display_name,
      coordinates: [parseFloat(place.lon), parseFloat(place.lat)] // [lon, lat]
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = geocode;
