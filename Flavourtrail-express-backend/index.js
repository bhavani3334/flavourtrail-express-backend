require('dotenv').config();
connectDB().then(() => {
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
console.error('Failed to connect DB', err);
});


// FILE: src/utils/db.js
const mongoose = require('mongoose');


module.exports = async function connectDB() {
const uri = process.env.MONGO_URI;
if (!uri) throw new Error('MONGO_URI not set');
await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log('MongoDB connected');
};


// FILE: src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true, lowercase: true },
password: { type: String, required: true },
role: { type: String, enum: ['user','owner','admin'], default: 'user' }
}, { timestamps: true });


userSchema.pre('save', async function(next) {
if (!this.isModified('password')) return next();
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
next();
});


userSchema.methods.comparePassword = function(candidate) {
return bcrypt.compare(candidate, this.password);
};


module.exports = mongoose.model('User', userSchema);