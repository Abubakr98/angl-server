const express = require('express');
const auth = require('../../app/controllers/auth');
const authMiddleWare = require('../../middleware/auth');

const router = express.Router();

// auth
router.post('/signin', auth.signIn);
router.post('/registration', auth.registration);
router.post('/email-verify/:tokenEmailVerify', authMiddleWare, auth.emailVerify);
router.post('/refresh-password/:tokenPasswordReset', authMiddleWare, auth.refreshPass);
router.post('/token-refresh-password', auth.tokenForRefreshPass);
router.post('/refresh-tokens', auth.refreshTokens);

module.exports = router;
