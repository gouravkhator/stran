const jwt = require("jsonwebtoken");

const { insertValueRedis, existsInListRedis } = require("./redis.service");
const { AppError } = require("../utils/errors.util");

function generateAccessToken(userid) {
  return jwt.sign({ userid }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
}

async function authenticateToken(token) {
  try {
    token = token ?? null;

    if (token === null) {
      throw new AppError({
        statusCode: 401, // unauthorized request
        shortMsg: "token-not-provided",
        message:
          "Please provide valid authorization token to make this request..",
      });
    }

    if ((await existsInListRedis({ value: token })) === true) {
      // the token exists in the blacklistedTokens list, so it is invalid now..
      throw new AppError({
        message: "JWT token passed is invalid now. Please login again..",
        shortMsg: "provided-token-expired",
        statusCode: 403, // forbidden, as the token was invalid
      });
    }

    let tempUserId = null,
      authenticated = false;

    jwt.verify(token, process.env.TOKEN_SECRET, (err, result) => {
      if (err) {
        throw new AppError({
          statusCode: 403, // forbidden, as the token was invalid
          shortMsg: "invalid-token-provided",
          message:
            "Please provide valid token. This token is either invalid or has expired..",
        });
      }

      tempUserId = result.userid;
      authenticated = true;
    });

    return {
      authenticated,
      userid: tempUserId,
    };
  } catch (err) {
    throw err;
  }
}

/**
 * Invalidate the JWT access token passed
 * @param {*} token A JWT token in the string format
 */
async function destroyAccessToken(token) {
  try {
    token = token ?? null;

    if (token === null) {
      throw new AppError({
        statusCode: 401, // unauthorized request
        shortMsg: "token-not-provided",
        message:
          "Please provide valid authorization token to make this request..",
      });
    }

    // blacklist the token by inserting it to Redis blacklistedTokens list..
    await insertValueRedis({ value: token });
  } catch (err) {
    throw err;
  }
}

module.exports = {
  generateAccessToken,
  authenticateToken,
  destroyAccessToken,
};
