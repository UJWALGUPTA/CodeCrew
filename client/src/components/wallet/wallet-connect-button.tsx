import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { Loader2, Wallet } from "lucide-react";

export default function WalletConnectButton() {
  const { balance, address, isConnected, isConnecting, connect, disconnect } = useWallet();

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  // Format address to show only the first 6 and last 4 characters
  const formatAddress = (addr: string) => {
    return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
  };

  return (
    <Button
      onClick={handleConnect}
      className={`flex items-center space-x-2 ${isConnected ? 'bg-primary hover:bg-primary/80 text-white neon-border-primary' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wallet className="mr-2 h-4 w-4" />
      )}
      
      {isConnecting ? (
        "Connecting..."
      ) : isConnected ? (
        <>
          <span>{formatAddress(address)}</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-card text-foreground">
            {balance} <span className="ml-1 text-xs text-muted-foreground">TOKENS</span>
          </span>
        </>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  );
}
