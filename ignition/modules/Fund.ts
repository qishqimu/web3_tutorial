import idc from "../ignition-deploy-config.js"
import { network } from "hardhat"
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import MockV3AggregatorModule from "./mocks/MockV3Aggregator.js"

const { ethers, networkName, ignition } = await network.connect()
const [owner, account1, account2] = await ethers.getSigners();

export const FundModule = buildModule("Fund", (m) => {
    let _priceFeed;
    // devlomentChains
    if (idc.developmentChains.includes(networkName)) {
        // use MockV3AggregatorModule
        const { mockV3Aggregator } = m.useModule(MockV3AggregatorModule);
        _priceFeed = mockV3Aggregator;
    }
    else {
        _priceFeed = (idc.networkConfig as Record<string, { priceFeed: any }>)[networkName].priceFeed.ethUsd;

    }

    console.log(`\n--- Deploying Fund to ${networkName} ---`);
    const fund = m.contract("Fund", [300n, _priceFeed]);

    return { fund };
});

export default FundModule;

