const router = require("express").Router();
const {
  getUserController,
  updateUserController,
  deleteUserController,
} = require("../controllers/user.controller");

router.get("/", getUserController);

router.put("/", updateUserController);

router.delete("/", deleteUserController);

module.exports = router;
