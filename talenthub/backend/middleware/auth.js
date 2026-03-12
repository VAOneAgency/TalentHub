const jwt = require('jsonwebtoken');

/**
 * Auth middleware
 * Expects: Authorization: Bearer <token>
 * Token payload shape (set by partner's auth system):
 *   { id: String, role: 'client' | 'freelancer' }
 *
 * NOTE: Do NOT modify this file's JWT logic — it must stay compatible
 *       with the token issued by the auth partner's login route.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'talenthub_secret');
    req.user = decoded; // { id, role }
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ message: `Access restricted to: ${roles.join(', ')}` });
  }
  next();
};

module.exports = { protect, requireRole };