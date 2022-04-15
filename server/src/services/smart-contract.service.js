const { recoverPersonalSignature } = require("@metamask/eth-sig-util");
const { bufferToHex } = require("ethereumjs-util");

const { Language, Location, Status } = require("../utils/enums.util");
const { AppError } = require("../utils/errors.util");
const { cleanseUserData } = require("../utils/user.util");

const { getContract } = require("../services/blockchain-init.service");

/**
 * Check if the parameter provided is a valid hex address or not
 * @param {*} data Any Javascript string, which will be passed through the validation checks.
 * @returns true if it is valid hex address, otherwise false
 */
const validateHexAddress = (data) => {
  data = data ?? "";

  return (
    data !== "" &&
    typeof data === "string" &&
    data.startsWith("0x") &&
    data.length > 2
  );
};

/**
 * Does sanity checking of the params for this smart contract service methods
 * @returns True if the params provided, are safe, else False
 */
const validateParams = ({ senderAccAddr }) => {
  senderAccAddr = senderAccAddr ?? "";

  if (validateHexAddress(senderAccAddr) === true) {
    return true;
  } else {
    throw new AppError({
      message: "Please provide valid blockchain account address..",
      shortMsg: "invalid-account",
      statusCode: 401,
    });
  }
};

/**
 * Every service below has senderAccAddr to the valid address of the sender's account..
 * It specifies, from which account we want to make the blockchain modification/methpds transaction.
 */

/**
 * createUser - A service function to create user in the blockchain.
 * It takes in username, currentLocation, primaryLanguage of choice, and languages known by the user.
 */
async function createUser({
  username = null,
  currentLocation = Location.ASIA,
  primaryLanguage = Language.ENGLISH,
  knownLanguages = [Language.ENGLISH],
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

    validateParams({ senderAccAddr });
    const { vcContract } = await getContract();

    /**
     * check if user already exists or not, via the sender account address.
     * if user already exists with this address as the userid, then registerUser method will throw the error.
     * So, we check beforehand..
     */
    if ((await getUserData(senderAccAddr, senderAccAddr)).username !== "") {
      throw new AppError({
        message: "This account already exists. Please login to continue..",
        shortMsg: "account-exists-err",
        statusCode: 409, // 409 conflict code, as account already exists,
        // so if create user is done, it would lead to conflicting resource
      });
    }

    /**
     * If we pass just the javascript number type in the params of a smart contract method like registerUser.
     *
     * And we know, that registerUser in smart contract also takes uint8, then we also need to parse the number using parseInt.
     *
     * Why an extra parsing step??
     * >> It maybe bcoz web3 is parsing the javascript number again to string, and solidity wants to have uint8.
     * That is why we are getting below error:
     * INVALID_ARGUMENT error..
     */
    const transactionObj = await vcContract.methods
      .registerUser(
        username,
        parseInt(currentLocation),
        parseInt(primaryLanguage),
        knownLanguages.map((language) => parseInt(language)),
      )
      .send({
        from: senderAccAddr,
      });

    // userdata solidity method takes in the userid as the param
    const savedUserData = await vcContract.methods
      .userdata(transactionObj.from)
      .call({
        from: senderAccAddr,
      });

    // ! ISSUE: the savedUserData has knownLanguages as undefined
    return cleanseUserData(savedUserData);
  } catch (err) {
    // null username, validateParams, getContract, existing user etc. throws AppError indirectly or directly.
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
 */
async function updateUser({
  username,
  currentLocation,
  primaryLanguage,
  knownLanguages,
  senderAccAddr,
}) {
  try {
    validateParams({ senderAccAddr });
    const { vcContract } = await getContract();

    const userdata = await getUserData(senderAccAddr, senderAccAddr);

    // check if user already exists or not, via the sender account address
    if (userdata.username === "") {
      throw new AppError({
        message: "This account does not exist. Please signup to continue..",
        shortMsg: "invalid-account",
        statusCode: 404,
      });
    }

    // TODO: Update user functionality with userdata as the existing object
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
    validateParams({ senderAccAddr });
    const { vcContract } = await getContract();

    // check if user exists or not, via the sender account address
    if ((await getUserData(senderAccAddr, senderAccAddr)).username === "") {
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
    validateParams({ senderAccAddr });
    const { vcContract } = await getContract();

    // check if user already exists or not, via the sender account address
    if ((await getUserData(senderAccAddr, senderAccAddr)).username === "") {
      throw new AppError({
        message: "This account does not exist. Please signup to continue..",
        shortMsg: "invalid-account",
        statusCode: 404,
      });
    }

    // check if friend already exists or not
    if ((await getUserData(friendUserId, senderAccAddr)).username === "") {
      throw new AppError({
        message:
          "This friend account is probably deleted. Cannot add them as friend.",
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
 */
async function getFriendsList(senderAccAddr) {
  try {
    validateParams({ senderAccAddr });
    const { vcContract } = await getContract();

    // check if user already exists or not, via the sender account address
    if ((await getUserData(senderAccAddr, senderAccAddr)).username === "") {
      throw new AppError({
        message: "This account does not exist. Please signup to continue..",
        shortMsg: "invalid-account",
        statusCode: 404,
      });
    }

    const friendsAddrList = await vcContract.methods.getFriendsList().call({
      from: senderAccAddr,
    });

    // reduce method is used so that we can check for every friend and then return appropriate data
    const friendsObjList = await friendsAddrList.reduce(
      async (list, friendAddr) => {
        const friendData = await getUserData(friendAddr, senderAccAddr);

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
 * Returns the user data as saved in blockchain
 * @param {*} userid User ID as required for getting data
 * @returns User data object
 */
async function getUserData(userid, senderAccAddr) {
  try {
    /**
     * TODO: Current user should get only his own data and some partial data of his friend,
     * iff the friend has allowed that in his privacy settings..
     * Or, current user can search some other user and also get some info, which are made public..
     *
     * Currently, Login and authorization has helped maintain this security by only getting own data,
     * but we want to boil this security down to this service too..
     */

    validateParams({ senderAccAddr });
    const { vcContract } = await getContract();

    return cleanseUserData(
      await vcContract.methods.userdata(userid).call({
        from: senderAccAddr,
      }),
    );
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
    validateParams({ senderAccAddr });
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

    const userdata = await getUserData(publicAddress, publicAddress);

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
  getUserData,
  verifySignature,
};

// Sample code as below, and this file can be run like: node server/services/smart-contract.service.js
/*
(async () => {
    try {
        const accounts = [
            '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
            '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        ];

        const currentUserData = await createUser({
            username: 'Gourav Khator',
            currentLocation: Location.AMERICA,
            senderAccAddr: accounts[0],
        });

        console.log("Current user data is as follows: ");
        console.log(currentUserData);

        const friendsObjList = await getFriendsList(accounts[0]);
        console.log("\nCurrently, this new user has no friends as logged below:");
        console.log(friendsObjList);

        const otherUser = await createUser({
            username: 'Friend',
            currentLocation: Location.ASIA,
            senderAccAddr: accounts[1], // so that we can create user from different account sender
            // as in solidity, for security reasons, we want only 1 account from that sender.
        });

        console.log("\nAdding friend for current user..");
        await addFriend(otherUser.userid, accounts[0]);

        console.log('\nThe friends list of current user, after adding friend with id: ' + otherUser.userid);
        console.log(await getFriendsList(accounts[0]));

        await deleteUser(accounts[0]);
        console.log('\nDeleted user : ' + currentUserData.userid);

        console.log('User data of current user after deleting: ');
        console.log(await getUserData(currentUserData.userid, accounts[0])); // output will contain every field, zeroed out

        console.log('\n\nFriends list of the friend of current user: ');
        console.log(await getFriendsList(accounts[1]));

    } catch (error) {
        console.error(error);
    }
})();
*/
