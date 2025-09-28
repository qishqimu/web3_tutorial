import { network } from "hardhat"
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { configVariable } from "hardhat/config";
import { verifyContract } from "@nomicfoundation/hardhat-verify/verify";
import { it } from "node:test";
import assert from "node:assert/strict";

const { ethers, networkName, ignition } = await network.connect()
const [first, sencond] = await ethers.getSigners();

const FundModule = buildModule("Fund", (m) => {
    console.log(`\n--- Deploying Fund to ${networkName} ---`);
    const fund = m.contract("Fund", [300n]);

    return { fund };
});

export default FundModule;
