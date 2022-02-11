const Web3 = require('web3');
const { CONTRACT_ABI, CONTRACT_ADDRESS } = require('../../blockchain/contractsConfig/VideoCallContract.config.json');
const { Language, Location, Status } = require('../utils/enums.util');
const { AppError } = require("../utils/errors.util");

async function getContractObject({
    web3 = undefined
} = {}) {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        // TODO: the url should be dynamic, as it should also run on hosted server too..
        const providerUrl = 'http://localhost:8545';
        web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
    }

    // to call methods which change blockchain state, we need accounts on which we need to run transaction 
    const accounts = await web3.eth.getAccounts();

    if (accounts.length === 0) {
        throw new AppError({
            message: 'No accounts present.. Please run local or online node and check accounts..',
            shortMsg: 'blockchain-accounts-absent',
            statusCode: 503, // service unavailable as accounts is not present on server level
        });
    }

    const vcContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    return {
        contract: vcContract,
        web3,
        accounts,
    }
}

async function createUser({
    vcContract = null,
    accounts = [],
    user: {
        name = null,
        currentLocation = Location.ASIA,
        primaryLanguage = Language.ENGLISH,
        knownLanguages = [Language.ENGLISH],
    } = {}
} = {}) {
    if (name === null) {
        // cannot save null data in smart contract
        throw new AppError({
            message: 'Please provide your name.. We cannot save unnamed person in our application.',
            shortMsg: 'name-not-provided',
            statusCode: 400, // 400 bad request
        });
    }

    if (vcContract === null || accounts.length === 0) {
        const obj = await getContractObject();

        vcContract = obj.contract;
        accounts = obj.accounts;
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
        name,
        parseInt(currentLocation),
        parseInt(primaryLanguage),
        knownLanguages.map((val) => parseInt(val))
    ).send({
        from: accounts[0],
    });

    const savedUserData = await vcContract.methods.userdata(transactionObj.from).call();

    console.log(savedUserData);
    return savedUserData;
}

async function updateUser() {

}

async function deleteUser() {

}

async function addFriend() {

}

async function getFriendsList() {

}

module.exports = {
    getContractObject,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    getFriendsList,
};

// Sample code as below, and this file can be run like: node server/services/smart-contract.service.js
(async () => {
    await createUser({
        user: {
            name: 'Gourav New',
            currentLocation: Location.AMERICA
        }
    });
})();
