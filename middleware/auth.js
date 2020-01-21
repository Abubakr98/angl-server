const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/app').jwt;

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    res.status(401).json({ message: 'Token not provided!' });
    return;
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, jwtSecret);
    if (payload.type !== 'access') {
      res.status(401).json({ message: 'Invalid token!' });
      return;
    }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired!' });
    }
    if (e instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token!' });
      return;
    }
  }
  next();
};
