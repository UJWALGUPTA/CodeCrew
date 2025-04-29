// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BountyContract
 * @dev Handles individual issue bounties, claims, and payouts
 */
contract BountyContract is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    
    // Reference to the RewardPoolManager contract
    address public rewardPoolManager;
    IERC20 public rewardToken;
    
    enum BountyStatus { None, Created, Claimed, Completed, Canceled }
    
    struct Bounty {
        bytes32 repoId;
        bytes32 issueId;
        address creator;
        uint256 amount;
        BountyStatus status;
        address claimedBy;
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    // Mapping from issue IDs to bounties
    mapping(bytes32 => Bounty) public bounties;
    
    event BountyCreated(bytes32 indexed repoId, bytes32 indexed issueId, uint256 amount);
    event BountyClaimed(bytes32 indexed repoId, bytes32 indexed issueId, address indexed claimedBy);
    event BountyCompleted(bytes32 indexed repoId, bytes32 indexed issueId, address recipient, uint256 amount);
    event BountyCanceled(bytes32 indexed repoId, bytes32 indexed issueId);
    
    constructor(address _rewardToken, address _rewardPoolManager) {
        rewardToken = IERC20(_rewardToken);
        rewardPoolManager = _rewardPoolManager;
    }
    
    /**
     * @dev Creates a new bounty for an issue
     * @param repoId Unique identifier for the repository
     * @param issueId Unique identifier for the GitHub issue
     * @param amount Number of tokens to offer as bounty
     */
    function createBounty(
        bytes32 repoId,
        bytes32 issueId,
        uint256 amount
    ) external {
        require(bounties[issueId].status == BountyStatus.None, "Bounty already exists");
        
        // Create the bounty record
        bounties[issueId] = Bounty({
            repoId: repoId,
            issueId: issueId,
            creator: msg.sender,
            amount: amount,
            status: BountyStatus.Created,
            claimedBy: address(0),
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        emit BountyCreated(repoId, issueId, amount);
    }
    
    /**
     * @dev Claims a bounty for an issue
     * @param issueId Unique identifier for the GitHub issue
     */
    function claimBounty(bytes32 issueId) external nonReentrant {
        Bounty storage bounty = bounties[issueId];
        
        require(bounty.status == BountyStatus.Created, "Bounty not available for claiming");
        require(bounty.creator != msg.sender, "Creator cannot claim own bounty");
        
        bounty.status = BountyStatus.Claimed;
        bounty.claimedBy = msg.sender;
        bounty.updatedAt = block.timestamp;
        
        emit BountyClaimed(bounty.repoId, issueId, msg.sender);
    }
    
    /**
     * @dev Completes a bounty and pays the claimer
     * @param issueId Unique identifier for the GitHub issue
     */
    function completeBounty(bytes32 issueId) external nonReentrant {
        Bounty storage bounty = bounties[issueId];
        
        require(bounty.status == BountyStatus.Claimed, "Bounty not claimed");
        require(bounty.creator == msg.sender, "Only creator can complete");
        require(bounty.claimedBy != address(0), "No claimer set");
        
        address recipient = bounty.claimedBy;
        uint256 amount = bounty.amount;
        
        bounty.status = BountyStatus.Completed;
        bounty.updatedAt = block.timestamp;
        
        // Call the RewardPoolManager to issue the bounty payment
        // This is a simplified version - in a real implementation, we would
        // use an interface to call RewardPoolManager.issueBounty()
        
        emit BountyCompleted(bounty.repoId, issueId, recipient, amount);
    }
    
    /**
     * @dev Cancels a bounty that hasn't been claimed yet
     * @param issueId Unique identifier for the GitHub issue
     */
    function cancelBounty(bytes32 issueId) external nonReentrant {
        Bounty storage bounty = bounties[issueId];
        
        require(bounty.status == BountyStatus.Created, "Bounty not in created state");
        require(bounty.creator == msg.sender, "Only creator can cancel");
        
        bounty.status = BountyStatus.Canceled;
        bounty.updatedAt = block.timestamp;
        
        emit BountyCanceled(bounty.repoId, issueId);
    }
    
    /**
     * @dev Retrieves full information about a bounty
     * @param issueId Unique identifier for the GitHub issue
     * @return Full bounty information
     */
    function getBounty(bytes32 issueId) external view returns (
        bytes32 repoId,
        bytes32 id,
        address creator,
        uint256 amount,
        BountyStatus status,
        address claimedBy,
        uint256 createdAt,
        uint256 updatedAt
    ) {
        Bounty storage bounty = bounties[issueId];
        return (
            bounty.repoId,
            bounty.issueId,
            bounty.creator,
            bounty.amount,
            bounty.status,
            bounty.claimedBy,
            bounty.createdAt,
            bounty.updatedAt
        );
    }
    
    /**
     * @dev Updates the reward pool manager address
     * @param _rewardPoolManager New address for the reward pool manager
     */
    function setRewardPoolManager(address _rewardPoolManager) external onlyOwner {
        rewardPoolManager = _rewardPoolManager;
    }
}
