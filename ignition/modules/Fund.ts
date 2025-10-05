import { network } from "hardhat"
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import mockV3AggregatorModule from "./mocks/MockV3Aggregator.js"
import { customConfig, chainlinkDataFeed } from '../configs/common.js'
import { fundArgs } from "../configs/fundConfig.js";

const { ethers, networkName, ignition } = await network.connect()
const [owner, account1, account2] = await ethers.getSigners();

export const fundModule = buildModule("FundModule", (m) => {
    const _priceFeedParam = customConfig.developmentChains.includes(networkName)
        ? m.useModule(mockV3AggregatorModule).mockV3Aggregator
        : (chainlinkDataFeed as Record<string, { dateFeed: any }>)[networkName].dateFeed.ethUsd;

    console.log(`--- Deploying Fund to ${networkName} ---`);
    const fund = m.contract("Fund", [fundArgs.locktime, _priceFeedParam]);

    return { fund };
});

export default fundModule;

