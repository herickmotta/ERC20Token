import { ethers } from "hardhat";

async function main() {
  const ERC20Token = await ethers.getContractFactory("ERC20Token");
  const erc20Token = await ERC20Token.deploy("Heya", "Heya", ethers.parseEther('1'));
  await erc20Token.waitForDeployment();
  console.log("ERC20Token deployed to:", await erc20Token.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
