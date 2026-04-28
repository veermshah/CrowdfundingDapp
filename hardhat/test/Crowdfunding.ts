import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { getAddress, parseEther } from "viem";

describe("Crowdfunding", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const walletClients = await viem.getWalletClients();
  const creator = walletClients[0];
  const contributor1 = walletClients[1];
  const contributor2 = walletClients[2];

  async function deploy() {
    return viem.deployContract("Crowdfunding");
  }

  async function deployWithCampaign(durationDays = 30n) {
    const cf = await deploy();
    await cf.write.createCampaign([
      "Solar Rooftops",
      "Community solar initiative",
      "Environment",
      parseEther("10"),
      durationDays,
    ]);
    return cf;
  }

  async function advanceTime(seconds: number) {
    await publicClient.transport.request({ method: "evm_increaseTime", params: [seconds] });
    await publicClient.transport.request({ method: "evm_mine", params: [] });
  }

  it("campaignCount starts at 0", async function () {
    const cf = await deploy();
    assert.equal(await cf.read.campaignCount(), 0n);
  });

  it("createCampaign increments count and stores data", async function () {
    const cf = await deploy();
    const blockNumber = await publicClient.getBlockNumber();

    await cf.write.createCampaign([
      "Solar Rooftops",
      "Community solar",
      "Environment",
      parseEther("10"),
      30n,
    ]);

    assert.equal(await cf.read.campaignCount(), 1n);

    const campaign = await cf.read.getCampaign([0n]);
    assert.equal(campaign.title, "Solar Rooftops");
    assert.equal(campaign.goalAmount, parseEther("10"));
    assert.equal(campaign.raised, 0n);
    assert.equal(campaign.backerCount, 0n);
    assert.equal(campaign.withdrawn, false);
    assert.equal(getAddress(campaign.creator), getAddress(creator.account.address));

    // Verify CampaignCreated event was emitted
    const events = await publicClient.getContractEvents({
      address: cf.address,
      abi: cf.abi,
      eventName: "CampaignCreated",
      fromBlock: blockNumber,
      strict: true,
    });
    assert.equal(events.length, 1);
    assert.equal(events[0].args.id, 0n);
    assert.equal(events[0].args.title, "Solar Rooftops");
  });

  it("contribute increases raised and backerCount", async function () {
    const cf = await deployWithCampaign();
    const blockNumber = await publicClient.getBlockNumber();

    const cfContrib = await viem.getContractAt("Crowdfunding", cf.address, {
      client: { wallet: contributor1 },
    });
    await cfContrib.write.contribute([0n], { value: parseEther("1") });

    const campaign = await cf.read.getCampaign([0n]);
    assert.equal(campaign.raised, parseEther("1"));
    assert.equal(campaign.backerCount, 1n);

    const stored = await cf.read.getContribution([0n, contributor1.account.address]);
    assert.equal(stored, parseEther("1"));

    // Verify Contributed event
    const events = await publicClient.getContractEvents({
      address: cf.address,
      abi: cf.abi,
      eventName: "Contributed",
      fromBlock: blockNumber,
      strict: true,
    });
    assert.equal(events.length, 1);
    assert.equal(events[0].args.amount, parseEther("1"));
  });

  it("second contribution from same address does not increase backerCount again", async function () {
    const cf = await deployWithCampaign();
    const cfContrib = await viem.getContractAt("Crowdfunding", cf.address, {
      client: { wallet: contributor1 },
    });

    await cfContrib.write.contribute([0n], { value: parseEther("1") });
    await cfContrib.write.contribute([0n], { value: parseEther("0.5") });

    const campaign = await cf.read.getCampaign([0n]);
    assert.equal(campaign.backerCount, 1n);
    assert.equal(campaign.raised, parseEther("1.5"));
  });

  it("contribute after deadline reverts", async function () {
    const cf = await deployWithCampaign(1n);
    await advanceTime(2 * 24 * 60 * 60); // 2 days past 1-day deadline

    const cfContrib = await viem.getContractAt("Crowdfunding", cf.address, {
      client: { wallet: contributor1 },
    });

    await assert.rejects(
      cfContrib.write.contribute([0n], { value: parseEther("1") }),
      /Campaign has ended/,
    );
  });

  it("withdrawFunds transfers ETH to creator when goal is met", async function () {
    const cf = await deployWithCampaign();
    const blockNumber = await publicClient.getBlockNumber();

    const cfContrib = await viem.getContractAt("Crowdfunding", cf.address, {
      client: { wallet: contributor1 },
    });
    await cfContrib.write.contribute([0n], { value: parseEther("10") });

    const balanceBefore = await publicClient.getBalance({ address: creator.account.address });
    await cf.write.withdrawFunds([0n]);
    const balanceAfter = await publicClient.getBalance({ address: creator.account.address });

    assert.ok(balanceAfter > balanceBefore, "Creator balance should increase");

    const campaign = await cf.read.getCampaign([0n]);
    assert.equal(campaign.withdrawn, true);

    // Verify FundsWithdrawn event
    const events = await publicClient.getContractEvents({
      address: cf.address,
      abi: cf.abi,
      eventName: "FundsWithdrawn",
      fromBlock: blockNumber,
      strict: true,
    });
    assert.equal(events.length, 1);
    assert.equal(events[0].args.amount, parseEther("10"));
  });

  it("withdrawFunds reverts when goal not reached", async function () {
    const cf = await deployWithCampaign();
    const cfContrib = await viem.getContractAt("Crowdfunding", cf.address, {
      client: { wallet: contributor1 },
    });
    await cfContrib.write.contribute([0n], { value: parseEther("1") });

    await assert.rejects(
      cf.write.withdrawFunds([0n]),
      /Goal not reached/,
    );
  });

  it("withdrawFunds reverts when called by non-creator", async function () {
    const cf = await deployWithCampaign();
    const cfContrib = await viem.getContractAt("Crowdfunding", cf.address, {
      client: { wallet: contributor1 },
    });
    await cfContrib.write.contribute([0n], { value: parseEther("10") });

    await assert.rejects(
      cfContrib.write.withdrawFunds([0n]),
      /Only creator can withdraw/,
    );
  });

  it("withdrawFunds reverts on second call after successful withdrawal", async function () {
    const cf = await deployWithCampaign();
    const cfContrib = await viem.getContractAt("Crowdfunding", cf.address, {
      client: { wallet: contributor1 },
    });
    await cfContrib.write.contribute([0n], { value: parseEther("10") });
    await cf.write.withdrawFunds([0n]);

    await assert.rejects(
      cf.write.withdrawFunds([0n]),
      /Already withdrawn/,
    );
  });

  it("refund returns ETH when deadline passed and goal not met", async function () {
    const cf = await deployWithCampaign(1n);
    const blockNumber = await publicClient.getBlockNumber();

    const cfContrib = await viem.getContractAt("Crowdfunding", cf.address, {
      client: { wallet: contributor1 },
    });
    await cfContrib.write.contribute([0n], { value: parseEther("1") });

    await advanceTime(2 * 24 * 60 * 60);

    const balanceBefore = await publicClient.getBalance({ address: contributor1.account.address });
    await cfContrib.write.refund([0n]);
    const balanceAfter = await publicClient.getBalance({ address: contributor1.account.address });

    assert.ok(balanceAfter > balanceBefore, "Contributor balance should increase after refund");

    const stored = await cf.read.getContribution([0n, contributor1.account.address]);
    assert.equal(stored, 0n);

    // Verify Refunded event
    const events = await publicClient.getContractEvents({
      address: cf.address,
      abi: cf.abi,
      eventName: "Refunded",
      fromBlock: blockNumber,
      strict: true,
    });
    assert.equal(events.length, 1);
    assert.equal(events[0].args.amount, parseEther("1"));
  });

  it("refund reverts when goal was met", async function () {
    const cf = await deployWithCampaign(1n);
    const cfContrib = await viem.getContractAt("Crowdfunding", cf.address, {
      client: { wallet: contributor1 },
    });
    await cfContrib.write.contribute([0n], { value: parseEther("10") });

    await advanceTime(2 * 24 * 60 * 60);

    await assert.rejects(
      cfContrib.write.refund([0n]),
      /Goal was reached, no refund/,
    );
  });

  it("refund reverts when contributor has no contribution", async function () {
    const cf = await deployWithCampaign(1n);
    await advanceTime(2 * 24 * 60 * 60);

    const cfContrib2 = await viem.getContractAt("Crowdfunding", cf.address, {
      client: { wallet: contributor2 },
    });

    await assert.rejects(
      cfContrib2.write.refund([0n]),
      /No contribution to refund/,
    );
  });

  it("refund reverts when campaign is still active", async function () {
    const cf = await deployWithCampaign(30n);
    const cfContrib = await viem.getContractAt("Crowdfunding", cf.address, {
      client: { wallet: contributor1 },
    });
    await cfContrib.write.contribute([0n], { value: parseEther("1") });

    await assert.rejects(
      cfContrib.write.refund([0n]),
      /Campaign still active/,
    );
  });
});
