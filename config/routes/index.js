const express = require('express');
const auth = require('./auth');
const user = require('./user');
const words = require('./words');
const groups = require('./groups');
const { pageNotFound } = require('../../app/controllers/auth');

const router = express.Router();
// const authMiddleWare = require('../../middleware/auth');


router.use('/auth', auth);
router.use('/users', user);
router.use('/groups', groups);
router.use('/words', words);
router.all('*', pageNotFound);

module.exports = router;
