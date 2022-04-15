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
     * Some of the params passed in registerUser are enums,
     * and their values in javascript is depicted like 0-based indexed arrays.
     */
    const registerUserTx = await deployedContract.registerUser("go", 0, 1, [1]);

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

    const updateUserTx = await deployedContract.updateUser(
      existingUser.username.toUpperCase(),
      existingUser.location,
      existingUser.primaryLanguage,
      [1],
    );

    await updateUserTx.wait();

    const editedUser = await deployedContract.userdata(updateUserTx.from);
    expect(editedUser.username).to.equal("GO");
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
