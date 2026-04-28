import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CrowdfundingModuleV2", (m) => {
  const crowdfunding = m.contract("Crowdfunding");
  return { crowdfunding };
});
