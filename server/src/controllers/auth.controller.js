const {
  getUserData,
  createUser,
  verifySignature,
} = require("../services/smart-contract.service");
const { generateAccessToken } = require("../services/auth.service");

const { parseEnumsInUser } = require("../utils/enums.util");
const { AppError } = require("../utils/errors.util");
const { secureCookieOptions } = require("../utils/global.util");

async function getNonceController(req, res, next) {
  try {
    const publicAddress = req.params.publicAddress;
    // this will get validated in the validateParams method in smart contract service.
    // so we don't need to worry on that, as the validation gets run for every method of smart contract service.

    const userdata = await getUserData(publicAddress, publicAddress);

    if (userdata.username === "") {
      throw new AppError({
        statusCode: 404,
        shortMsg: "user-not-found",
        message: "User not found. Please create account firstly..",
      });
    }

    return res.json({
      success: true,
      nonce: userdata.nonce,
      user: parseEnumsInUser({ ...userdata }),
    });
  } catch (err) {
    return next(err);
  }
}

async function signupController(req, res, next) {
  try {
    const publicAddress = req.body.publicAddress;
    // this will get validated in the validateParams method in smart contract service.
    // so we don't need to worry on that, as the validation gets run for every method of smart contract service.

    let userdata = await getUserData(publicAddress, publicAddress);

    if (userdata.username !== "") {
      throw new AppError({
        statusCode: 400,
        message:
          "User already exists. Please login with MetaMask to continue..",
        shortMsg: "user-already-exists",
      });
    }

    userdata = await createUser({
      username: req.body.name ?? null,
      senderAccAddr: publicAddress,
    });

    return res.status(201).json({
      success: true,
      user: parseEnumsInUser({ ...userdata }),
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
        verified: true,
        user: parseEnumsInUser({ ...user }),
      });
    }
  } catch (err) {
    next(err);
  }
}

async function logoutController(req, res, next) {}

module.exports = {
  getNonceController,
  logoutController,
  signupController,
  verifySignatureController,
};
