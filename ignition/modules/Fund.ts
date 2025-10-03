import { network } from "hardhat"
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import MockV3AggregatorModule from "./mocks/MockV3Aggregator.js"
import { customConfig, chainlinkDataFeed } from '../configs/common.js'
import { fundArgs } from "../configs/fundConfig.js";

const { ethers, networkName, ignition } = await network.connect()
const [owner, account1, account2] = await ethers.getSigners();

export const FundModule = buildModule("Fund", (m) => {
    const _priceFeedParam = customConfig.developmentChains.includes(networkName)
        ? m.useModule(MockV3AggregatorModule).mockV3Aggregator
        : (chainlinkDataFeed as Record<string, { dateFeed: any }>)[networkName].dateFeed.ethUsd;

    console.log(`--- Deploying Fund to ${networkName} ---`);
    const fund = m.contract("Fund", [fundArgs.locktime, _priceFeedParam]);

    return { fund };
});

export default FundModule;

