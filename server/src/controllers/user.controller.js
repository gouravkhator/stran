const { deleteUser } = require("../services/smart-contract.service");

async function getUserController(req, res, next) {
  try {
    return res.json({
      status: "success",
      user: req.user,
    });
  } catch (err) {
    return next(err);
  }
}

async function editUserController(req, res, next) {}

async function deleteUserController(req, res, next) {
  try {
    await deleteUser(req.user.userid);

    return res.json({
      status: "success",
      deletedUser: true,
      userid: req.user.userid,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getUserController,
  editUserController,
  deleteUserController,
};
