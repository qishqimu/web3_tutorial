export const mockV3AggregatorArgs =
{
    decimals: 8n,
    initialAnswer: 4025 * 1e8
}
export const developmentChains = ["default", "hardhat", "localhost"]
export const networkConfig = {
    sepolia: {
        priceFeed: {
            ethUsd: "0x694AA1769357215DE4FAC081bf1f309aDC325306"
        }
    }
}

export default {
    developmentChains,
    networkConfig
}