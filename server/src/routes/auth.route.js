const router = require("express").Router();
const {
  getNonceController,
  signupController,
  verifySignatureController,
  logoutController,
} = require("../controllers/auth.controller");

const {
  returnUserIfUserExists,
  throwErrIfUserNotExist,
} = require("../middlewares/user.middleware");

router.get("/nonce/:publicAddress", returnUserIfUserExists, getNonceController);

router.post("/signup", returnUserIfUserExists, signupController);

router.post("/verify", returnUserIfUserExists, verifySignatureController);

router.post("/logout", throwErrIfUserNotExist, logoutController);

module.exports = router;
