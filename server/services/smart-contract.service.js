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
        throw new AppError({
            message: 'Please provide valid blockchain account address..',
            shortMsg: 'invalid-account',
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
    senderAccAddr
} = {}) {
    try {
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

        // check if user already exists or not, via the sender account address
        // if user already exists with this address as the userid, then registerUser method will throw the error.
        // So, we check beforehand..
        if ((await getUserData(senderAccAddr, senderAccAddr)).username !== '') {
            throw new AppError({
                message: 'This account already exists. Please login to continue..',
                shortMsg: 'account-exists-err',
                statusCode: 409, // 409 conflict code, as account already exists,
                // so if create user is done, it would lead to conflicting resource
            });
        }

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

        // userdata solidity method takes in the userid as the param
        const savedUserData = await vcContract.methods.userdata(transactionObj.from).call({
            from: senderAccAddr,
        });

        return savedUserData;

    } catch (err) {
        // null username, validateParams, getSC, existing user etc. throws AppError indirectly or directly. 
        if (err instanceof AppError) {
            throw err;
        }

        // registerUser, userdata or some other methods can throw other errors, so fallback to generic create user error.
        throw new AppError({
            message: 'Error in saving the user details.. Please try again with either the same ethereum account or some other account..',
            shortMsg: 'save-user-err',
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
    senderAccAddr
}) {
    try {
        validateParams({ senderAccAddr });
        const { vcContract } = await getSC();

        const userdata = await getUserData(senderAccAddr, senderAccAddr);
        
        // check if user already exists or not, via the sender account address
        if (userdata.username === '') {
            throw new AppError({
                message: 'This account does not exist. Please signup to continue..',
                shortMsg: 'invalid-account',
                statusCode: 404,
            });
        }

        // TODO: Update user functionality with userdata as the existing object

    } catch (err) {
        if (err instanceof AppError) {
            throw err;
        }

        throw new AppError({
            message: 'Error in updating the user details. Please try again after sometime..',
            shortMsg: 'update-user-err',
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
        const { vcContract } = await getSC();

        // check if user already exists or not, via the sender account address
        if ((await getUserData(senderAccAddr, senderAccAddr)).username === '') {
            throw new AppError({
                message: 'This account does not exist. Please signup to continue..',
                shortMsg: 'invalid-account',
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
            message: 'Unable to delete the user. Please try again after sometime.',
            shortMsg: 'delete-user-err',
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
        const { vcContract } = await getSC();

        // check if user already exists or not, via the sender account address
        if ((await getUserData(senderAccAddr, senderAccAddr)).username === '') {
            throw new AppError({
                message: 'This account does not exist. Please signup to continue..',
                shortMsg: 'invalid-account',
                statusCode: 404,
            });
        }

        // check if friend already exists or not
        if ((await getUserData(friendUserId, senderAccAddr)).username === '') {
            throw new AppError({
                message: "This friend account is probably deleted. Cannot add them as friend.",
                shortMsg: 'invalid-account',
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
            message: 'Unable to add friend for the current user. Please try again after sometime.',
            shortMsg: 'add-friend-err',
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
        const { vcContract } = await getSC();

        // check if user already exists or not, via the sender account address
        if ((await getUserData(senderAccAddr, senderAccAddr)).username === '') {
            throw new AppError({
                message: 'This account does not exist. Please signup to continue..',
                shortMsg: 'invalid-account',
                statusCode: 404,
            });
        }

        const friendsAddrList = await vcContract.methods.getFriendsList().call({
            from: senderAccAddr,
        });

        // reduce method is used so that we can check for every friend and then return appropriate data
        const friendsObjList = await friendsAddrList.reduce(async (list, friendAddr) => {
            const friendData = await getUserData(friendAddr, senderAccAddr);

            if(friendData.username !== ''){
                list.push(friendData);
            }else{
                list.push({
                    deleted: true,
                    userid: friendAddr,
                });
            }

            return list;
        }, []);

        return friendsObjList;

    } catch (err) {
        if (err instanceof AppError) {
            throw err;
        }

        throw new AppError({
            message: "Unable to fetch friends' details for the current user. Please try again after sometime.",
            shortMsg: 'get-friends-err',
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
        /*
        TODO: Current user should get only his own data and some partial data of his friend, 
        iff the friend has allowed that in his privacy settings
        Or, current user can search some other user and also get some info, which are made public..
        */

        validateParams({ senderAccAddr });
        const { vcContract } = await getSC();

        return await vcContract.methods.userdata(userid).call({
            from: senderAccAddr,
        });

    } catch (err) {
        if (err instanceof AppError) {
            throw err;
        }

        throw new AppError({
            message: "Unable to fetch required user data. Please try again after sometime.",
            shortMsg: 'get-userdata-err',
            statusCode: 500,
        });
    }
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
