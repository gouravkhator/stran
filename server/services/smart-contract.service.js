const { Language, Location, Status } = require('../utils/enums.util');
const { AppError } = require("../utils/errors.util");

// alias the long method name as the own short name
const { getContractAndAcc: getSC } = require("./blockchain-init.service");

/**
 * Does sanity checking of the params for this smart contract service methods
 * @returns True if the params provided, are safe, else False
 */
const validateParams = ({ senderAccAddr }) => {
    senderAccAddr = senderAccAddr ?? '';

    if (senderAccAddr !== '' && senderAccAddr.startsWith('0x') && senderAccAddr.length > 2) {
        return true;
    } else {
        return false;
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
    senderAccAddr
} = {}) {
    if (username === null) {
        // cannot save null data in smart contract
        throw new AppError({
            message: 'Please provide your name.. We cannot save unnamed person in our application.',
            shortMsg: 'name-not-provided',
            statusCode: 400, // 400 bad request
        });
    }

    validateParams({ senderAccAddr });

    const { vcContract } = await getSC();

    /*
    If we pass just the javascript number type in the params of a smart contract method like registerUser

    And we know, that registerUser in smart contract also takes uint8, then we also need to parse the number using parseInt.

    Why an extra parsing step??
    >> It maybe bcoz web3 is parsing the javascript number again to string, and solidity wants to have uint8.
    That is why we are getting below error:
    INVALID_ARGUMENT error..
    */
    const transactionObj = await vcContract.methods.registerUser(
        username,
        parseInt(currentLocation),
        parseInt(primaryLanguage),
        knownLanguages.map((language) => parseInt(language))
    ).send({
        from: senderAccAddr,
    });

    // userdata solidity method takes in the userid,
    // and this userid is same as the sender account address
    const savedUserData = await vcContract.methods.userdata(transactionObj.from).call({
        from: senderAccAddr,
    });

    return savedUserData;
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
    senderAccAddr
}) {
    const { vcContract } = await getSC();
    validateParams({ senderAccAddr });

    // current user has the userid, same as the senderAccAddr
    // TODO: Update user functionality
}

async function deleteUser(senderAccAddr) {
    const { vcContract } = await getSC();
    validateParams({ senderAccAddr });

    await vcContract.methods.deleteUser().send({
        from: senderAccAddr,
    });
}

/**
 * Adds friend for the current user, who is doing the transaction
 * @param {*} friendUserId Friend user id, who is to be added
 */
async function addFriend(friendUserId, senderAccAddr) {
    const { vcContract } = await getSC();
    validateParams({ senderAccAddr });

    await vcContract.methods.addFriend(friendUserId).send({
        from: senderAccAddr,
    });
}

/**
 * Returns the list of friends for the sender accounts user.
 */
async function getFriendsList(senderAccAddr) {
    const { vcContract } = await getSC();
    validateParams({ senderAccAddr });

    const friendsAddrList = await vcContract.methods.getFriendsList().call({
        from: senderAccAddr,
    });

    // for each friend, we get their data and then we join all promises into a single one, and await that single promise.
    const friendsObjList = await Promise.all(friendsAddrList.map(async (friendAddr) => {
        return await vcContract.methods.userdata(friendAddr).call({
            from: senderAccAddr,
        });
    }));

    return friendsObjList;
}

/**
 * Returns the user data as saved in blockchain
 * @param {*} userid User ID as required for getting data
 * @returns User data object
 */
async function getUserData(userid, senderAccAddr) {
    // TODO: Current user should get only his own data and some partial data of his friend, 
    // iff the friend has allowed that in his privacy settings
    // Or, current user can search some other user and also get some info, which are made public..

    const { vcContract } = await getSC();
    validateParams({ senderAccAddr });

    return await vcContract.methods.userdata(userid).call({
        from: senderAccAddr,
    });
}

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    getFriendsList,
};

// Sample code as below, and this file can be run like: node server/services/smart-contract.service.js
(async () => {
    try {
        const { accounts } = await getSC();

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

        console.log('The friends list of current user, after adding friend with id: ' + otherUser.userid);
        console.log(await getFriendsList(accounts[0]));

        await deleteUser(accounts[0]);
        console.log('Deleted user : ' + currentUserData.userid);

        console.log('User data of current user after deleting: ');
        console.log(await getUserData(currentUserData.userid)); // output will contain every field, zeroed out

        console.log('Friends list of the friend of current user: ');
        console.log(await getFriendsList(accounts[1]));
    } catch (error) {
        console.error(error);
    }
})();
