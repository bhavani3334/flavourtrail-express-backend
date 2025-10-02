const mongoose = require('mongoose');


const restaurantSchema = new mongoose.Schema({
name: { type: String, required: true },
description: String,
address: String,
location: {
type: { type: String, enum: ['Point'], default: 'Point' },
coordinates: { type: [Number], index: '2dsphere' } // [lng, lat]
},
tags: [String],
priceTier: { type: Number, min: 1, max: 5 },
owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
externalIds: { googlePlaceId: String, foursquareId: String },
meta: mongoose.Schema.Types.Mixed
}, { timestamps: true });


module.exports = mongoose.model('Restaurant', restaurantSchema);