const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Election", function () {
  it("Should add new candidate and check if that is added to the candidates or not", async function () {
    const Election = await ethers.getContractFactory("Election");
    const election = await Election.deploy();
    const addCandidateTx = await election.addCandidate("gourav khator");

    await addCandidateTx.wait();
    const temp = await election.candidates(3);

    expect(temp.name).to.equal("gourav khator");
  });
});
