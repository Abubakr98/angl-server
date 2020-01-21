const express = require('express');
const auth = require('../../app/controllers/auth');

const router = express.Router();

// auth
router.post('/signin', auth.signIn);
router.post('/registration', auth.registration);
router.post('/refresh-tokens', auth.refreshTokens);

module.exports = router;
