import { useQuery } from "@tanstack/react-query";
import { WalletCard } from "@/components/dashboard/wallet-card";
import { useAuth } from "@/hooks/use-auth";
import { useAccount } from "wagmi";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { isConnected } = useAccount();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="grid gap-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
      <p className="text-muted-foreground">View your repositories, bounties, and claims</p>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border-purple-900/20 bg-slate-900 text-white">
          <CardHeader>
            <CardTitle>Stats</CardTitle>
            <CardDescription className="text-gray-400">Your activity on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <span className="text-muted-foreground text-xs">Total Earnings</span>
                <span className="text-2xl font-bold text-purple-400">{isLoading ? <Skeleton className="h-8 w-20 bg-gray-800" /> : `${dashboardData?.totalEarnings || 0} ROXN`}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-muted-foreground text-xs">Completed Bounties</span>
                <span className="text-2xl font-bold text-green-400">{isLoading ? <Skeleton className="h-8 w-20 bg-gray-800" /> : dashboardData?.completedBounties || 0}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-muted-foreground text-xs">Pending Claims</span>
                <span className="text-2xl font-bold text-yellow-400">{isLoading ? <Skeleton className="h-8 w-20 bg-gray-800" /> : dashboardData?.pendingClaims || 0}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-muted-foreground text-xs">Open Issues</span>
                <span className="text-2xl font-bold text-blue-400">{isLoading ? <Skeleton className="h-8 w-20 bg-gray-800" /> : dashboardData?.openIssues || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border-purple-900/20 bg-slate-900 text-white">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">Get started with ROXONN</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => setLocation("/add-repository")}
            >
              <GitHubLogoIcon className="mr-2 h-4 w-4" />
              Add Repository
            </Button>
            <Button 
              className="w-full bg-slate-800 hover:bg-slate-700 border border-purple-600/40"
              onClick={() => setLocation("/browse-issues")}
            >
              Browse Issues
            </Button>
          </CardContent>
          <CardFooter className="text-xs text-gray-500">
            Manage your repositories and find issues to work on
          </CardFooter>
        </Card>

        {/* Wallet Card */}
        <WalletCard />
      </div>
      
      {/* Custom RainbowKit Connection Button */}
      <div className="mt-4">
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => {
            return (
              <div
                {...(!mounted && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!mounted || !account || !chain) {
                    return (
                      <Button onClick={openConnectModal} type="button" className="bg-purple-600 hover:bg-purple-700">
                        Connect Wallet
                      </Button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <Button onClick={openChainModal} type="button" className="bg-red-600 hover:bg-red-700">
                        Wrong network
                      </Button>
                    );
                  }

                  return (
                    <div className="flex gap-3">
                      <Button
                        onClick={openChainModal}
                        className="bg-slate-800 hover:bg-slate-700 flex items-center gap-2"
                        type="button"
                      >
                        {chain.hasIcon && (
                          <div className="w-4 h-4">
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                className="w-4 h-4"
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </Button>

                      <Button
                        onClick={openAccountModal}
                        type="button"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ''}
                      </Button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </div>
  );
}
