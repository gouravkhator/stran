const router = require("express").Router();
const {
  getAvailableRandomUserController,
  getFriendDataController,
} = require("../controllers/other-users.controller");

/**
 * We don't require any one to send GET request to /users/random/dnd or /users/random/brb,
 * that is why we just keep a static route..
 */
router.get("/random/available", getAvailableRandomUserController);

router.get("/:friendUserId", getFriendDataController);

module.exports = router;
