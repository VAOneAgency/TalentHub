require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashed = await bcrypt.hash('password123', 10);
  const user = await User.create({
    username: 'testclient',
    email: 'testclient@test.com',
    password: hashed,
    role: 'client'
  });
  console.log('Seeded user:', user._id.toString());
  mongoose.disconnect();
});