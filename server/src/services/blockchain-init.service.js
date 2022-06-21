const Web3 = require("web3");
const {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
} = require("../../../blockchain/contractsConfig/VideoCallContract.config.json");

const { AppError } = require("../utils/errors.util");

let vcContract = null;

/**
 * connectBlockchain function initializes web3 providers and connects to the blockchain network.
 * It returns the video calling contract.
 */
async function connectBlockchain({ web3 = undefined } = {}) {
  try {
    if (typeof web3 !== "undefined") {
      web3 = new Web3(web3.currentProvider);
    } else {
      const blockchainHost = process.env.BLOCKCHAIN_HOST || "localhost";
      const blockchainPort = process.env.BLOCKCHAIN_PORT || 8545;

      const providerUrl = `http://${blockchainHost}:${blockchainPort}`;
      web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
    }

    const tempContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    // this accounts fetching is done just to make sure that the blockchain network is connected
    await web3.eth.getAccounts();

    return {
      contract: tempContract,
      web3,
    };
  } catch (err) {
    throw new AppError({
      statusCode: 503,
      shortMsg: "blockchain-connect-failed",
      message:
        "Cannot connect to Blockchain Network. Please contact the administrator to restart the network to continue..",
    });
  }
}

/**
 * getContract is a helper function, which checks if the video calling contract is initialized or not.
 * If the video contract is unset, it calls the connectBlockchain and sets the contract.
 */
async function getContract() {
  try {
    // if the contract is not there, we try to connect to blockchain network, and get the contract..
    if (vcContract === null) {
      const obj = await connectBlockchain();
      vcContract = obj.contract;
    }

    return {
      vcContract,
    };
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getContract,
  connectBlockchain,
};
