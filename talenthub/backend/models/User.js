const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['client', 'freelancer'], required: true },
  avatar:   { type: String, default: '' },
  bio:      { type: String, default: '' },
  portfolio: { type: String, default: '' },
  resume:   { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github:   { type: String, default: '' },
  memberSince: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);