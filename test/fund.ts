import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import hre from "hardhat";
import assert from "node:assert/strict"
import { it } from "node:test";

const FundModule = buildModule("Fund", (m) => {
    const fund = m.contract("Fund", [100]);

    return { fund };
});

it("should have the lockTime 100", async function () {
    const connection = await hre.network.connect();
    const { fund } = await connection.ignition.deploy(FundModule);

    const lockTime = await fund.getLockTime();
    assert.equal(
        lockTime,
        "100"
    );
});
