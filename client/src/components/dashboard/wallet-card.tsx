import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useContracts } from '@/hooks/use-contracts';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Loader2Icon, RefreshCwIcon } from 'lucide-react';

export function WalletCard() {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { isLoading, tokenInfo, getTokenInfo } = useContracts();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      getTokenInfo();
    }
  }, [address, isConnected, getTokenInfo]);

  const handleRefresh = async () => {
    if (!isConnected) return;
    
    setRefreshing(true);
    await getTokenInfo();
    setRefreshing(false);
  };

  const formatBalance = (balance: string) => {
    // Format to 2 decimal places
    return parseFloat(balance).toFixed(2);
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-200 border-primary/20 bg-card/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>My Wallet</span>
          {isConnected && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-primary hover:text-primary/80 hover:bg-primary/10 p-1 h-8 w-8"
              onClick={handleRefresh}
              disabled={isLoading || refreshing}
            >
              {refreshing ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCwIcon className="h-4 w-4" />
              )}
            </Button>
          )}
        </CardTitle>
        {isConnected && address && (
          <CardDescription className="text-muted-foreground">
            {truncateAddress(address)}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="h-20 flex flex-col items-center justify-center">
            <p className="text-muted-foreground mb-2 text-sm">Connect your wallet to view your balance</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full bg-muted" />
            <Skeleton className="h-4 w-3/4 bg-muted" />
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-primary">
                {tokenInfo?.balance ? formatBalance(tokenInfo.balance) : '0.00'}
              </span>
              <span className="ml-2 text-sm text-muted-foreground">
                {tokenInfo?.symbol || 'CREW'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground/80">
              {tokenInfo?.name || 'CodeCrew Token'} • Use to fund repositories and bounties
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!isConnected ? (
          <Button 
            className="w-full"
            onClick={openConnectModal}
          >
            Connect Wallet
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full border-primary/30 text-primary hover:bg-primary/10"
          >
            Manage Tokens
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}