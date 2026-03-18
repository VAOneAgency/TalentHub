require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const projectRoutes = require('./routes/projects');
const applicationRoutes = require('./routes/applications');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const uploadRoutes = require('./routes/upload');

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://relaxed-chebakia-ed8756.netlify.app',
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// ─── Routes owned by this feature ────────────────────────────────────────────
app.use('/api/projects', projectRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/upload', uploadRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', feature: 'projects-applications' }));

// ─── DB + Start ───────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/talenthub';

console.log('Connecting to MongoDB with URI:', MONGO_URI);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;