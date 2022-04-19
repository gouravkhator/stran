const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VideoCallContract", function () {
  let contractFactory;
  let deployedContract;
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
