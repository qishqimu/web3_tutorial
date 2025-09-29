import { network } from "hardhat"
import assert from "node:assert/strict"
import { it } from "node:test";
import FundModule from "../ignition/modules/Fund.js";

const { networkName, ethers, ignition } = await network.connect();

const [owner, account1, account2] = await ethers.getSigners();
// get fund contract
const { fund } = await ignition.deploy(FundModule);

it("test if the owner is the msg.sender", async function () {

    const _owner = await fund.owner();
    assert.equal(owner.address, _owner);

});

it("should have the lockTime 300n", async function () {

    const lockTime = await fund.getLockTime();
    assert.equal(
        lockTime,
        300n
    );
});

it("test if the priceFeed is assigned correctly", async function () {
    const _priceFeed = await fund.priceFeed();
    assert.equal(_priceFeed, "0x694AA1769357215DE4FAC081bf1f309aDC325306");
})
