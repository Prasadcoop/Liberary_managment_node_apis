const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; // Extract token from Bearer token
  
  if (!token) {
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, "xxxxxxxxx", (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token.' });
    }
    req.user = user; // Attach user info to the request object
    next();
  });
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };
