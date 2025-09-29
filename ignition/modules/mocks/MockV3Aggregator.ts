import { network } from "hardhat"
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const { networkName, ethers } = await network.connect();

const MockV3AggregatorModule = buildModule("MockV3AggregatorModule", (m) => {
    console.log(`\n--- Deploying MockV3AggregatorModule to ${networkName} ---`);
    const initialAnswer = m.getParameter("initialAnswer", 4025 * 10 ** 8);
    const decimals = m.getParameter("decimals", 8);

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