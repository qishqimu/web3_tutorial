import { network } from "hardhat"
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import MockV3Aggregator from "./mocks/MockV3Aggregator.js"
import { customConfig, chainlinkDataFeed } from '../configs/common.js'
import { fundArgs } from "../configs/fundConfig.js";

const { ethers, networkName, ignition } = await network.connect()
const [owner, account1, account2] = await ethers.getSigners();

export const Fund = buildModule("FundModule", (m) => {
    let _priceFeed;
    // devlomentChains
    if (customConfig.developmentChains.includes(networkName)) {
        // use MockV3AggregatorModule
        const { mockV3Aggregator } = m.useModule(MockV3Aggregator);
        _priceFeed = mockV3Aggregator;
    }
    else {
        _priceFeed = (chainlinkDataFeed as Record<string, { dateFeed: any }>)[networkName].dateFeed.ethUsd;
    }

    console.log(`--- Deploying Fund to ${networkName} ---`);
    const fund = m.contract("Fund", [fundArgs.locktime, _priceFeed]);

    return { fund };
});

export default Fund;

