const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');


async function ensureIndex() {
await Restaurant.collection.createIndex({ name: 'text', description: 'text', tags: 'text' });
}


module.exports = ensureIndex;