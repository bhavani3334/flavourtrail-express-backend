const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.authenticate = async (req, res, next) => {
const header = req.header('Authorization');
if (!header) return res.status(401).json({ error: 'No token' });
const token = header.replace('Bearer ', '');
try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(payload.id).select('-password');
if (!user) return res.status(401).json({ error: 'Invalid token' });
req.user = user;
next();
} catch (err) {
return res.status(401).json({ error: 'Unauthorized' });
}
};


exports.authorizeRole = (roles = []) => (req, res, next) => {
if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
next();
};