import { network } from "hardhat";
import fundModule from "../ignition/modules/Fund.js";
import { Contract } from "ethers";

// connect network and get signers
const { networkName, ethers, ignition } = await network.connect();
const signers = await ethers.getSigners();

async function main() {

    // set needRedeploy true if the fund period is over if necessary
    const needRedeploy: boolean = false;

    console.log(`Interacting with fund contract on ${networkName} network`);

    // Deploy the Fund contract using the FundModule
    const { fund } = await ignition.deploy(fundModule);
    // const fundAddress = await fund.getAddress();
    console.log(`Fund deployed to: ${await fund.getAddress()}`);
    let balance = await ethers.provider.getBalance(fund);
    console.log(`Fund contract balance before funding: ${balance} wei`);

    // Check if the funding period is over and reset deploy time if necessary
    const isPeriodOver: boolean = await fund.isPeriodOver();
    console.log(`Is funding period over? ${isPeriodOver}`);

    if (!isPeriodOver) {
        // Interact with the contract if the funding period is not over
        await Interact(fund);
    }
    else {
        // reset the deploy time if the funding period is over and redeploy is needed
        if (needRedeploy) {
            console.log("Funding period was over, reset deploy time to current time.");
            const setPeriodTx = await fund.setDeployTime();
            await setPeriodTx.wait(2);

            // Interact with the contract after resetting the deploy time
            await Interact(fund);
        }
        else {
            const isTargetReached = await fund.isTargetReached();
            console.log(`Is funding target reached? ${isTargetReached}`);
            if (!isTargetReached) {
                console.log("Funding target not reached, funders can refund their funds.");
                // refund 
                for (const account of signers) {
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
                console.log("Funding target reached, the owner can withdraw the funds.");
                // withdraw the funds from the contract if the target is reached
                const withdramTx = await fund.withdraw();
                await withdramTx.wait();
            }
        }
    }

    // Final balance check
    balance = await ethers.provider.getBalance(fund);
    console.log(`Fund contract balance after withdram: ${balance} wei`);

    console.log("Script execution completed.");


}

main().catch(console.error);


async function Interact(fund: Contract) {
    // init 3 accounts
    const [owner, account1, account2] = signers;
    // firstAccount funding
    console.log(`fund 0.02 ether to the contract from ${account1.address}`);
    const firstAccountFundTx = await fund.connect(account1).fund({ value: ethers.parseEther("0.02") });
    await firstAccountFundTx.wait(2);
    let balance = await ethers.provider.getBalance(fund);
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
    balance = await ethers.provider.getBalance(fund);
    console.log(`Fund contract balance after second funding: ${balance} wei`);
    // get the funds of secondAccount from the contract
    console.log("get the funds of secondAccount from the contract");
    const fundsSecondAccouont = await fund.getFunds(account2.address);
    console.log(`The funds of secondAccount is : ${fundsSecondAccouont}`);
}
