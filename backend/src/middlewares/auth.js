// src/middlewares/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * authMiddleware
 * - Verifies the Authorization header and the JWT.
 * - Attaches `req.user = { id, email }` when the token is valid.
 * - Responds 401 for missing, invalid or expired tokens.
 *
 * Important: this middleware does not check token revocation/blacklist.
 */
async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // Attach minimal user info for downstream handlers (no DB hit needed here)
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    // token invalid or expired
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
