const {
  getUserData,
  createUser,
  verifySignature,
} = require("../services/smart-contract.service");
const {
  generateAccessToken,
  destroyAccessToken,
} = require("../services/auth.service");

const { AppError } = require("../utils/errors.util");
const { secureCookieOptions } = require("../utils/global.util");

async function getNonceController(req, res, next) {
  try {
    /**
     * this will get validated in the validateParams method in smart contract service.
     * so we don't need to worry on that, as the validation gets run for every method of smart contract service.
     */
    const publicAddress = req.params.publicAddress;

    const userdata = await getUserData(publicAddress, publicAddress);

    if (userdata.username === "") {
      throw new AppError({
        statusCode: 404,
        shortMsg: "user-not-found",
        message: "User not found. Please create account firstly..",
      });
    }

    return res.json({
      status: "success",
      nonce: userdata.nonce,
      user: userdata,
    });
  } catch (err) {
    return next(err);
  }
}

async function signupController(req, res, next) {
  try {
    const publicAddress = req.body.publicAddress;

    let userdata = await getUserData(publicAddress, publicAddress);

    if (userdata.username !== "") {
      throw new AppError({
        statusCode: 400,
        message: "User already exists. Please login to continue..",
        shortMsg: "user-already-exists",
      });
    }

    userdata = await createUser({
      username: req.body.name ?? null,
      senderAccAddr: publicAddress,
    });

    return res.status(201).json({
      status: "success",
      user: userdata,
    });
  } catch (err) {
    next(err);
  }
}

async function verifySignatureController(req, res, next) {
  try {
    const { publicAddress, signature } = req.body;

    const { user, verified } = await verifySignature({
      senderAccAddr: publicAddress,
      signature,
    });

    // if the verification would have failed, it would already throw error in the verifySignature method..
    // but just for confirmation, we do this below checks.
    if (verified === true && user.username !== "") {
      const token = generateAccessToken(user.userid);
      res.cookie("jwtToken", token, secureCookieOptions);

      return res.json({
        status: "success",
        verified: true,
        user,
      });
    }
  } catch (err) {
    next(err);
  }
}

async function logoutController(req, res, next) {
  try {
    const token = req.signedCookies["jwtToken"] ?? null;

    /**
     * We have to invalidate the JWT token in the server end and then also set the cookie in the client end to remove that token..
     *
     * What if we only remove cookie from client end, by sending a Set-Cookie header in response..?
     *
     * > This will let the client login again,
     * but what if a hacker gets hold of the token, which is already valid in the server end, and has not expired yet..
     * This can lead to account hacks, in the timespan when the token is valid till its expiry..
     *
     * So, we have to invalidate that token first in the server end..
     */

    await destroyAccessToken(token);

    // delete the cookie by setting the token to a value "deleted", and setting max-age to 0 ms
    // this way the token gets deleted from the user machine
    res.cookie("jwtToken", "deleted", { ...secureCookieOptions, maxAge: 0 });

    return res.json({
      status: "success",
      loggedOut: true,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getNonceController,
  logoutController,
  signupController,
  verifySignatureController,
};
