// middleware/auth.js
// Middleware that validates Bearer <token> and attaches req.userId

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ msg: 'Missing Authorization header' });

  // Expected format: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ msg: 'Invalid Authorization format' });
  }

  const token = parts[1];
  try {
    // Verify token with JWT_SECRET
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach user id for later handlers
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
