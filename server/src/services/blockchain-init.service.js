const Web3 = require("web3");
const path = require("path");
const fs = require("fs/promises");

const { AppError } = require("../utils/errors.util");

let vcContract = null;

/**
 *
 * @returns CONTRACT_ABI and CONTRACT_ADDRESS of the smart contract, and if the smart contract is not deployed, this function throws the error
 */
async function readSmartContractConfigFile() {
  try {
    const configPath = path.join(
      __dirname,
      "../../../blockchain/contractsConfig/VideoCallContract.config.json",
    );

    await fs.access(configPath); // checks if file exists or not

    // if file exists, then read the file
    const data = await fs.readFile(configPath);
    const { CONTRACT_ABI, CONTRACT_ADDRESS } = JSON.parse(data);

    return {
      CONTRACT_ABI,
      CONTRACT_ADDRESS,
    };
  } catch (err) {
    throw new AppError({
      statusCode: 503, // as the config file is not found, so the service will be unavailable
      shortMsg: "blockchain-smart-contract-not-deployed",
      message:
        "Blockchain smart contract is not deployed. Please contact the administrator for this issue.",
    });
  }
}

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

    const { CONTRACT_ABI, CONTRACT_ADDRESS } =
      await readSmartContractConfigFile();

    const tempContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    // this accounts fetching is done just to make sure that the blockchain network is connected
    await web3.eth.getAccounts();

    return {
      contract: tempContract,
      web3,
    };
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    } else {
      throw new AppError({
        statusCode: 503,
        shortMsg: "blockchain-connect-failed",
        message:
          "Cannot connect to Blockchain Network. Please contact the administrator to restart the network to continue..",
      });
    }
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
