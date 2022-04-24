const { destroyAccessToken } = require("../services/auth.service");
const {
  deleteUser,
  updateUser,
} = require("../services/smart-contract.service");

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

async function updateUserController(req, res, next) {
  try {
    const dataToEdit = {
      username: req.body.username ?? null,
      location: req.body.location ?? null,
      primaryLanguage: req.body.primaryLanguage ?? null,
      status: req.body.status ?? null,
      knownLanguages: req.body.knownLanguages ?? null,
    };

    /*
    Most necessary validations are done in the updateUser service method or its internally invoked util methods..
    
    This updateUser internally checks if no data is passed in req.body to edit,
    or if the data passed requires any update in blockchain or not.
    */
    const updatedUserData = await updateUser({
      username: dataToEdit.username,
      location: dataToEdit.location,
      primaryLanguage: dataToEdit.primaryLanguage,
      status: dataToEdit.status,
      knownLanguages: dataToEdit.knownLanguages,
      senderAccAddr: req.user.userid,
    });

    return res.json({
      status: "success",
      updatedUser: true,
      user: updatedUserData,
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteUserController(req, res, next) {
  try {
    const token = req.signedCookies["jwtToken"] ?? null;

    /**
     * Normally, delete user deletes the user from the blockchain,
     * but we also need to invalidate the access token,
     * so that the user should not have any cached data too..
     */
    await destroyAccessToken(token);
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
  updateUserController,
  deleteUserController,
};
