const { AppError } = require("../utils/errors.util");

function throwErrIfUserNotExist(req, res, next) {
  try {
    if (!req.user || !req.user.username) {
      throw new AppError({
        statusCode: 401, // unauthorized, as the login is a mandate..
        shortMsg: "login-required",
        message:
          "You are unauthorized!! Please login first to make this request.",
      });
    } else {
      return next(); // else, go to the next route
    }
  } catch (err) {
    return next(err);
  }
}

async function returnUserIfUserExists(req, res, next) {
  try {
    /**
     * If req.user is set already by the authenticateTokenMiddleware, that means the token is valid.
     * If req.user is not set, then token was invalid.
     *
     * If user exists and username is also valid, then return the user, else process the original route..
     * If some error occurs, then go to the error handling route..
     */
    if (req.user && req.user.username) {
      return res.json({
        status: "success",
        user: req.user,
      });
    } else {
      return next();
    }
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  throwErrIfUserNotExist,
  returnUserIfUserExists,
};
