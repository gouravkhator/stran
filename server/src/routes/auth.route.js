const router = require('express').Router();
const {
    getNonceController,
    signupController,
    verifySignatureController,
    logoutController,
} = require('../controllers/auth.controller');

const { returnUserIfUserExists } = require('../middlewares/auth.middleware');

router.get('/nonce/:publicAddress', returnUserIfUserExists, getNonceController);

router.post('/signup', returnUserIfUserExists, signupController);

router.post('/verify', returnUserIfUserExists, verifySignatureController);

router.post('/logout', logoutController);

module.exports = router;
