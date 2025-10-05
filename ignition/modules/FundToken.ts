import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import FundModule from "./Fund.js";

export const fundTokenModule = buildModule("FundTokenModule", (m) => {
    const { fund } = m.useModule(FundModule);
    const fundToken = m.contract("FundToken", [fund]);

    return { fundToken }
})

export default fundTokenModule;