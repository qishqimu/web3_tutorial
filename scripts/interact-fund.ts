import { network } from "hardhat";
import FundModule from "../ignition/modules/Fund.js";
import path from "path";

const { networkName, ethers, ignition } = await network.connect();
// init 3 accounts
const [owner, account1, account2] = await ethers.getSigners();

console.log(`Interacting with fund contract on ${networkName} network`);
// Deploy the Fund contract using the FundModule
const { fund } = await ignition.deploy(FundModule);
const fundAddress = await fund.getAddress();
console.log(`Fund deployed to: ${fundAddress}`);
let balance = await ethers.provider.getBalance(fundAddress);
console.log(`Fund contract balance before funding: ${balance} wei`);
const needRedeploy: boolean = false;

async function Interact() {
    // firstAccount funding
    console.log(`fund 0.02 ether to the contract from ${account1.address}`);
    const firstAccountFundTx = await fund.fund({ value: ethers.parseEther("0.02") });
    await firstAccountFundTx.wait(2);
    balance = await ethers.provider.getBalance(fundAddress);
    console.log(`Fund contract balance after funding: ${balance} wei`);
    // get the funds of firstAccount from the contract
    console.log("get the funds of firstAccount from the contract");
    const fundsFirstAccouont = await fund.getFunds(account1.address);
    console.log(`The funds of firstAccount is : ${fundsFirstAccouont}`);

    // secondAccount funding
    console.log(`fund 0.01 ether to the contract from the second account ${account2.address}`);
    const secondAccountFundTx = await fund.connect(account2).fund({
        value: ethers.parseEther("0.01")
    });
    await secondAccountFundTx.wait(2);
    balance = await ethers.provider.getBalance(fundAddress);
    console.log(`Fund contract balance after second funding: ${balance} wei`);
    // get the funds of secondAccount from the contract
    console.log("get the funds of secondAccount from the contract");
    const fundsSecondAccouont = await fund.getFunds(account2.address);
    console.log(`The funds of secondAccount is : ${fundsSecondAccouont}`);
}

// Check if the funding period is over and reset deploy time if necessary
const isPeriodOver: boolean = await fund.isPeriodOver();
console.log(`Is funding period over? ${isPeriodOver}`);

if (!isPeriodOver) {
    // Interact with the contract if the funding period is not over
    await Interact();
}
else {
    // reset the deploy time if the funding period is over and redeploy is needed
    if (needRedeploy) {
        const setPeriodTx = await fund.setDeployTime();
        await setPeriodTx.wait();
        console.log("Funding period was over, reset deploy time to current time.");

        // Interact with the contract after resetting the deploy time
        await Interact();
    }
    else {
        const isTargetReached = await fund.isTargetReached();
        console.log(`Is funding target reached? ${isTargetReached}`);
        if (!isTargetReached) {
            console.log("Funding target not reached, funders can refund their funds.");
            for (const account of [owner, account1, account2]) {
                const funds = await fund.getFunds(account.address);
                if (funds > 0) {
                    console.log(`Refunding funds for account: ${account.address}`);
                    const refundTx = await fund.connect(account).refund();
                    await refundTx.wait();
                    console.log(`Refunded ${funds} wei to account: ${account.address}`);
                } else {
                    console.log(`No funds to refund for account: ${account.address}`);
                }
            }
        }
        else {
            console.log("Funding target reached, owner can withdraw the funds.");
            // withdraw the funds from the contract if the target is reached
            const withdramTx = await fund.withdraw();
            await withdramTx.wait();
        }
    }
}

// Final balance check
balance = await ethers.provider.getBalance(fundAddress);
console.log(`Fund contract balance after withdram: ${balance} wei`);

console.log("Script execution completed.");
