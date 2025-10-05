import type { HardhatUserConfig } from "hardhat/config";

import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable } from "hardhat/config";
import * as envEnc from "@chainlink/env-enc";
envEnc.config();

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
    npmFilesToBuild: [
      "@chainlink/contracts/src/v0.8/shared/mocks/MockV3Aggregator.sol",
      "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol",
      "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol",
    ],
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("OWNER"), configVariable("FIRST_ACCOUNT"), configVariable("SECOND_ACCOUNT")],
      chainId: 11155111,
    },
    localhost: {
      type: "http",
      chainType: "l1",
      url: configVariable("LOCALHOST_RPC_URL"),
      // accounts: [configVariable("OWNER"), configVariable("FIRST_ACCOUNT"), configVariable("SECOND_ACCOUNT")],
      chainId: 31337,
    },
  },
  verify: {
    etherscan: {
      // Your API key for Etherscan
      // Obtain one at https://etherscan.io/
      apiKey: configVariable("ETHERSCAN_API_KEY"),
    },
  },
}

export default config;
