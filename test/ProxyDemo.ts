import hre from "hardhat";

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import DemoModule from "../ignition/modules/Demo.js";
import UpgradeModule from "../ignition/modules/UpgradeModule.js";
import { ethers } from "ethers";

describe("Demo Proxy", async function () {
    const { ethers, ignition } = await hre.network.connect();

    // describe("Proxy interaction", function () {
    //     it("Should be interactable via proxy", async function () {
    //         const [, otherAccount] = await ethers.getSigners();

    //         const { demo } = await ignition.deploy(DemoModule);

    //         assert.equal(
    //             await demo.version({ account: otherAccount.getAddress() }),
    //             "1.0.0"
    //         );
    //     });
    // });

    describe("Upgrading", function () {
        it("Should have upgraded the proxy to DemoV2", async function () {
            const [, otherAccount] = await ethers.getSigners();

            const { demo } = await ignition.deploy(UpgradeModule);

            assert.equal(
                await demo.version({ account: otherAccount.getAddress() }),
                "2.0.0"
            );
        });

        it("Should have set the name during upgrade", async function () {
            const [, otherAccount] = await ethers.getSigners();

            const { demo } = await ignition.deploy(UpgradeModule);

            assert.equal(
                await demo.name({ account: otherAccount.getAddress() }),
                "Example Name"
            );
        });
    });
});
