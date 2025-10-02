const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();


// Register
router.post('/register', async (req, res) => {
const { name, email, password, role } = req.body;
const existing = await User.findOne({ email });
if (existing) return res.status(400).json({ error: 'Email already used' });
const user = await User.create({ name, email, password, role });
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});
// Login
router.post('/login', async (req, res) => {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ error: 'Invalid credentials' });
const match = await user.comparePassword(password);
if (!match) return res.status(400).json({ error: 'Invalid credentials' });
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});


module.exports = router;


// FILE: src/routes/restaurants.js
const express = require('express');
const Restaurant = require('../models/Restaurant');
const { authenticate, authorizeRole } = require('../middleware/auth');
const router = express.Router();


// Create restaurant (owner/admin)
router.post('/', authenticate, authorizeRole(['owner','admin']), async (req, res) => {
const payload = req.body;
payload.owner = req.user._id;
const r = await Restaurant.create(payload);
res.status(201).json(r);
});
// Update restaurant (owner/admin)
router.put('/:id', authenticate, async (req, res) => {
const r = await Restaurant.findById(req.params.id);
if (!r) return res.status(404).json({ error: 'Not found' });
if (r.owner && r.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
return res.status(403).json({ error: 'Forbidden' });
}
Object.assign(r, req.body);
await r.save();
res.json(r);
});


// Delete
router.delete('/:id', authenticate, async (req, res) => {
const r = await Restaurant.findById(req.params.id);
if (!r) return res.status(404).json({ error: 'Not found' });
if (r.owner && r.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
return res.status(403).json({ error: 'Forbidden' });
}
await r.remove();
res.json({ success: true });
});
// Get by id


let query = Restaurant.find(filter);
if (lat && lng) {
const point = { type: 'Point', coordinates: [Number(lng), Number(lat)] };
query = query.where('location').near({ center: point.coordinates, maxDistance: Number(radius) });
}
const results = await query.skip((page-1)*limit).limit(Number(limit)).exec();
res.json(results);
});


module.exports = router;


// FILE: src/routes/menus.js
const express = require('express');
const Menu = require('../models/Menu');
const Restaurant = require('../models/Restaurant');
const { authenticate } = require('../middleware/auth');
const router = express.Router();


// Create/Replace menu for a restaurant - owner/admin only
router.post('/:restaurantId', authenticate, async (req, res) => {
const rest = await Restaurant.findById(req.params.restaurantId);
if (!rest) return res.status(404).json({ error: 'Restaurant not found' });
if (rest.owner && rest.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
return res.status(403).json({ error: 'Forbidden' });
}
const existing = await Menu.findOne({ restaurant: rest._id });
if (existing) {
existing.items = req.body.items || [];
await existing.save();
return res.json(existing);
}
const menu = await Menu.create({ restaurant: rest._id, items: req.body.items || [] });
res.status(201).json(menu);
});


// Get menu
router.get('/:restaurantId', async (req, res) => {
const menu = await Menu.findOne({ restaurant: req.params.restaurantId });
if (!menu) return res.status(404).json({ error: 'Not found' });
res.json(menu);
});


// Delete menu item (owner/admin)
router.delete('/:restaurantId/item', authenticate, async (req, res) => {
const { itemName } = req.body;
const rest = await Restaurant.findById(req.params.restaurantId);
if (!rest) return res.status(404).json({ error: 'Restaurant not found' });
if (rest.owner && rest.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
const menu = await Menu.findOne({ restaurant: rest._id });
if (!menu) return res.status(404).json({ error: 'Menu not found' });
menu.items = menu.items.filter(it => it.name !== itemName);
await menu.save();
res.json(menu);
});


module.exports = router;