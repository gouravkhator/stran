const router = require("express").Router();
const {
  getDataFromIpfsController,
  addDataToIpfsController,
} = require("../controllers/ipfs.controller");

router.post("/", addDataToIpfsController);

router.get("/:cid", getDataFromIpfsController);

module.exports = router;
