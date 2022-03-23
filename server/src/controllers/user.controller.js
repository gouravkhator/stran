const { deleteUser } = require("../services/smart-contract.service");

async function getUserController(req, res, next) {
  try {
    return res.json({
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
      userid: req.user.userid,
      deletedUser: true,
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
