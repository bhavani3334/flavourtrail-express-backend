const mongoose = require('mongoose');


const menuItemSchema = new mongoose.Schema({
name: String,
description: String,
price: Number,
category: String
}, { _id: false });


const menuSchema = new mongoose.Schema({
restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
items: [menuItemSchema]
}, { timestamps: true });


module.exports = mongoose.model('Menu', menuSchema);