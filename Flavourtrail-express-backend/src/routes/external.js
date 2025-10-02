const express = require('express');
const axios = require('axios');
const Restaurant = require('../models/Restaurant');
const router = express.Router();


// GET /api/external/google?lat=..&lng=..&radius=..
router.get('/google', async (req, res) => {
const { lat, lng, radius=1500, keyword } = req.query;
if (!process.env.GOOGLE_PLACES_API_KEY) return res.status(500).json({ error: 'GOOGLE_PLACES_API_KEY not configured' });
const params = {
key: process.env.GOOGLE_PLACES_API_KEY,
location: `${lat},${lng}`,
radius,
keyword
};
const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const resp = await axios.get(url, { params });
const places = resp.data.results || [];
// Map to a lighter shape and attempt to merge with DB using place_id
const enriched = await Promise.all(places.map(async p => {
const existing = await Restaurant.findOne({ 'externalIds.googlePlaceId': p.place_id });
return existing ? { source: 'db', doc: existing } : {
source: 'google',
doc: {
name: p.name,
address: p.vicinity,
externalIds: { googlePlaceId: p.place_id },
location: { type: 'Point', coordinates: [p.geometry.location.lng, p.geometry.location.lat] },
meta: p
}
};
}));
res.json(enriched);
});


// Example Foursquare endpoint (developer should adjust to Foursquare API v3)
router.get('/foursquare', async (req, res) => {
const { lat, lng, radius=1000, query } = req.query;
if (!process.env.FOURSQUARE_API_KEY) return res.status(500).json({ error: 'FOURSQUARE_API_KEY not configured' });
const url = 'https://api.foursquare.com/v3/places/search';
const params = { ll: `${lat},${lng}`, radius, query };
const resp = await axios.get(url, { params, headers: { Authorization: process.env.FOURSQUARE_API_KEY } });
const items = resp.data.results || [];
const enriched = await Promise.all(items.map(async p => {
const existing = await Restaurant.findOne({ 'externalIds.foursquareId': p.fsq_id });
return existing ? { source: 'db', doc: existing } : { source: 'foursquare', doc: { name: p.name, location: { type: 'Point', coordinates: [p.geocodes.main.longitude, p.geocodes.main.latitude] }, externalIds: { foursquareId: p.fsq_id }, meta: p } };
}));
res.json(enriched);
});


module.exports = router;