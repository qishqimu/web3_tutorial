// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract Fund is Ownable {
    mapping(address => uint) public funds; // user address => amount funded

    uint public constant MINIMUM = 1 * 10 ** 18; // 1 usd
    uint public constant TARGET = 10 * 10 ** 18; // 5 usd

    uint public deployTime; // timestamp of contract deployment
    uint public locktime; // time after which funds can be withdrawn

    address public tokenAddress;
    bool public isCompleted = false; // the project is currently underway

    AggregatorV3Interface public priceFeed;

    constructor(uint locktime_, address priceFeed_) Ownable(_msgSender()) {
        locktime = locktime_;
        deployTime = block.timestamp;

        // chainlink price feed
        priceFeed = AggregatorV3Interface(priceFeed_);
    }

    //  returns the lock time
    function getLockTime() public view returns (uint) {
        return locktime;
    }

    // allows the owner to set the token address
    function setTokenAddress(address tokenAddress_) external onlyOwner {
        tokenAddress = tokenAddress_;
    }

    // returns the amount funded by a specific address
    function getFunds(address funder_) external view returns (uint) {
        return funds[funder_];
    }

    // reSet funds by the erc20 contract
    function reSetFunds(address funder_) external {
        require(_msgSender() == tokenAddress, "Only the ERC20 Token addrsss.");
        funds[funder_] = 0;
    }

    // returns true if the funding period is over
    function isPeriodOver() external view returns (bool) {
        return block.timestamp >= deployTime + locktime;
    }

    // returns true if the funding target is reached
    function isTargetReached() external view returns (bool) {
        return _amountInUsd(address(this).balance) >= TARGET;
    }

    // for testing purposes only: allows setting the deploy time
    function setDeployTime() external {
        deployTime = block.timestamp;
    }

    // allows users to fund the contract
    function fund() external payable returns (bool) {
        require(block.timestamp < deployTime + locktime, "Funding period over");
        require(_amountInUsd(msg.value) >= MINIMUM, "Minimum funding not met");
        funds[_msgSender()] += msg.value;
        return true;
    }

    // allows the owner to withdraw funds if the target is reached
    function withdraw() external onlyOwner returns (bool) {
        require(block.timestamp >= deployTime + locktime, "Funds are locked");
        require(
            _amountInUsd(address(this).balance) >= TARGET,
            "Target not reached"
        );
        address _owner = _msgSender();
        (bool _success, ) = payable(_owner).call{value: address(this).balance}(
            ""
        );
        require(_success, "Failed to withdraw Ether");
        // reset the funds mapping
        funds[_owner] = 0;

        // the project is completed
        isCompleted = true;

        return true;
    }

    // allows users to refund their funds if the target is not reached
    function refund() external returns (bool) {
        require(block.timestamp >= deployTime + locktime, "Funds are locked");
        require(
            _amountInUsd(address(this).balance) < TARGET,
            "Target was reached"
        );
        address _msgSender = _msgSender();
        uint _amount = funds[_msgSender];
        require(_amount > 0, "No funds to refund");
        // reset the user's funded amount
        funds[_msgSender] = 0;

        (bool _success, ) = payable(_msgSender).call{value: _amount}("");
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

    // amouont in usd
    function _amountInUsd(uint amount_) internal view returns (uint) {
        return (uint(getPrice()) * amount_) / (10 ** priceFeed.decimals());
    }

    // returns the number of decimals of the price feed
    function getPriceFeedDecimals() external view returns (uint8) {
        return priceFeed.decimals();
    }
}
