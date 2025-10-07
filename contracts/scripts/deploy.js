const hre = require("hardhat");

async function main() {
  console.log("Deploying MemeRewards contract...");

  const MemeRewards = await hre.ethers.getContractFactory("MemeRewards");
  const memeRewards = await MemeRewards.deploy();

  await memeRewards.waitForDeployment();

  const address = await memeRewards.getAddress();
  console.log(`MemeRewards deployed to: ${address}`);

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    address: address,
    network: hre.network.name,
    deployer: (await hre.ethers.getSigners())[0].address,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    `./deployments/${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved to deployments folder");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
