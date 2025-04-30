import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { 
  BASE_CHAIN_ID, 
  getTokenBalance, 
  checkBaseChainConfig, 
  addBaseChainToWallet 
} from "@/lib/web3";

interface WalletContextType {
  address: string;
  balance: number;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
}

const WalletContext = createContext<WalletContextType>({
  address: "",
  balance: 0,
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
  provider: null,
  signer: null,
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Check for previously connected wallet
  useEffect(() => {
    const checkConnection = async () => {
      // Check if window.ethereum is available (MetaMask)
      if (window.ethereum) {
        try {
          // Get connected accounts
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            // User has previously connected, restore connection
            await handleConnection(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          disconnect();
        } else if (isConnected && accounts[0] !== address) {
          // Account switched
          await handleConnection(accounts[0]);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", () => window.location.reload());

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, [isConnected, address]);

  const handleConnection = async (walletAddress: string) => {
    try {
      // Create Web3 provider
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      
      try {
        // Check if connected to Base chain
        const isBaseChain = await checkBaseChainConfig(web3Provider);
        if (!isBaseChain) {
          const added = await addBaseChainToWallet(window.ethereum);
          if (!added) {
            // User may have rejected the chain switch, but we can still try to continue
            console.warn("User declined to add Base Chain. App may not function correctly.");
            // Don't throw error here, let users use the app even if not on Base
          }
        }
      } catch (chainError) {
        // Don't block the user from connecting just because chain switching failed
        console.warn("Chain configuration error:", chainError);
      }
      
      // Get the signer
      const web3Signer = await web3Provider.getSigner();
      
      // Get token balance
      const tokenBal = await getTokenBalance(walletAddress);
      
      // Update state
      setProvider(web3Provider);
      setSigner(web3Signer);
      setAddress(walletAddress);
      setBalance(tokenBal);
      setIsConnected(true);
      
      return walletAddress;
    } catch (error) {
      console.error("Connection error:", error);
      throw error;
    }
  };

  const connect = async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet Connection Failed",
        description: "MetaMask or a compatible wallet is not installed. Please install MetaMask to connect.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      await handleConnection(accounts[0]);
      
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully.",
      });
    } catch (error) {
      console.error("Connect error:", error);
      toast({
        title: "Wallet Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to your wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setAddress("");
    setBalance(0);
    setIsConnected(false);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        isConnected,
        isConnecting,
        connect,
        disconnect,
        provider,
        signer,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);

// Add Ethereum to Window object
declare global {
  interface Window {
    ethereum?: any;
  }
}
