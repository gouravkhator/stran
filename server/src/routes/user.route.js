const router = require("express").Router();
const {
  getUserController,
  editUserController,
  deleteUserController,
} = require("../controllers/user.controller");

router.get("/", getUserController);

router.put("/", editUserController);

router.delete("/", deleteUserController);

module.exports = router;
