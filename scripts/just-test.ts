
import { open } from "fs";
import { network } from "hardhat"
import FundModule from "../ignition/modules/Fund.js";

const { ethers, ignition } = await network.connect();
const [owner, account1] = await ethers.getSigners();

const { fund } = await ignition.deploy(FundModule)
const balance = await ethers.provider.getBalance(fund);
console.log(`Balance of contract ${await fund.getAddress()} is ${balance}`)

// get mininum
const mininum = await fund.MINIMUM();
console.log(`mininum is ${mininum}`)