// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Fund} from "./Fund.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FundToken is ERC20, Ownable {
    Fund public fund;

    constructor(address fund_) ERC20("Fund Token", "FND") Ownable(msg.sender) {
        fund = Fund(fund_);
    }

    function climb() external {}

    function mint(address to) external {
        address _funder = _msgSender();
        uint _amount = fund.getFunds(_funder);
        require(fund.isCompleted(), "the Fund project is currently underway.");
        require(_amount > 0, "No funds to mint tokens");
        fund.reSetFunds(_funder);
        _mint(to, _amount * 1000);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}
