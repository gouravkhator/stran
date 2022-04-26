const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VideoCall | Current User CRUD Tests", function () {
  /**
   * The contract factory, containing the main smart contract
   */
  let contractFactory;

  /**
   * Deployed contract, created from the contract factory..
   * Deployed contract is like an instance of that contract factory
   */
  let deployedContract;

  /**
   * One of the blockchain account address, used for testing the methods..
   */
  let addr1;

  /**
   * Run the before hook, to run before any of the sub-tests runs..
   */
  before(async function () {
    contractFactory = await ethers.getContractFactory("VideoCallContract");
    deployedContract = await contractFactory.deploy();

    // blockchain account address, out of which one of them is being used as a user's account address
    [addr1] = await ethers.getSigners();
  });

  it("Should register new user and check if that is added to userdata mapping", async function () {
    /**
     * enum fields or enum-based fields like location, primaryLanguage, status, knownLanguages
     * are all in number formats and not in string formats..
     */
    const location = 0,
      primaryLanguage = 1,
      knownLanguages = [1];

    /*
      By default, if we don't call the connect method on deployedContract variable,
      that actually connects to the 1st account address.
    */
    const registerUserTx = await deployedContract.registerUser(
      "go",
      location,
      primaryLanguage,
      knownLanguages,
    );

    await registerUserTx.wait();

    const savedUser = await deployedContract.userdata(registerUserTx.from);
    expect(savedUser.username).to.equal("go");
  });

  /**
   * As we don't deploy again and again the contract,
   * so we can use the existing data,
   * instead of creating the user before testing the edit functionality..
   */
  it("Should edit the existing user and check if the fields are updated or not", async function () {
    const existingUser = await deployedContract.userdata(addr1.address);

    /**
     * enum fields or enum-based fields like location, primaryLanguage, status, knownLanguages
     * are all in number formats and not in string formats..
     */
    const updateUserTx = await deployedContract.updateUser(
      existingUser.username.toUpperCase(),
      existingUser.location,
      existingUser.primaryLanguage + 1,
      existingUser.status,
      // !ISSUE: update below knownLanguages param when the issue regarding knownLanguages gets solved
      [1],
    );

    await updateUserTx.wait();

    const editedUser = await deployedContract.userdata(updateUserTx.from);
    expect(editedUser.username).to.equal("GO");
    expect(editedUser.primaryLanguage).to.equal(2);

    /**
     * as primaryLanguage gets updated,
     * so the requiredLanguage of callerOptions also gets updated in our code..
     */
    expect(editedUser.callerOptions.requiredLanguage).to.equal(2);
  });

  it("Should delete created user and check if that is removed from userdata mapping", async function () {
    const alreadySavedUser = await deployedContract.userdata(addr1.address);

    // console.info("The already saved user is as follows: ");
    // console.log({ alreadySavedUser });
    // console.warn("\n...Proceeding to delete this user...\n");

    const deleteUserTx = await deployedContract.deleteUser();
    await deleteUserTx.wait();

    const removedUser = await deployedContract.userdata(deleteUserTx.from);
    expect(removedUser.username).to.equal("");
  });
});

describe("VideoCall | Strangers Tests", function () {
  /**
   * The contract factory, containing the main smart contract
   */
  let contractFactory;

  /**
   * Deployed contract, created from the contract factory..
   * Deployed contract is like an instance of that contract factory
   */
  let deployedContract;

  /*
   The blockchain account addresses, used for testing the methods..
   */
  let userAddr, strangerAddr1, strangerAddr2;

  /**
   * Instantiates and deploys the smart contract, and sets the addresses..
   *
   * Run the before hook, to run before any of the sub-tests runs..
   */
  before(async function () {
    contractFactory = await ethers.getContractFactory("VideoCallContract");
    deployedContract = await contractFactory.deploy();

    // getting the account address for testing
    [userAddr, strangerAddr1, strangerAddr2] = await ethers.getSigners();
  });

  /**
   * Registers the main current user, and other stranger users..
   */
  before(async function () {
    /**
     * Helper method for registering a new user.
     * @param {*} addr Signer Address object of the user to be registered newly.
     *
     * This addr is not a string, instead the main address is addr.address
     */
    const registerNewUserHelper = async (addr) => {
      const location = 0,
        primaryLanguage = 1,
        knownLanguages = [1];

      const registerUserTx = await deployedContract
        .connect(addr)
        .registerUser("go", location, primaryLanguage, knownLanguages);

      await registerUserTx.wait();
    };

    // registering current user with status as available by default
    await registerNewUserHelper(userAddr);

    // registering two strangers with status as available by default
    await registerNewUserHelper(strangerAddr1);
    await registerNewUserHelper(strangerAddr2);
  });

  it("Should get available persons' address for current user, as equal to 1st stranger's address", async function () {
    // gets first available person address for the current user, which is currently stranger1's address
    const foundAvailableAddr = await deployedContract
      .connect(userAddr)
      .getRandomAvailableUser();

    expect(foundAvailableAddr).to.be.equal(strangerAddr1.address);
  });

  it("Should make the first stranger offline, and then get available persons' address, as equal to 2nd stranger's address", async function () {
    // updating stranger1's status to be equal to OFFLINE (integer representation is 4)
    // now the available user should be stranger2
    const existingUser = await deployedContract.userdata(strangerAddr1.address);
    const newStatus = 4,
      newKnownLanguages = [1];

    const updateUserTx = await deployedContract
      .connect(strangerAddr1)
      .updateUser(
        existingUser.username,
        existingUser.location,
        existingUser.primaryLanguage,
        newStatus,
        newKnownLanguages,
      );

    await updateUserTx.wait();

    // find available persons' address for the current user..
    const foundAvailableAddr = await deployedContract
      .connect(userAddr)
      .getRandomAvailableUser();

    expect(foundAvailableAddr).to.be.equal(strangerAddr2.address);
  });
});
