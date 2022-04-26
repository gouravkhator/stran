const { authenticateToken } = require("../services/auth.service");
const { getUserData } = require("../services/smart-contract.service");

async function authenticateTokenMiddleware(req, res, next) {
  let authenticated = false,
    userid = null;

  try {
    /**
     * As we save the token in the signed cookies in the client end from this server..
     * So, we read from the signed cookies itself..
     */
    const token = req.signedCookies["jwtToken"] ?? null;

    const result = await authenticateToken(token);

    authenticated = result.authenticated;
    userid = result.userid;

    // if authenticated is false, authenticateToken should have already thrown the error
    if (authenticated === true) {
      req.user = await getUserData({
        userid: userid,
        senderAccAddr: userid,
      });

      return next();
    }
  } catch (err) {
    if (authenticated === true) {
      // then we got error in fetching user data
      return next(err);
    } else {
      // else we got error in the verification of token
      req.user = null;
      req.userid = null;
      return next();
    }
  }
}

module.exports = {
  authenticateTokenMiddleware,
};
