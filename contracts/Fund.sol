// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract Fund {
    mapping(address => uint) public funds; // user address => amount funded

    uint public constant MINIMUM = 1 * 10 ** 18; // 1 usd
    uint public constant TARGET = 2 * 10 ** 18; // 2 usd

    uint public deployTime; // timestamp of contract deployment
    uint public locktime; // time after which funds can be withdrawn

    address public owner;

    AggregatorV3Interface internal priceFeed;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor(uint locktime_) {
        locktime = locktime_;
        deployTime = block.timestamp;

        owner = msg.sender;
        funds[owner] = 0;

        // sepolia ETH/USD price feed
        priceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
    }

    //  returns the lock time
    function getLockTime() public view returns (uint) {
        return locktime;
    }

    // returns the amount funded by a specific address
    function getFunds(address funder_) external view returns (uint) {
        return funds[funder_];
    }

    // returns true if the funding period is over
    function isPeriodOver() external view returns (bool) {
        return block.timestamp >= deployTime + locktime;
    }

    // returns true if the funding target is reached
    function isTargetReached() external view returns (bool) {
        return address(this).balance >= TARGET;
    }

    // for testing purposes only: allows setting the deploy time
    function setDeployTime() external {
        deployTime = block.timestamp;
    }

    // allows users to fund the contract
    function fund() external payable returns (bool) {
        require(block.timestamp < deployTime + locktime, "Funding period over");
        uint _amountInUsd = (uint(getPrice()) * msg.value) /
            (10 ** priceFeed.decimals());
        require(_amountInUsd >= MINIMUM, "Minimum funding not met");
        funds[msg.sender] += msg.value;
        return true;
    }

    // allows the owner to withdraw funds if the target is reached
    function withdraw() external onlyOwner returns (bool) {
        require(block.timestamp >= deployTime + locktime, "Funds are locked");
        require(address(this).balance >= TARGET, "Target not reached");

        (bool _success, ) = payable(owner).call{value: address(this).balance}(
            ""
        );
        require(_success, "Failed to withdraw Ether");
        // reset the funds mapping
        funds[owner] = 0;

        return true;
    }

    // allows users to refund their funds if the target is not reached
    function refund() external returns (bool) {
        require(block.timestamp >= deployTime + locktime, "Funds are locked");
        require(address(this).balance < TARGET, "Target was reached");

        uint _amount = funds[msg.sender];
        require(_amount > 0, "No funds to refund");
        // reset the user's funded amount
        funds[msg.sender] = 0;

        (bool _success, ) = payable(msg.sender).call{value: _amount}("");
        require(_success, "Failed to refund Ether");

        return true;
    }

    // returns the latest price
    function getPrice() public view returns (int) {
        (, int _price, , , ) = priceFeed.latestRoundData();
        return _price; // price is in 8 decimal places
    }

    // returns the conversion rate from wei to usd
    function getConversionRate(uint weiAmount_) external view returns (uint) {
        int _price = getPrice();
        uint _ethAmountInUsd = (uint(_price) * weiAmount_) /
            (10 ** priceFeed.decimals());
        return _ethAmountInUsd;
    }

    // returns the number of decimals of the price feed
    function getPriceFeedDecimals() external view returns (uint8) {
        return priceFeed.decimals();
    }

    // transfer ownership to a new address
    function transferOwnership(address newOwner_) external onlyOwner {
        require(newOwner_ != address(0), "Invalid address");
        owner = newOwner_;
    }
}
