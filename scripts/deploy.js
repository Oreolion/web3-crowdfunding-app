import { ethers } from "hardhat";

async function main() {
  // Get the contract factory
  const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
  
  // Deploy the contract
  const crowdFunding = await CrowdFunding.deploy();
  
  // Wait for deployment to complete
  await crowdFunding.deploymentTransaction().wait();

  // Get the deployed contract address
  console.log("CrowdFunding deployed to:", crowdFunding.target);
  // Example address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
