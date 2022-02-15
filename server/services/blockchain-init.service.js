const Web3 = require('web3');
const { AppError } = require("../utils/errors.util");
const { CONTRACT_ABI, CONTRACT_ADDRESS } = require('../../blockchain/contractsConfig/VideoCallContract.config.json');

let vcContract = null, accounts = [];

/**
 * connectBlockchain function initializes web3 providers and connects to the blockchain network.
 * It returns the video calling contract, and the accounts of that web3 provider.
 */
async function connectBlockchain({
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
    const tempAccounts = await web3.eth.getAccounts();

    if (tempAccounts.length === 0) {
        throw new AppError({
            message: 'No accounts present.. Please run local or online node and check accounts..',
            shortMsg: 'blockchain-accounts-absent',
            statusCode: 503, // service unavailable as accounts is not present on server level
        });
    }

    const tempContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    return {
        contract: tempContract,
        web3,
        accounts: tempAccounts,
    }
}

/**
 * getContractAndAcc is a helper function, which checks if the video calling contract is initialized or not.
 * It also checks if the accounts for blockchain transactions are set or not.
 * If either of the above are unset, it calls the connectBlockchain and sets both the accounts and the contract.
 */
async function getContractAndAcc() {
    // if either contract is not there, or accounts is not there, we try to connect to blockchain network..
    if (vcContract === null || accounts.length === 0) {
        const obj = await connectBlockchain();

        vcContract = obj.contract;
        accounts = obj.accounts;
    }

    return {
        vcContract,
        accounts,
    };
}

module.exports = {
    getContractAndAcc,
    connectBlockchain,
};
