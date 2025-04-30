// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./CodeCrewToken.sol";

/**
 * @title RewardPoolManager
 * @dev Manages reward pools for GitHub repositories
 */
contract RewardPoolManager {
    // Token contract reference
    CodeCrewToken public token;
    
    // Platform admin
    address public admin;
    
    // Pool structure
    struct Pool {
        bytes32 repoId;            // Repository ID (hash of repo name)
        address manager;           // Pool manager address
        uint256 balance;           // Current pool balance
        bool exists;               // Whether pool exists
        uint256 lastDepositTime;   // Time of last deposit
    }
    
    // Mapping of repository ID to pool
    mapping(bytes32 => Pool) public pools;
    
    // Mapping of repository ID to authorized managers
    mapping(bytes32 => mapping(address => bool)) public poolManagers;
    
    // Events
    event PoolCreated(bytes32 indexed repoId, address indexed manager);
    event PoolFunded(bytes32 indexed repoId, address indexed funder, uint256 amount);
    event ManagerAdded(bytes32 indexed repoId, address indexed manager);
    event ManagerRemoved(bytes32 indexed repoId, address indexed manager);
    
    /**
     * @dev Constructor to set token contract and admin
     */
    constructor(address tokenAddress) {
        token = CodeCrewToken(tokenAddress);
        admin = msg.sender;
    }
    
    /**
     * @dev Modifier to check if caller is admin
     */
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }
    
    /**
     * @dev Modifier to check if caller is pool manager
     */
    modifier onlyPoolManager(bytes32 repoId) {
        require(pools[repoId].exists, "Pool does not exist");
        require(
            msg.sender == pools[repoId].manager || 
            poolManagers[repoId][msg.sender] || 
            msg.sender == admin, 
            "Not authorized to manage pool"
        );
        _;
    }
    
    /**
     * @dev Create a new reward pool for a repository
     */
    function createPool(bytes32 repoId, address manager) external onlyAdmin returns (bool) {
        require(!pools[repoId].exists, "Pool already exists for repository");
        require(manager != address(0), "Invalid manager address");
        
        pools[repoId] = Pool({
            repoId: repoId,
            manager: manager,
            balance: 0,
            exists: true,
            lastDepositTime: block.timestamp
        });
        
        poolManagers[repoId][manager] = true;
        
        emit PoolCreated(repoId, manager);
        return true;
    }
    
    /**
     * @dev Add tokens to a repository reward pool
     */
    function fundPool(bytes32 repoId, uint256 amount) external returns (bool) {
        require(pools[repoId].exists, "Pool does not exist");
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer tokens from sender to contract
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        
        // Update pool balance
        pools[repoId].balance += amount;
        pools[repoId].lastDepositTime = block.timestamp;
        
        emit PoolFunded(repoId, msg.sender, amount);
        return true;
    }
    
    /**
     * @dev Get balance of a repository reward pool
     */
    function getPoolBalance(bytes32 repoId) external view returns (uint256) {
        require(pools[repoId].exists, "Pool does not exist");
        return pools[repoId].balance;
    }
    
    /**
     * @dev Add a manager to a repository reward pool
     */
    function addPoolManager(bytes32 repoId, address manager) external onlyPoolManager(repoId) returns (bool) {
        require(manager != address(0), "Invalid manager address");
        poolManagers[repoId][manager] = true;
        emit ManagerAdded(repoId, manager);
        return true;
    }
    
    /**
     * @dev Remove a manager from a repository reward pool
     */
    function removePoolManager(bytes32 repoId, address manager) external onlyPoolManager(repoId) returns (bool) {
        require(manager != pools[repoId].manager, "Cannot remove primary manager");
        poolManagers[repoId][manager] = false;
        emit ManagerRemoved(repoId, manager);
        return true;
    }
    
    /**
     * @dev Check if an address is a manager for a repository
     */
    function isPoolManager(bytes32 repoId, address manager) external view returns (bool) {
        if (!pools[repoId].exists) return false;
        return poolManagers[repoId][manager] || manager == pools[repoId].manager || manager == admin;
    }
    
    /**
     * @dev Internal function to transfer tokens from pool to recipient
     */
    function _transferFromPool(bytes32 repoId, address recipient, uint256 amount) internal returns (bool) {
        require(pools[repoId].exists, "Pool does not exist");
        require(pools[repoId].balance >= amount, "Insufficient pool balance");
        
        pools[repoId].balance -= amount;
        require(token.transfer(recipient, amount), "Token transfer failed");
        
        return true;
    }
}