// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RewardPoolManager
 * @dev Manages GitHub repository reward pools and token distributions
 */
contract RewardPoolManager is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    
    IERC20 public rewardToken;
    uint256 public constant DAILY_DEPOSIT_LIMIT = 1000 * 10**18; // 1000 tokens with 18 decimals
    
    struct RepoPool {
        address manager;
        uint256 balance;
        uint256 lastDepositTime;
        uint256 dailyDeposited;
        bool isActive;
    }
    
    // Mapping of repo identifiers to their funding pools
    mapping(bytes32 => RepoPool) public repoPools;
    
    event PoolCreated(bytes32 indexed repoId, address indexed manager);
    event PoolFunded(bytes32 indexed repoId, uint256 amount);
    event BountyPaid(bytes32 indexed repoId, bytes32 indexed issueId, address recipient, uint256 amount);
    
    constructor(address _rewardToken) {
        rewardToken = IERC20(_rewardToken);
    }
    
    /**
     * @dev Creates a new repository pool
     * @param repoId Unique identifier for the repository
     */
    function createPool(bytes32 repoId) external {
        require(repoPools[repoId].manager == address(0), "Pool already exists");
        
        repoPools[repoId] = RepoPool({
            manager: msg.sender,
            balance: 0,
            lastDepositTime: 0,
            dailyDeposited: 0,
            isActive: true
        });
        
        emit PoolCreated(repoId, msg.sender);
    }
    
    /**
     * @dev Funds an existing repository pool
     * @param repoId Unique identifier for the repository
     * @param amount Number of tokens to add to the pool
     */
    function fundPool(bytes32 repoId, uint256 amount) external nonReentrant {
        RepoPool storage pool = repoPools[repoId];
        require(pool.manager == msg.sender, "Not the pool manager");
        require(pool.isActive, "Pool is not active");
        
        // Reset daily deposit counter if it's a new day
        if (block.timestamp >= pool.lastDepositTime + 1 days) {
            pool.dailyDeposited = 0;
            pool.lastDepositTime = block.timestamp;
        }
        
        // Enforce daily deposit limit
        require(pool.dailyDeposited + amount <= DAILY_DEPOSIT_LIMIT, "Daily deposit limit exceeded");
        
        // Transfer tokens from sender to contract
        rewardToken.safeTransferFrom(msg.sender, address(this), amount);
        
        // Update pool balance and daily deposited amount
        pool.balance += amount;
        pool.dailyDeposited += amount;
        
        emit PoolFunded(repoId, amount);
    }
    
    /**
     * @dev Issues a bounty from a repository pool to a contributor
     * @param repoId Unique identifier for the repository
     * @param issueId Unique identifier for the GitHub issue
     * @param recipient Address to receive the bounty
     * @param amount Number of tokens to award
     */
    function issueBounty(
        bytes32 repoId, 
        bytes32 issueId, 
        address recipient, 
        uint256 amount
    ) external nonReentrant {
        RepoPool storage pool = repoPools[repoId];
        require(pool.manager == msg.sender, "Not the pool manager");
        require(pool.isActive, "Pool is not active");
        require(pool.balance >= amount, "Insufficient pool balance");
        
        // Reduce pool balance
        pool.balance -= amount;
        
        // Transfer tokens to recipient
        rewardToken.safeTransfer(recipient, amount);
        
        emit BountyPaid(repoId, issueId, recipient, amount);
    }
    
    /**
     * @dev Closes a repository pool and withdraws remaining funds
     * @param repoId Unique identifier for the repository
     */
    function closePool(bytes32 repoId) external nonReentrant {
        RepoPool storage pool = repoPools[repoId];
        require(pool.manager == msg.sender, "Not the pool manager");
        require(pool.isActive, "Pool is already inactive");
        
        pool.isActive = false;
        
        if (pool.balance > 0) {
            uint256 amount = pool.balance;
            pool.balance = 0;
            rewardToken.safeTransfer(pool.manager, amount);
        }
    }
    
    /**
     * @dev Emergency function to pause all contract operations
     * Only callable by the owner
     */
    function pause() external onlyOwner {
        // Implementation would include a pause mechanism
        // This is a placeholder for demonstration
    }
    
    /**
     * @dev Emergency function to resume contract operations
     * Only callable by the owner
     */
    function unpause() external onlyOwner {
        // Implementation would include an unpause mechanism
        // This is a placeholder for demonstration
    }
}
