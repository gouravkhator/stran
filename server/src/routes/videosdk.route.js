const router = require("express").Router();
const {
  getVideoSDKTokenController,
  createMeetingController,
  validateMeetingController,
} = require("../controllers/videosdk.controller");

router.get("/get-videosdk-token", getVideoSDKTokenController);

router.post("/create-meeting", createMeetingController);

router.post("/validate-meeting/:meetingId", validateMeetingController);

module.exports = router;
