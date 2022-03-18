const { AppError } = require("../utils/errors.util");

async function getUserController(req, res, next) {
  try {
    if (req.user && req.user.username) {
      return res.json({
        user: req.user,
      });
    }

    throw new AppError({
      statusCode: 401, // unauthorized, as the login should happen, and without that we should not get user data..
      shortMsg: "login-required",
      message:
        "You are unauthorized to make this request. Please login with MetaMask to fetch the details!",
    });
  } catch (err) {
    return next(err);
  }
}

async function editUserController(req, res, next) {}

async function deleteUserController(req, res, next) {}

module.exports = {
  getUserController,
  editUserController,
  deleteUserController,
};
