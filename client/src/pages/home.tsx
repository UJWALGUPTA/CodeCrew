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
import { ChevronRight, DollarSign, GitFork, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { isConnected } = useAccount();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
    enabled: isAuthenticated,
  });
  
  // Fetch user's repositories
  const { data: userRepositories = [], isLoading: isLoadingRepos } = useQuery({
    queryKey: ["/api/repositories"],
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
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
                <span className="text-2xl font-bold text-purple-400">{isLoading ? <Skeleton className="h-8 w-20 bg-gray-800" /> : `${dashboardData?.totalEarnings || 0} CREW`}</span>
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
            <CardDescription className="text-gray-400">Get started with CodeCrew</CardDescription>
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
      
      {/* My Repositories Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Repositories</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setLocation("/add-repository")}
          >
            <GitHubLogoIcon className="mr-2 h-4 w-4" />
            Add Repository
          </Button>
        </div>

        {isLoadingRepos ? (
          <div className="grid gap-4 grid-cols-1">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : userRepositories.length > 0 ? (
          <div className="grid gap-4 grid-cols-1">
            {userRepositories.map((repo: any) => (
              <Card key={repo.id} className="hover:border-primary transition-all bg-slate-900 text-white border-purple-900/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-lg">{repo.fullName}</div>
                      <div className="text-sm text-gray-400 mt-1">{repo.description || 'No description'}</div>
                      
                      <div className="flex items-center mt-3 space-x-3 text-xs text-gray-400">
                        {repo.stars !== null && (
                          <div className="flex items-center">
                            <Star className="h-3.5 w-3.5 mr-1" />
                            {repo.stars}
                          </div>
                        )}
                        {repo.forks !== null && (
                          <div className="flex items-center">
                            <GitFork className="h-3.5 w-3.5 mr-1" />
                            {repo.forks}
                          </div>
                        )}
                        {repo.openIssues !== null && (
                          <Badge variant="outline" className="flex items-center text-xs bg-slate-800">
                            {repo.openIssues} issues
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        size="sm" 
                        className="h-8 text-xs border-blue-500/30 text-blue-400"
                        onClick={() => setLocation(`/repository-detail/${repo.id}`)}
                      >
                        View Details
                      </Button>
                      
                      <Button 
                        variant="outline"
                        size="sm" 
                        className="h-8 text-xs border-green-500/30 text-green-400"
                        onClick={() => setLocation(`/repository-detail/${repo.id}?action=fund`)}
                      >
                        <DollarSign className="h-3.5 w-3.5 mr-1" />
                        Fund
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed bg-transparent border-purple-900/30">
            <CardContent className="p-8 flex flex-col items-center justify-center">
              <div className="text-muted-foreground mb-4 text-center">
                <GitHubLogoIcon className="h-12 w-12 mb-3 text-purple-500/50 mx-auto" />
                <p>You haven't added any repositories yet</p>
              </div>
              <Button 
                onClick={() => setLocation("/add-repository")}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <GitHubLogoIcon className="mr-2 h-4 w-4" />
                Add Your First Repository
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Custom RainbowKit Connection Button */}
      <div className="mt-6">
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
