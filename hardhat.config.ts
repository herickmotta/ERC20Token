import dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();

if (!process.env.NODE_HTTP_URI || !process.env.PRIVATE_KEY) {
  throw new Error("Missing environment variables");
}

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.NODE_HTTP_URI,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};

export default config;
