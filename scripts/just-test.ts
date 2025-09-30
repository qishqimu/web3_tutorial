
import { open } from "fs";
import { network } from "hardhat"

const { ethers } = await network.connect();
const [owner, account1] = await ethers.getSigners();

const balance = await ethers.provider.getBalance("0x1658454770e9f46f73dFc63c6529588Fa49E5763")
const balanceOfOwner = await ethers.provider.getBalance(owner)
const balanceOfAccount1 = await ethers.provider.getBalance(account1)

console.log(`balance is ${balance}`)
console.log(`balanceOfOwner is ${balanceOfOwner}`)
console.log(`balanceOfAccount1 is ${balanceOfAccount1}`)

console.log(owner)
