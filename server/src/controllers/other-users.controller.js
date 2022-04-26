const {
  getRandomAvailableUser,
  getFriendsList,
  getUserData,
} = require("../services/smart-contract.service");
const { AppError } = require("../utils/errors.util");

async function getAvailableRandomUserController(req, res, next) {
  try {
    const randomAvailableUserId = await getRandomAvailableUser(req.user.userid);

    return res.json({
      status: "success",
      found: true,
      randomAvailableUserId,
    });
  } catch (err) {
    return next(err);
  }
}

async function getFriendDataController(req, res, next) {
  try {
    const friendUserId = req.params.friendUserId ?? null;

    if (friendUserId === null) {
      throw new AppError({
        message: "Please provide the user id for your friend to get his data..",
        shortMsg: "friend-id-not-provided",
        statusCode: 400,
      });
    }

    // TODO: this friend id check should be done in the service in method: getUserData
    // getUserData should allow this user's full data and friend's only-allowed data
    const friendsAddrList = await getFriendsList({
      senderAccAddr: req.user.userid,
      onlyUserIdsNeeded: true,
    });

    if (friendUserId in friendsAddrList) {
      const friendData = await getUserData({
        userid: friendUserId,
        senderAccAddr: req.user.userid,
      });

      return res.json({
        status: "success",
        friendUserId,
        friendData,
      });
    } else {
      throw new AppError({
        message:
          "This friend might have deleted his/her account. No data exists for this friend userid",
        shortMsg: "friend-not-found",
        statusCode: 404,
      });
    }
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getAvailableRandomUserController,
  getFriendDataController,
};
