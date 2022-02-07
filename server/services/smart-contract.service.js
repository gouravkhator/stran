const Web3 = require('web3');
const { CONTRACT_ABI, CONTRACT_ADDRESS } = require('../../blockchain/contractsConfig/VideoCallContract.config.json');

function getContractObject({
    web3
}) {
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
        console.error('No accounts present.. Please run local or online node and check accounts..');
        process.exit(1);
    }

    const vcContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    return {
        contract: vcContract,
    }
}

async function createUser(){

}

async function updateUser(){

}

async function deleteUser(){

}

async function addFriend(){

}

async function getFriendsList(){

}

module.exports = {
    getContractObject,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    getFriendsList,
};
