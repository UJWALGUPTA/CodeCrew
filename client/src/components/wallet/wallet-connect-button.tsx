import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, Loader2 } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { truncateAddress } from "@/lib/utils";

export function WalletConnectButton() {
  const { isConnected, isConnecting, connect, disconnect, address, balance } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isConnected) {
    return (
      <Button
        variant="default"
        size="sm"
        onClick={connect}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </>
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="text-primary">
          <Wallet className="mr-2 h-4 w-4" />
          {truncateAddress(address)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-default flex justify-between">
          <span>Address:</span>
          <span className="font-mono text-xs">{truncateAddress(address)}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-default flex justify-between">
          <span>Balance:</span>
          <span>{balance} CREW</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={() => {
            disconnect();
            setIsDropdownOpen(false);
          }}
        >
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}