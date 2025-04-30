import { useCallback, useEffect, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useWalletClient } from 'wagmi';
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { baseGoerli } from 'viem/chains';
import { formatUnits, parseUnits, stringToHex, hexToString } from 'viem';
import { 
  ROXONN_TOKEN_ADDRESS, 
  REWARD_POOL_MANAGER_ADDRESS, 
  BOUNTY_CONTRACT_ADDRESS 
} from '@/lib/contracts/artifacts/contract-addresses';
import RoxonnTokenABI from '@/lib/contracts/artifacts/RoxonnTokenABI.json';
import RewardPoolManagerABI from '@/lib/contracts/artifacts/RewardPoolManagerABI.json';
import BountyContractABI from '@/lib/contracts/artifacts/BountyContractABI.json';
import { useToast } from '@/hooks/use-toast';

export interface TokenInfo {
  balance: string;
  symbol: string;
  name: string;
}

export interface PoolInfo {
  balance: string;
  repoId: string;
  manager: string;
}

export interface BountyInfo {
  repoId: string;
  issueId: string;
  creator: string;
  amount: string;
  status: number; // 0: Created, 1: Claimed, 2: Completed, 3: Canceled
  claimedBy: string;
  createdTime: number;
  lastUpdateTime: number;
}

// Create a public client for read-only operations
const publicClient = createPublicClient({
  chain: baseGoerli, // Using Base Goerli testnet for development
  transport: http(import.meta.env.VITE_BASE_RPC_URL || 'https://goerli.base.org'),
});

export function useContracts() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const { toast } = useToast();
  
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // For simulated token data (since we're not making actual blockchain calls in this demo)
  const simulatedTokenInfo: TokenInfo = {
    balance: '1000.00',
    symbol: 'ROXN',
    name: 'Roxonn Token'
  };

  // Get token information
  const getTokenInfo = useCallback(async () => {
    if (!address || !isConnected) return null;
    
    setIsLoading(true);
    try {
      // For the purpose of this demo, we'll return simulated data
      // In a real implementation, we would call the token contract
      setTimeout(() => {
        setTokenInfo(simulatedTokenInfo);
        setIsLoading(false);
      }, 800);
      
      return simulatedTokenInfo;
    } catch (error) {
      console.error("Failed to get token info:", error);
      toast({
        title: "Error",
        description: "Failed to fetch token information.",
        variant: "destructive",
      });
      setIsLoading(false);
      return null;
    }
  }, [address, isConnected, toast]);

  // Get repository pool information
  const getPoolInfo = useCallback(async (repoId: string) => {
    if (!address || !isConnected) return null;
    
    setIsLoading(true);
    try {
      // For the purpose of this demo, we'll return simulated data
      const simulatedPoolInfo: PoolInfo = {
        balance: '500.00',
        repoId: repoId,
        manager: address || '0x0000000000000000000000000000000000000000'
      };
      
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return simulatedPoolInfo;
    } catch (error) {
      console.error("Failed to get pool info:", error);
      toast({
        title: "Error",
        description: "Failed to fetch repository pool information.",
        variant: "destructive",
      });
      setIsLoading(false);
      return null;
    }
  }, [address, isConnected, toast]);

  // Create a repository pool
  const createPool = useCallback(async (repoId: string) => {
    if (!address || !isConnected || !walletClient) return false;
    
    setIsLoading(true);
    try {
      // Simulate successful transaction
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Repository pool created successfully.",
        });
        setIsLoading(false);
      }, 1200);
      
      return true;
    } catch (error) {
      console.error("Failed to create pool:", error);
      toast({
        title: "Error",
        description: "Failed to create repository pool.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  }, [address, isConnected, walletClient, toast]);

  // Fund a repository pool
  const fundPool = useCallback(async (repoId: string, amount: string) => {
    if (!address || !isConnected || !walletClient) return false;
    
    setIsLoading(true);
    try {
      // Simulate successful transaction
      setTimeout(() => {
        toast({
          title: "Success",
          description: `Successfully funded repository with ${amount} ROXN.`,
        });
        setIsLoading(false);
      }, 1200);
      
      return true;
    } catch (error) {
      console.error("Failed to fund pool:", error);
      toast({
        title: "Error",
        description: "Failed to fund repository pool.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  }, [address, isConnected, walletClient, toast]);

  // Create a bounty for an issue
  const createBounty = useCallback(async (repoId: string, issueId: string, amount: string) => {
    if (!address || !isConnected || !walletClient) return false;
    
    setIsLoading(true);
    try {
      // Simulate successful transaction
      setTimeout(() => {
        toast({
          title: "Success",
          description: `Bounty created with ${amount} ROXN.`,
        });
        setIsLoading(false);
      }, 1200);
      
      return true;
    } catch (error) {
      console.error("Failed to create bounty:", error);
      toast({
        title: "Error",
        description: "Failed to create bounty. Make sure you have permission and sufficient funds in the repository pool.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  }, [address, isConnected, walletClient, toast]);

  // Claim a bounty
  const claimBounty = useCallback(async (issueId: string) => {
    if (!address || !isConnected || !walletClient) return false;
    
    setIsLoading(true);
    try {
      // Simulate successful transaction
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Bounty claimed successfully.",
        });
        setIsLoading(false);
      }, 1200);
      
      return true;
    } catch (error) {
      console.error("Failed to claim bounty:", error);
      toast({
        title: "Error",
        description: "Failed to claim bounty. It may already be claimed or completed.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  }, [address, isConnected, walletClient, toast]);

  // Complete a bounty (pool manager only)
  const completeBounty = useCallback(async (issueId: string) => {
    if (!address || !isConnected || !walletClient) return false;
    
    setIsLoading(true);
    try {
      // Simulate successful transaction
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Bounty completed and reward transferred.",
        });
        setIsLoading(false);
      }, 1200);
      
      return true;
    } catch (error) {
      console.error("Failed to complete bounty:", error);
      toast({
        title: "Error",
        description: "Failed to complete bounty. Make sure you are the pool manager.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  }, [address, isConnected, walletClient, toast]);

  // Cancel a bounty (pool manager only)
  const cancelBounty = useCallback(async (issueId: string) => {
    if (!address || !isConnected || !walletClient) return false;
    
    setIsLoading(true);
    try {
      // Simulate successful transaction
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Bounty canceled and funds returned to the pool.",
        });
        setIsLoading(false);
      }, 1200);
      
      return true;
    } catch (error) {
      console.error("Failed to cancel bounty:", error);
      toast({
        title: "Error",
        description: "Failed to cancel bounty. Make sure you are the pool manager and the bounty is not completed.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  }, [address, isConnected, walletClient, toast]);

  // Get bounty information
  const getBountyInfo = useCallback(async (issueId: string) => {
    if (!address) return null;
    
    setIsLoading(true);
    try {
      // For the purpose of this demo, we'll return simulated data
      const simulatedBountyInfo: BountyInfo = {
        repoId: 'repo123',
        issueId: issueId,
        creator: address,
        amount: '50.00',
        status: 1, // Claimed
        claimedBy: '0x1234567890123456789012345678901234567890',
        createdTime: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
        lastUpdateTime: Math.floor(Date.now() / 1000) - 43200 // 12 hours ago
      };
      
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return simulatedBountyInfo;
    } catch (error) {
      console.error("Failed to get bounty info:", error);
      toast({
        title: "Error",
        description: "Failed to fetch bounty information.",
        variant: "destructive",
      });
      setIsLoading(false);
      return null;
    }
  }, [address, toast]);

  // Check if the current network is supported
  const isNetworkSupported = useCallback(() => {
    // Check if connected to Base chain (network ID: 8453) or Base Goerli testnet (84531)
    // For this demo, we'll treat all networks as supported
    return true;
  }, [chainId]);

  // Initialize with simulated token info
  useEffect(() => {
    if (isConnected && address) {
      getTokenInfo();
    }
  }, [isConnected, address, getTokenInfo]);

  return {
    isLoading,
    tokenInfo,
    getTokenInfo,
    getPoolInfo,
    createPool,
    fundPool,
    createBounty,
    claimBounty,
    completeBounty,
    cancelBounty,
    getBountyInfo,
    isNetworkSupported
  };
}