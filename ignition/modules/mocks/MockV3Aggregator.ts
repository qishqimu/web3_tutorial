import { network } from "hardhat"
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { mockV3AggregatorArgs } from "../../configs/mocks/mocV3AggregatorConfig.js"

const { networkName, ethers } = await network.connect();

const MockV3Aggregator = buildModule("MockV3AggregatorModule", (m) => {
    console.log(`--- Deploying MockV3Aggregator to ${networkName} ---`);
    const initialAnswer = m.getParameter("initialAnswer", mockV3AggregatorArgs.initialAnswer);
    const decimals = m.getParameter("decimals", mockV3AggregatorArgs.decimals);

    const mockV3Aggregator = m.contract("MockV3Aggregator", [decimals, initialAnswer]);

    return { mockV3Aggregator };
});

export default MockV3Aggregator;
