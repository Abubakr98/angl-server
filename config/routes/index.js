const express = require('express');
const auth = require('./auth');
const user = require('./user');
const products = require('./products');
const { pageNotFound } = require('../../app/controllers/products');

const router = express.Router();
// const authMiddleWare = require('../middleware/auth');
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  console.log(req.hostname);


  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
router.use('/auth', auth);
router.use('/users', user);
router.use('/products', products);
router.all('*', pageNotFound);

module.exports = router;
