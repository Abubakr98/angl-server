const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { ROLE } = require('../config/app');

const User = mongoose.model('User');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    res.status(401).json({ message: 'Token not provided!' });
    return;
  }

  const token = authHeader.replace('Bearer ', '');

  User.findOne({ _id: jwt.decode(token).userId }, (err, user) => {
    if (!user) {
      res.status(401).json({ message: 'User not exist!' });
      return;
    }
    if (user.role !== ROLE.ADMIN) {
      res.status(401).json({ message: 'Premission denied!' });
      return;
    }
    next();
  });
};
