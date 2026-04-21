// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Crowdfunding {
    struct Campaign {
        uint256 id;
        address payable creator;
        string title;
        string description;
        string category;
        uint256 goalAmount;
        uint256 deadline;
        uint256 raised;
        uint256 backerCount;
        bool withdrawn;
    }

    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;
    // campaignId => contributor => amount contributed
    mapping(uint256 => mapping(address => uint256)) public contributions;

    event CampaignCreated(
        uint256 indexed id,
        address indexed creator,
        string title,
        uint256 goalAmount,
        uint256 deadline
    );
    event Contributed(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount
    );
    event FundsWithdrawn(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 amount
    );
    event Refunded(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount
    );

    function createCampaign(
        string calldata title,
        string calldata description,
        string calldata category,
        uint256 goalAmount,
        uint256 durationSeconds
    ) external returns (uint256) {
        require(goalAmount > 0, "Goal must be greater than zero");
        require(durationSeconds > 0, "Duration must be greater than zero");
        require(bytes(title).length > 0, "Title cannot be empty");

        uint256 id = campaignCount++;
        uint256 deadline = block.timestamp + durationSeconds;

        campaigns[id] = Campaign({
            id: id,
            creator: payable(msg.sender),
            title: title,
            description: description,
            category: category,
            goalAmount: goalAmount,
            deadline: deadline,
            raised: 0,
            backerCount: 0,
            withdrawn: false
        });

        emit CampaignCreated(id, msg.sender, title, goalAmount, deadline);
        return id;
    }

    function contribute(uint256 campaignId) external payable {
        require(campaignId < campaignCount, "Campaign does not exist");
        Campaign storage campaign = campaigns[campaignId];
        require(block.timestamp < campaign.deadline, "Campaign has ended");
        require(msg.value > 0, "Contribution must be greater than zero");

        if (contributions[campaignId][msg.sender] == 0) {
            campaign.backerCount++;
        }
        contributions[campaignId][msg.sender] += msg.value;
        campaign.raised += msg.value;

        emit Contributed(campaignId, msg.sender, msg.value);
    }

    // Creator withdraws funds once goal is met (deadline does not need to have passed)
    function withdrawFunds(uint256 campaignId) external {
        require(campaignId < campaignCount, "Campaign does not exist");
        Campaign storage campaign = campaigns[campaignId];
        require(msg.sender == campaign.creator, "Only creator can withdraw");
        require(campaign.raised >= campaign.goalAmount, "Goal not reached");
        require(!campaign.withdrawn, "Already withdrawn");

        campaign.withdrawn = true;
        uint256 amount = campaign.raised;
        campaign.creator.transfer(amount);

        emit FundsWithdrawn(campaignId, msg.sender, amount);
    }

    // Contributors can reclaim ETH if the deadline passed and the goal was not met
    function refund(uint256 campaignId) external {
        require(campaignId < campaignCount, "Campaign does not exist");
        Campaign storage campaign = campaigns[campaignId];
        require(block.timestamp >= campaign.deadline, "Campaign still active");
        require(campaign.raised < campaign.goalAmount, "Goal was reached, no refund");

        uint256 amount = contributions[campaignId][msg.sender];
        require(amount > 0, "No contribution to refund");

        contributions[campaignId][msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit Refunded(campaignId, msg.sender, amount);
    }

    function getCampaign(uint256 id) external view returns (Campaign memory) {
        require(id < campaignCount, "Campaign does not exist");
        return campaigns[id];
    }

    function getContribution(uint256 campaignId, address contributor) external view returns (uint256) {
        return contributions[campaignId][contributor];
    }
}
