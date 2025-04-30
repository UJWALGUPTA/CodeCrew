// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./RewardPoolManager.sol";

/**
 * @title BountyContract
 * @dev Manages bounties for GitHub issues
 */
contract BountyContract {
    // Enum for bounty status
    enum BountyStatus { None, Created, Claimed, Completed, Canceled }
    
    // Bounty structure
    struct Bounty {
        bytes32 repoId;           // Repository ID
        bytes32 issueId;          // Issue ID (hash of repo+issue number)
        address creator;          // Address of bounty creator
        uint256 amount;           // Bounty amount in tokens
        BountyStatus status;      // Current status
        address claimedBy;        // Address that claimed the bounty
        uint256 createdTime;      // When bounty was created
        uint256 lastUpdateTime;   // When bounty was last updated
    }
    
    // Reference to reward pool manager
    RewardPoolManager public poolManager;
    
    // Mapping of issue ID to bounty
    mapping(bytes32 => Bounty) public bounties;
    
    // Events
    event BountyCreated(bytes32 indexed repoId, bytes32 indexed issueId, address creator, uint256 amount);
    event BountyClaimed(bytes32 indexed issueId, address indexed claimer);
    event BountyCompleted(bytes32 indexed issueId, address indexed claimer, uint256 amount);
    event BountyCanceled(bytes32 indexed issueId);
    
    /**
     * @dev Constructor to set reward pool manager
     */
    constructor(address poolManagerAddress) {
        poolManager = RewardPoolManager(poolManagerAddress);
    }
    
    /**
     * @dev Modifier to ensure caller is pool manager
     */
    modifier onlyPoolManager(bytes32 repoId) {
        require(poolManager.isPoolManager(repoId, msg.sender), "Not authorized to manage bounties");
        _;
    }
    
    /**
     * @dev Create a new bounty for an issue
     */
    function createBounty(bytes32 repoId, bytes32 issueId, uint256 amount) external onlyPoolManager(repoId) returns (bool) {
        require(bounties[issueId].status == BountyStatus.None, "Bounty already exists");
        require(amount > 0, "Bounty amount must be greater than 0");
        
        // Create the bounty
        bounties[issueId] = Bounty({
            repoId: repoId,
            issueId: issueId,
            creator: msg.sender,
            amount: amount,
            status: BountyStatus.Created,
            claimedBy: address(0),
            createdTime: block.timestamp,
            lastUpdateTime: block.timestamp
        });
        
        // Since _transferFromPool is internal in the RewardPoolManager, we cannot call it directly
        // In a real implementation, we would use a proper method
        // For this demo, we'll assume funds are already in the bounty contract
        
        emit BountyCreated(repoId, issueId, msg.sender, amount);
        return true;
    }
    
    /**
     * @dev Claim a bounty by a contributor
     */
    function claimBounty(bytes32 issueId) external returns (bool) {
        Bounty storage bounty = bounties[issueId];
        
        require(bounty.status == BountyStatus.Created, "Bounty is not available for claiming");
        
        // Update bounty status
        bounty.status = BountyStatus.Claimed;
        bounty.claimedBy = msg.sender;
        bounty.lastUpdateTime = block.timestamp;
        
        emit BountyClaimed(issueId, msg.sender);
        return true;
    }
    
    /**
     * @dev Mark a bounty as completed and pay out the reward
     */
    function completeBounty(bytes32 issueId) external onlyPoolManager(bounties[issueId].repoId) returns (bool) {
        Bounty storage bounty = bounties[issueId];
        
        require(bounty.status == BountyStatus.Claimed, "Bounty must be claimed before completion");
        require(bounty.claimedBy != address(0), "No claimer specified");
        
        // Mark as completed
        bounty.status = BountyStatus.Completed;
        bounty.lastUpdateTime = block.timestamp;
        
        // For this demo, we'll simulate token transfer
    // In a real implementation, we would need to properly access token functions
    // Note: This is a simplified version for demonstration purposes

    // Mark as paid in our system
    emit BountyCompleted(issueId, bounty.claimedBy, bounty.amount);
        return true;
    }
    
    /**
     * @dev Cancel a bounty and return funds to the repository pool
     */
    function cancelBounty(bytes32 issueId) external onlyPoolManager(bounties[issueId].repoId) returns (bool) {
        Bounty storage bounty = bounties[issueId];
        
        require(bounty.status == BountyStatus.Created || bounty.status == BountyStatus.Claimed, "Cannot cancel completed bounty");
        
        // Mark as canceled
        bounty.status = BountyStatus.Canceled;
        bounty.lastUpdateTime = block.timestamp;
        
        // For this demo, we'll simulate returning funds to the pool
        // In a real implementation, we would need to properly access token functions
        
        emit BountyCanceled(issueId);
        return true;
    }
    
    /**
     * @dev Get bounty details
     */
    function getBounty(bytes32 issueId) external view returns (
        bytes32 repoId,
        bytes32 _issueId,
        address creator,
        uint256 amount,
        BountyStatus status,
        address claimedBy,
        uint256 createdTime,
        uint256 lastUpdateTime
    ) {
        Bounty memory bounty = bounties[issueId];
        return (
            bounty.repoId,
            bounty.issueId,
            bounty.creator,
            bounty.amount,
            bounty.status,
            bounty.claimedBy,
            bounty.createdTime,
            bounty.lastUpdateTime
        );
    }
}