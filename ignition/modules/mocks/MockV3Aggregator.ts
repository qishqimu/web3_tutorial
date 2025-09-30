import { network } from "hardhat"
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { mockV3AggregatorArgs } from "../../ignition-deploy-config.js"

const { networkName, ethers } = await network.connect();

const MockV3AggregatorModule = buildModule("MockV3Aggregator", (m) => {
    console.log(`\n--- Deploying MockV3Aggregator to ${networkName} ---`);
    const initialAnswer = m.getParameter("initialAnswer", mockV3AggregatorArgs.initialAnswer);
    const decimals = m.getParameter("decimals", mockV3AggregatorArgs.decimals);

    const mockV3Aggregator = m.contract("MockV3Aggregator", [decimals, initialAnswer]);

    return { mockV3Aggregator };
});

export default MockV3AggregatorModule;





// import { network } from "hardhat"
// import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// const { networkName, ethers } = await network.connect();

// export const MockV3AggregatorModule = buildModule("MockV3Aggregator", (m) => {
//     console.log(`\n--- Deploying Fund to ${networkName} ---`);
//     const mockV3Aggregator = m.contract("MockV3Aggregator", [8n, 4012 * 1e8]);

//     return { mockV3Aggregator };
// });

// export default MockV3AggregatorModule;