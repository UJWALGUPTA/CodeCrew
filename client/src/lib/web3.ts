import { ethers } from "ethers";

// Mock ABIs until we compile the contracts properly
const RewardPoolManagerABI = [
  "function fundPool(bytes32 repoId, uint256 amount) external returns (bool)",
  "function getPoolBalance(bytes32 repoId) external view returns (uint256)",
  "function isPoolManager(bytes32 repoId, address manager) external view returns (bool)"
];

const BountyContractABI = [
  "function createBounty(bytes32 repoId, bytes32 issueId, uint256 amount) external returns (bool)",
  "function claimBounty(bytes32 issueId) external returns (bool)",
  "function completeBounty(bytes32 issueId) external returns (bool)",
  "function cancelBounty(bytes32 issueId) external returns (bool)",
  "function getBounty(bytes32 issueId) external view returns (bytes32, bytes32, address, uint256, uint8, address, uint256, uint256)"
];

// Token contract addresses on Base Chain (mock values for development)
export const REWARD_TOKEN_ADDRESS = import.meta.env.VITE_REWARD_TOKEN_ADDRESS || "0x4200000000000000000000000000000000000006"; // Example: using wrapped ETH on Base
export const REWARD_POOL_MANAGER_ADDRESS = import.meta.env.VITE_REWARD_POOL_MANAGER_ADDRESS || "0x0000000000000000000000000000000000000001";
export const BOUNTY_CONTRACT_ADDRESS = import.meta.env.VITE_BOUNTY_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000002";

// Base Chain RPC URL and Chain ID
export const BASE_RPC_URL = import.meta.env.VITE_BASE_RPC_URL || "https://sepolia.base.org";
export const BASE_CHAIN_ID = import.meta.env.VITE_BASE_CHAIN_ID ? parseInt(import.meta.env.VITE_BASE_CHAIN_ID) : 84532; // Base Sepolia testnet

// Interface to represent wallet providers (MetaMask, WalletConnect, etc.)
export interface WalletProvider {
  provider: ethers.BrowserProvider;
  signer: ethers.Signer;
  address: string;
  connect: () => Promise<string>;
  disconnect: () => void;
  isConnected: boolean;
}

// Function to convert GitHub repo/issue identifiers to bytes32 for smart contracts
export function stringToBytes32(text: string): string {
  return ethers.id(text);
}

// Check if user has Base Chain configured in their wallet
export async function checkBaseChainConfig(provider: ethers.BrowserProvider): Promise<boolean> {
  try {
    const { chainId } = await provider.getNetwork();
    return chainId === BigInt(BASE_CHAIN_ID);
  } catch (error) {
    console.error("Error checking chain configuration:", error);
    return false;
  }
}

// Function to add Base Chain to MetaMask if not already configured
export async function addBaseChainToWallet(provider: any): Promise<boolean> {
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: `0x${BASE_CHAIN_ID.toString(16)}`,
        chainName: 'Base Sepolia Testnet',
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: [BASE_RPC_URL],
        blockExplorerUrls: ['https://sepolia-explorer.base.org']
      }]
    });
    return true;
  } catch (error) {
    console.error("Error adding Base Chain to wallet:", error);
    return false;
  }
}

// Initialize the Reward Pool Manager contract
export function getRewardPoolManagerContract(providerOrSigner: ethers.Provider | ethers.Signer): ethers.Contract {
  return new ethers.Contract(
    REWARD_POOL_MANAGER_ADDRESS,
    RewardPoolManagerABI,
    providerOrSigner
  );
}

// Initialize the Bounty Contract
export function getBountyContract(providerOrSigner: ethers.Provider | ethers.Signer): ethers.Contract {
  return new ethers.Contract(
    BOUNTY_CONTRACT_ADDRESS,
    BountyContractABI,
    providerOrSigner
  );
}

// Initialize a read-only provider (for queries that don't require a signer)
export function getReadOnlyProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(BASE_RPC_URL);
}

// Mock token balance functions for development (in production, these would use actual on-chain data)
export async function getTokenBalance(address: string): Promise<number> {
  // In a real implementation, this would query the ERC20 token contract
  return 1000; // Everyone starts with 1000 tokens
}

export async function fundRepositoryPool(
  signer: ethers.Signer,
  repoId: string,
  amount: number
): Promise<string> {
  try {
    const contract = getRewardPoolManagerContract(signer);
    const repoIdBytes32 = stringToBytes32(repoId);
    
    // Convert amount to Wei (assuming 18 decimals)
    const amountWei = ethers.parseUnits(amount.toString(), 18);
    
    // Call the contract method
    const tx = await contract.fundPool(repoIdBytes32, amountWei);
    const receipt = await tx.wait();
    
    return receipt.hash;
  } catch (error) {
    console.error("Error funding repository pool:", error);
    throw error;
  }
}

export async function setBountyOnIssue(
  signer: ethers.Signer,
  repoId: string,
  issueId: string,
  amount: number
): Promise<string> {
  try {
    const contract = getBountyContract(signer);
    const repoIdBytes32 = stringToBytes32(repoId);
    const issueIdBytes32 = stringToBytes32(issueId);
    
    // Convert amount to Wei (assuming 18 decimals)
    const amountWei = ethers.parseUnits(amount.toString(), 18);
    
    // Call the contract method
    const tx = await contract.createBounty(repoIdBytes32, issueIdBytes32, amountWei);
    const receipt = await tx.wait();
    
    return receipt.hash;
  } catch (error) {
    console.error("Error setting bounty on issue:", error);
    throw error;
  }
}

export async function claimBounty(
  signer: ethers.Signer,
  issueId: string
): Promise<string> {
  try {
    const contract = getBountyContract(signer);
    const issueIdBytes32 = stringToBytes32(issueId);
    
    // Call the contract method
    const tx = await contract.claimBounty(issueIdBytes32);
    const receipt = await tx.wait();
    
    return receipt.hash;
  } catch (error) {
    console.error("Error claiming bounty:", error);
    throw error;
  }
}

export async function completeBounty(
  signer: ethers.Signer,
  issueId: string
): Promise<string> {
  try {
    const contract = getBountyContract(signer);
    const issueIdBytes32 = stringToBytes32(issueId);
    
    // Call the contract method
    const tx = await contract.completeBounty(issueIdBytes32);
    const receipt = await tx.wait();
    
    return receipt.hash;
  } catch (error) {
    console.error("Error completing bounty:", error);
    throw error;
  }
}
