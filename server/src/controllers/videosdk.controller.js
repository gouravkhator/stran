const { default: fetch } = require("node-fetch");
const jwt = require("jsonwebtoken");

const { AppError } = require("../utils/errors.util");

function getVideoSDKTokenController(req, res, next) {
  try {
    const API_KEY = process.env.VIDEOSDK_API_KEY;
    const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;

    const options = { expiresIn: "10m", algorithm: "HS256" };

    const payload = {
      apikey: API_KEY,
      permissions: ["allow_join"], // also accepts "ask_join", "allow_mod"
    };

    const token = jwt.sign(payload, SECRET_KEY, options);

    return res.json({
      status: "success",
      videoSDKToken: token,
    });
  } catch (err) {
    // error would mostly occur in jwt.sign method if any.
    return next(
      new AppError({
        message:
          "Unable to authorize you for the Video Calling. Please contact the admin of this project to know more.",
        shortMsg: "video-calling-sdk-access-unavailable",
        statusCode: 503, // service unavailable, as the access token cannot be created and fetched
      }),
    );
  }
}

async function createMeetingController(req, res, next) {
  try {
    const accessToken = req.body.videoSDKToken ?? null;
    const region = req.body.region ?? "sg001"; // region can be  sg001 | uk001 | us001 | eu001

    // we can take advantage of the region, to provide a more region-based better latency video calls
    
    if (accessToken === null) {
      throw new AppError({
        message:
          "Access token is not provided for video-calling. Please provide that to continue.",
        shortMsg: "videosdk-token-not-provided",
        statusCode: 400, // bad request
      });
    }

    const url = `${process.env.VIDEOSDK_API_ENDPOINT}/api/meetings`;

    const options = {
      method: "POST",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ region }),
    };

    const response = await fetch(url, options);
    const responseData = response.json();
    return res.json(responseData);
  } catch (err) {
    if (err instanceof AppError) {
      return next(err);
    }

    return next(
      new AppError({
        message:
          "Internal VideoCalling service might be down. Please wait for sometime..",
        shortMsg: "video-sdk-service-unavailable",
        /*
        fetch method might throw error if the VideoSDK api is not available,
        so it is "Service unavailable" issue
        */
        statusCode: 503,
      }),
    );
  }
}

async function validateMeetingController(req, res, next) {
  try {
    const accessToken = req.body.videoSDKToken ?? null;
    const meetingId = req.params.meetingId ?? null;

    if (accessToken === null || meetingId === null) {
      throw new AppError({
        message:
          "Video Calling access token and/or meetingId not provided. Please provide that to continue.",
        shortMsg: "token-and-meetingid-not-provided",
        statusCode: 400, // bad request
      });
    }

    const url = `${process.env.VIDEOSDK_API_ENDPOINT}/api/meetings/${meetingId}`;

    const options = {
      method: "POST",
      headers: { Authorization: accessToken },
    };

    const response = await fetch(url, options);
    const responseData = response.json();
    return res.json(responseData);
  } catch (err) {
    if (err instanceof AppError) {
      return next(err);
    }

    return next(
      new AppError({
        message:
          "Provided meeting id could not be validated. Please try again..",
        shortMsg: "meeting-id-validation-failed",
        statusCode: 500,
      }),
    );
  }
}

module.exports = {
  getVideoSDKTokenController,
  createMeetingController,
  validateMeetingController,
};
