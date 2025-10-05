import { network } from 'hardhat'
import fundTokenModule from '../ignition/modules/FundToken.js'

// connect network
const { ethers, ignition } = await network.connect();

// get fundToken contract instance
const { fundToken } = await ignition.deploy(fundTokenModule);

const fundAddress = await fundToken.fund();

console.log(`fund address is ${fundAddress}`)

const functionOwner = fundToken.getFunction("owner");
const owner = await functionOwner();

console.log(`owner is ${owner}`)