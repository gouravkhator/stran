const Web3 = require("web3");
const {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
} = require("../../../blockchain/contractsConfig/VideoCallContract.config.json");

let vcContract = null;

/**
 * connectBlockchain function initializes web3 providers and connects to the blockchain network.
 * It returns the video calling contract.
 */
async function connectBlockchain({ web3 = undefined } = {}) {
  if (typeof web3 !== "undefined") {
    web3 = new Web3(web3.currentProvider);
  } else {
    // TODO: the url should be dynamic, as it should also run on hosted server too..
    const providerUrl = "http://localhost:8545";
    web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
  }

  const tempContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

  return {
    contract: tempContract,
    web3,
  };
}

/**
 * getContract is a helper function, which checks if the video calling contract is initialized or not.
 * If the video contract is unset, it calls the connectBlockchain and sets the contract.
 */
async function getContract() {
  // if the contract is not there, we try to connect to blockchain network, and get the contract..
  if (vcContract === null) {
    const obj = await connectBlockchain();
    vcContract = obj.contract;
  }

  return {
    vcContract,
  };
}

module.exports = {
  getContract,
  connectBlockchain,
};
