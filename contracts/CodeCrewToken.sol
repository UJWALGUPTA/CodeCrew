// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title CodeCrewToken
 * @dev ERC20 token for the CodeCrew platform
 */
contract CodeCrewToken {
    string public name = "CodeCrew Token";
    string public symbol = "CREW";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;
    
    address public owner;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 amount);
    
    constructor(uint256 initialSupply) {
        owner = msg.sender;
        totalSupply = initialSupply * 10**uint256(decimals);
        balances[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "CodeCrewToken: caller is not the owner");
        _;
    }
    
    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(to != address(0), "CodeCrewToken: transfer to the zero address");
        require(balances[msg.sender] >= amount, "CodeCrewToken: transfer amount exceeds balance");
        
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function allowance(address tokenOwner, address spender) public view returns (uint256) {
        return allowances[tokenOwner][spender];
    }
    
    function approve(address spender, uint256 amount) public returns (bool) {
        require(spender != address(0), "CodeCrewToken: approve to the zero address");
        
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(from != address(0), "CodeCrewToken: transfer from the zero address");
        require(to != address(0), "CodeCrewToken: transfer to the zero address");
        require(balances[from] >= amount, "CodeCrewToken: transfer amount exceeds balance");
        require(allowances[from][msg.sender] >= amount, "CodeCrewToken: transfer amount exceeds allowance");
        
        balances[from] -= amount;
        balances[to] += amount;
        allowances[from][msg.sender] -= amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
    
    function mint(address to, uint256 amount) public onlyOwner returns (bool) {
        require(to != address(0), "CodeCrewToken: mint to the zero address");
        
        totalSupply += amount;
        balances[to] += amount;
        emit Transfer(address(0), to, amount);
        emit Mint(to, amount);
        return true;
    }
    
    // Award initial tokens to new users
    function awardInitialTokens(address to) public onlyOwner returns (bool) {
        require(to != address(0), "CodeCrewToken: award to the zero address");
        require(balances[to] == 0, "CodeCrewToken: recipient already has tokens");
        
        uint256 amount = 1000 * 10**uint256(decimals); // 1000 CREW tokens
        balances[to] += amount;
        totalSupply += amount;
        
        emit Transfer(address(0), to, amount);
        return true;
    }
}