const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
  
  // Deploy the contract
  const crowdFunding = await CrowdFunding.deploy();
  
  // Wait for deployment to complete
  await crowdFunding.waitForDeployment();

  // Get the deployed contract address
  const address = await crowdFunding.getAddress();
  console.log("CrowdFunding deployed to:", address);
  // address: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });