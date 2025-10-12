const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const SECRET = process.env.JWT_SECRET || "default_secret";

// Authenticate token middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  console.log('🔐 Checking token for:', req.method, req.path);
  console.log('🔑 Token present:', !!token);

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  jwt.verify(token, SECRET, async (err, decoded) => {
    if (err) {
      console.log('❌ Invalid token:', err.message);
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    try {
      // Verify user still exists
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        console.log('❌ User not found for token');
        return res.status(404).json({ message: "User not found" });
      }

      console.log('✅ Token valid for user:', user.username);
      req.user = user; // Add user info to request
      next();
    } catch (error) {
      console.log('❌ Token verification error:', error);
      return res.status(500).json({ message: "Token verification failed" });
    }
  });
}

module.exports = { authenticateToken };