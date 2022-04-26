const { recoverPersonalSignature } = require("@metamask/eth-sig-util");
const { bufferToHex } = require("ethereumjs-util");

const { AppError } = require("../utils/errors.util");

const {
  cleanseUserData,
  makeDataBlockchainCompat,
} = require("../utils/user.util");

const {
  checkIfUpdateRequired,
  validateHexAddress,
  validateSmartContractParams,
} = require("../utils/sc-service.util");

const { getContract } = require("../services/blockchain-init.service");

/**
 * Every service below has senderAccAddr to the valid address of the sender's account..
 * It specifies, from which account we want to make the blockchain modification/methods transaction.
 */

/**
 * createUser - A service function to create user in the blockchain.
 * It takes in username, currentLocation, primaryLanguage of choice, and languages known by the user.
 */
async function createUser({
  username = null,
  location = "ASIA",
  primaryLanguage = "ENGLISH",
  knownLanguages = ["ENGLISH"],
  senderAccAddr,
} = {}) {
  try {
    if (username === null) {
      // cannot save null data in smart contract
      throw new AppError({
        message:
          "Please provide your name.. We cannot save a person with no name provided.",
        shortMsg: "name-not-provided",
        statusCode: 400, // 400 bad request
      });
    }

    validateSmartContractParams({ senderAccAddr });
    const { vcContract } = await getContract();

    const userdata = await getUserData({
      userid: senderAccAddr,
      senderAccAddr: senderAccAddr,
    });

    /**
     * check if user already exists or not, via the sender account address.
     * if user already exists with this address as the userid, then registerUser method will throw the error.
     * So, we check beforehand..
     */
    if (userdata.username !== "") {
      throw new AppError({
        message: "This account already exists. Please login to continue..",
        shortMsg: "account-exists-err",
        statusCode: 409, // 409 conflict code, as account already exists,
        // so if create user is done, it would lead to conflicting resource
      });
    }

    // transform the enum fields into blockchain compatible numbers/indices
    const compatibleObj = makeDataBlockchainCompat({
      location,
      primaryLanguage,
      knownLanguages,
    });

    const locationToSave = compatibleObj.location,
      primaryLangToSave = compatibleObj.primaryLanguage,
      knownLanguagesToSave = compatibleObj.knownLanguages;

    const createUserTx = await vcContract.methods
      .registerUser(
        username,
        locationToSave,
        primaryLangToSave,
        knownLanguagesToSave,
      )
      .send({
        from: senderAccAddr,
      });

    return getUserData({
      userid: createUserTx.from,
      senderAccAddr: senderAccAddr,
    });
  } catch (err) {
    // null username, validateSmartContractParams, getContract, existing user etc. throws AppError indirectly or directly.
    if (err instanceof AppError) {
      throw err;
    }

    // registerUser, userdata or some other methods can throw other errors, so fallback to generic create user error.
    throw new AppError({
      message:
        "Error in saving the user details.. Please try again with either the same ethereum account or some other account..",
      shortMsg: "save-user-err",
      statusCode: 500,
    });
  }
}

/**
 * updateUser - A service function to update user's data in the blockchain.
 * It takes in username, currentLocation, primaryLanguage of choice, and languages known by the user.
 *
 * This service method checks below things by itself or the util methods used in here:
 * 1. checkIfUpdateRequired method checks if the fields are really to be updated..
 * 2. makeDataBlockchainCompat method checks if we can parse the data to blockchain data types,
 * and then parses those data.
 * 3. Then, we update the user with all valid data..
 */
async function updateUser({
  username = null,
  location = null,
  primaryLanguage = null,
  knownLanguages = null,
  status = null,
  senderAccAddr,
}) {
  try {
    validateSmartContractParams({ senderAccAddr });
    const { vcContract } = await getContract();

    const existingUser = await getUserData({
      userid: senderAccAddr,
      senderAccAddr: senderAccAddr,
    });

    // check if user already exists or not, via the sender account address
    if (existingUser.username === "") {
      throw new AppError({
        message: "This account does not exist. Please signup to continue..",
        shortMsg: "invalid-account",
        statusCode: 404,
      });
    }

    const newUserData = {
      username,
      location,
      primaryLanguage,
      status,
      knownLanguages,
    };

    /**
     * Checks if any fields are modified really or not,
     * and if no fields are modified then it throws a 400 Bad request AppError
     */
    checkIfUpdateRequired({ existingUser, newUserData });

    /**
     * Makes the enum fields of the passed params of this function as blockchain-compatible.
     *
     * Before that, it first checks if the values passed are valid to be parsed, and then it processes them..
     * If they are invalid, it throws a 400 Bad request AppError.
     */
    const compatibleObj = makeDataBlockchainCompat({
      // if any field is not passed, we fallback to existing values of the blockchain
      location: location ?? existingUser.location,
      primaryLanguage: primaryLanguage ?? existingUser.primaryLanguage,
      // knownLanguages: knownLanguages?.length > 0 ? knownLanguages : existingUser.knownLanguages,
      knownLanguages: [],
      status: status ?? existingUser.status,
    });

    const locationToSave = compatibleObj.location,
      primaryLangToSave = compatibleObj.primaryLanguage,
      statusToSave = compatibleObj.status,
      knownLanguagesToSave = compatibleObj.knownLanguages,
      usernameToSave = username ?? existingUser.username;

    const updateUserTx = await vcContract.methods
      .updateUser(
        usernameToSave,
        locationToSave,
        primaryLangToSave,
        statusToSave,
        knownLanguagesToSave,
      )
      .send({
        from: senderAccAddr,
      });

    const modifiedUserData = await getUserData({
      userid: updateUserTx.from,
      senderAccAddr: senderAccAddr,
    });

    return modifiedUserData;
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError({
      message:
        "Error in updating the user details. Please try again after sometime..",
      shortMsg: "update-user-err",
      statusCode: 500,
    });
  }
}

/**
 * Deletes the user, with the userid same as the sender account address senderAccAddr
 */
async function deleteUser(senderAccAddr) {
  try {
    validateSmartContractParams({ senderAccAddr });
    const { vcContract } = await getContract();

    const userdata = await getUserData({
      userid: senderAccAddr,
      senderAccAddr,
    });

    // check if user exists or not, via the sender account address
    if (userdata.username === "") {
      throw new AppError({
        message: "This account does not exist. Please signup to continue..",
        shortMsg: "invalid-account",
        statusCode: 404,
      });
    }

    await vcContract.methods.deleteUser().send({
      from: senderAccAddr,
    });
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError({
      message: "Unable to delete the user. Please try again after sometime.",
      shortMsg: "delete-user-err",
      statusCode: 500,
    });
  }
}

/**
 * Adds friend for the current user, who is doing the transaction
 * @param {*} friendUserId Friend user id, who is to be added
 */
async function addFriend(friendUserId, senderAccAddr) {
  try {
    validateSmartContractParams({ senderAccAddr });
    const { vcContract } = await getContract();

    // check if user already exists or not, via the sender account address
    const userdata = await getUserData({
      userid: senderAccAddr,
      senderAccAddr,
    });

    // check if user exists or not, via the sender account address
    if (userdata.username === "") {
      throw new AppError({
        message: "This account does not exist. Please signup to continue..",
        shortMsg: "invalid-account",
        statusCode: 404,
      });
    }

    await vcContract.methods.addFriend(friendUserId).send({
      from: senderAccAddr,
    });
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError({
      message:
        "Unable to add friend for the current user. Please try again after sometime.",
      shortMsg: "add-friend-err",
      statusCode: 500,
    });
  }
}

/**
 * Returns the list of friends for the sender accounts user.
 *
 * @param senderAccAddr Sender's account address, for whom, we need the friends list
 * @param onlyUserIdsNeeded If only the user ids of those friends are needed,
 * then it returns their user ids only, else their full data is returned too..
 */
async function getFriendsList({ senderAccAddr, onlyUserIdsNeeded = false }) {
  try {
    validateSmartContractParams({ senderAccAddr });
    const { vcContract } = await getContract();

    const userdata = await getUserData({
      userid: senderAccAddr,
      senderAccAddr,
    });

    // check if user exists or not
    if (userdata.username === "") {
      throw new AppError({
        message: "This account does not exist. Please signup to continue..",
        shortMsg: "invalid-account",
        statusCode: 404,
      });
    }

    const friendsAddrList = await vcContract.methods.getFriendsList().call({
      from: senderAccAddr,
    });

    if (onlyUserIdsNeeded === true) {
      // then return the friends' addresses list
      return friendsAddrList;
    }

    // reduce method is used so that we can check for every friend and then return appropriate data
    const friendsObjList = await friendsAddrList.reduce(
      async (list, friendAddr) => {
        const friendData = await getUserData({
          userid: friendAddr,
          senderAccAddr: senderAccAddr,
        });

        if (friendData.username !== "") {
          list.push(friendData);
        } else {
          list.push({
            deleted: true,
            userid: friendAddr,
          });
        }

        return list;
      },
      [],
    );

    return friendsObjList;
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError({
      message:
        "Unable to fetch friends' details for the current user. Please try again after sometime.",
      shortMsg: "get-friends-err",
      statusCode: 500,
    });
  }
}

/**
 * Returns the random available user's account address if there is any, else throws a 404 error.
 * @param {*} senderAccAddr Sender Blockchain's account address, which is same as the userid here..
 * @returns the random available user's account address, otherwise a 404 error is thrown if no users are available.
 */
async function getRandomAvailableUser(senderAccAddr) {
  try {
    validateSmartContractParams({ senderAccAddr });
    const { vcContract } = await getContract();

    const userdata = await getUserData({
      userid: senderAccAddr,
      senderAccAddr,
    });

    // check if user exists or not
    if (userdata.username === "") {
      throw new AppError({
        message: "This account does not exist. Please signup to continue..",
        shortMsg: "invalid-account",
        statusCode: 404,
      });
    }

    const availableUserAddr = await vcContract.methods
      .getRandomAvailableUser()
      .call({
        from: senderAccAddr,
      });

    const zeroedAddrPattern = /^0x(0)+$/;

    /*
    if availableUserAddr is a zeroed address, 
    then match results will be an array of those results..

    if availableUserAddr is not a zeroed address,
    then the results will be null, and we default the results to empty array
    */
    const zeroedAddrMatchResults =
      availableUserAddr.match(zeroedAddrPattern) ?? [];

    if (zeroedAddrMatchResults.length === 0) {
      return availableUserAddr;
    } else {
      throw new AppError({
        message: "No users available now. Please try again after sometime..",
        shortMsg: "no-random-available-user",
        statusCode: 404,
      });
    }
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError({
      message:
        "Unable to fetch available user's info. Please try again after sometime.",
      shortMsg: "get-available-user-err",
      statusCode: 500,
    });
  }
}

/**
 * Gets the user data from blockchain and cleanses it up..
 * @param {*} userid User ID as required for getting data
 * @returns User data object
 */
async function getUserData({ userid, senderAccAddr }) {
  try {
    /**
     * TODO: Current user should get only his own data and some partial data of his friend,
     * iff the friend has allowed that in his privacy settings..
     * Or, current user can search some other user and also get some info, which are made public..
     *
     * Currently, Login and authorization has helped maintain this security by only getting own data,
     * but we want to boil this security down to this service too..
     */

    validateSmartContractParams({ senderAccAddr });
    const { vcContract } = await getContract();

    const userdata = await vcContract.methods.userdata(userid).call({
      from: senderAccAddr,
    });

    return cleanseUserData(userdata);
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError({
      message:
        "Unable to fetch required user data. Please try again after sometime.",
      shortMsg: "get-userdata-err",
      statusCode: 500,
    });
  }
}

async function verifySignature({ senderAccAddr, signature }) {
  try {
    validateSmartContractParams({ senderAccAddr });
    const publicAddress = senderAccAddr;

    /**
     * signature is of 132-character long, which includes the 0x characters too..
     * first validate if it is a hex or not, and then check the length
     */
    if (validateHexAddress(signature) === false || signature.length < 132) {
      throw new AppError({
        statusCode: 400,
        shortMsg: "signature-not-valid",
        message:
          "Either signature was not provided or is invalid. It should be 0x-prefixed hex strings and 132-characters long. Please provide valid signature, by signing from MetaMask..",
      });
    }

    const userdata = await getUserData({
      userid: publicAddress,
      senderAccAddr: publicAddress,
    });

    if (userdata.username === "") {
      throw new AppError({
        statusCode: 400,
        shortMsg: "user-not-found-bad-request",
        message:
          "User not found, so we cannot verify any signature to let you login. Please click on 'Login with Metamask' again..",
      });
    }

    const msg = `I am signing my one-time number: ${userdata.nonce}`;

    const msgBufferHex = bufferToHex(Buffer.from(msg, "utf8"));
    const address = recoverPersonalSignature({
      data: msgBufferHex,
      signature,
    });

    if (address.toLowerCase() === publicAddress.toLowerCase()) {
      return {
        user: userdata,
        verified: true,
      };
    } else {
      throw new AppError({
        statusCode: 400, // the user sent a bad request with invalid token details.
        message: "Signature verification failed! Please try again..",
        shortMsg: "signature-verify-failed",
      });
    }
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  getFriendsList,
  getRandomAvailableUser,
  getUserData,
  verifySignature,
};

// Sample code as below, and this file can be run like: node server/src/services/smart-contract.service.js
/*
(async () => {
  const accounts = [
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
  ];

  try {
    const currentUserData = await createUser({
      username: "Gourav Khator",
      currentLocation: "AMERICA",
      senderAccAddr: accounts[0],
    });

    console.log("Current user data is as follows: ");
    console.log(currentUserData);

    const modifiedUserData = await updateUser({
      username: "Edited Gourav",
      primaryLanguage: "TELUGU",
      senderAccAddr: accounts[0],
    });

    console.log("Modified user data is as follows: ");
    console.log(modifiedUserData);

    const friendsObjList = await getFriendsList({senderAccAddr: accounts[0], onlyUserIdsNeeded: false});
    console.log("\nCurrently, this new user has no friends as logged below:");
    console.log(friendsObjList);

    console.log("Getting random available user: ");
    console.log(await getRandomAvailableUser(accounts[0]));
    
    const otherUser = await createUser({
      username: "Friend",
      currentLocation: "ASIA",
      senderAccAddr: accounts[1], // so that we can create user from different account sender
      // as in solidity, for security reasons, we want only 1 account from that sender.
    });

    console.log("\nAdding friend for current user..");
    await addFriend(otherUser.userid, accounts[0]);

    console.log(
      "\nThe friends list of current user, after adding friend with id: " +
        otherUser.userid,
    );
    console.log(await getFriendsList({ senderAccAddr: accounts[0], onlyUserIdsNeeded: false}));

    console.log("Getting random available user: ");
    console.log(await getRandomAvailableUser(accounts[0]));
    
    await deleteUser(accounts[0]);
    console.log("\nDeleted user : " + currentUserData.userid);

    console.log("User data of current user after deleting: ");

    // output will contain every field, zeroed out
    console.log(
      await getUserData({
        userid: currentUserData.userid,
        senderAccAddr: accounts[0],
      }),
    );

    console.log("\n\nFriends list of the friend of current user: ");
    console.log(await getFriendsList({senderAccAddr: accounts[1], onlyUserIdsNeeded: false}));
  } catch (error) {
    console.error(error);
  }
})();
*/
