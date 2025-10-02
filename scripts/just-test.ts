// scripts/test-custom.ts
import hre from "hardhat";

async function main() {
    console.log("Custom config via hre:", hre.config.custom);
    console.log("Development chains:", hre.config.custom?.developmentChains);
}

main().catch(console.error);