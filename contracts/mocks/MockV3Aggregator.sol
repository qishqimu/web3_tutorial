// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MockV3Aggregator {
    uint8 private _decimals;
    int256 private _answer;

    constructor(uint8 decimals_, int256 initialAnswer) {
        _decimals = decimals_;
        _answer = initialAnswer;
    }

    function decimals() external view returns (uint8) {
        return _decimals;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (0, _answer, 0, block.timestamp, 0);
    }

    function latestAnswer() external view returns (int256) {
        return _answer;
    }

    function updateAnswer(int256 newAnswer) external {
        _answer = newAnswer;
    }
}
