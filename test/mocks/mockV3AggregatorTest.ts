import { network } from "hardhat";
import MockV3AggregatorModule from "../../ignition/modules/mocks/MockV3Aggregator.js"
import assert from "node:assert";

const { networkName, ethers, ignition } = await network.connect();

// get mockV3Aggregator contract
const { mockV3Aggregator } = await ignition.deploy(MockV3AggregatorModule)

it("should decimals 8n", async function () {

    const _decimals = await mockV3Aggregator.decimals();
    assert.equal(_decimals, 8n);

});

it("should answer 4025_0000_0000n", async function () {

    const [, _answet] = await mockV3Aggregator.latestRoundData();
    assert.equal(_answet, 4025_0000_0000n);

})