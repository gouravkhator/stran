// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs/promises");
const path = require("path");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // --------ELECTION SMART CONTRACT---------

  // We get the contract to deploy
  // const Election = await hre.ethers.getContractFactory("Election");
  // const election = await Election.deploy();

  // await election.deployed();

  // console.log("Election deployed to:", election.address);

  const VideoCallContract = await hre.ethers.getContractFactory(
    "VideoCallContract",
  );
  const videoCallContract = await VideoCallContract.deploy();

  await videoCallContract.deployed();

  const artifact = await hre.artifacts.readArtifact("VideoCallContract"); // for getting abi from compiled contracts' artifacts

  const configPath = path.join(
    __dirname,
    "../contractsConfig/VideoCallContract.config.json",
  );

  await fs.writeFile(
    configPath,
    JSON.stringify({
      CONTRACT_ADDRESS: videoCallContract.address,
      CONTRACT_ABI: artifact.abi,
    }),
  );

  console.log(
    `\nSaved ABI and smart contract address for VideoCallContract to below path:\n${configPath}\n`,
  );
  console.log(
    `VideoCallContract smart contract is deployed to address: ${videoCallContract.address}`,
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
