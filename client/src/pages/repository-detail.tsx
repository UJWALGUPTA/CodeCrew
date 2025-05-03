import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useWallet } from "@/hooks/use-wallet";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { 
  Github, 
  GitFork, 
  Star, 
  Users, 
  Calendar, 
  GitPullRequest, 
  CircleDollarSign,
  Lock,
  Unlock,
  AlertCircle
} from "lucide-react";

export default function RepositoryDetail() {
  const params = useParams();
  const id = params.id;
  const { isAuthenticated } = useAuth();
  const { isConnected: isWalletConnected, balance } = useWallet();
  // Use RainbowKit's connection status
  const { isConnected } = useAccount();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [fundAmount, setFundAmount] = useState("100");
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);
  const [issueId, setIssueId] = useState<string | null>(null);
  const [bountyAmount, setBountyAmount] = useState("50");
  const [isBountyDialogOpen, setIsBountyDialogOpen] = useState(false);

  // Log ID for debugging purposes
  console.log("Repository detail page ID:", id);
  
  const { data: repository = {}, isLoading, error: repoError } = useQuery<any>({
    queryKey: [`/api/repositories/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/repositories/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch repository details: ${response.status} ${response.statusText}`);
      }
      return response.json();
    },
    enabled: isAuthenticated && id !== undefined,
  });

  console.log("Repository data loaded:", repository);

  const { data: poolStats = {}, error: poolError } = useQuery<any>({
    queryKey: [`/api/repositories/${id}/pool`],
    queryFn: async () => {
      const response = await fetch(`/api/repositories/${id}/pool`);
      if (!response.ok) {
        throw new Error(`Failed to fetch pool stats: ${response.status} ${response.statusText}`);
      }
      return response.json();
    },
    enabled: isAuthenticated && id !== undefined,
  });

  console.log("Pool stats loaded:", poolStats);

  const { data: issues = [], error: issuesError } = useQuery<any[]>({
    queryKey: [`/api/repositories/${id}/issues`],
    queryFn: async () => {
      const response = await fetch(`/api/repositories/${id}/issues`);
      if (!response.ok) {
        throw new Error(`Failed to fetch repository issues: ${response.status} ${response.statusText}`);
      }
      return response.json();
    },
    enabled: isAuthenticated && id !== undefined,
  });

  console.log("Issues loaded:", issues);

  const { data: isOwner = false, error: ownerError } = useQuery<boolean>({
    queryKey: [`/api/repositories/${id}/is-owner`],
    queryFn: async () => {
      const response = await fetch(`/api/repositories/${id}/is-owner`);
      if (!response.ok) {
        throw new Error(`Failed to check repository ownership: ${response.status} ${response.statusText}`);
      }
      return response.json();
    },
    enabled: isAuthenticated && id !== undefined,
  });

  console.log("Is owner loaded:", isOwner);

  const handleFundRepository = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to fund this repository",
        variant: "destructive",
      });
      return;
    }

    const amount = parseInt(fundAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (amount > balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough tokens in your wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest("POST", `/api/repositories/${id}/fund`, { amount });
      toast({
        title: "Repository funded",
        description: `Successfully funded with ${amount} TOKENS`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/repositories/${id}/pool`] });
      setIsFundDialogOpen(false);
    } catch (error) {
      toast({
        title: "Failed to fund repository",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleSetBounty = async () => {
    if (!isConnected || !issueId) {
      toast({
        title: "Error",
        description: "Please connect your wallet and select an issue",
        variant: "destructive",
      });
      return;
    }

    const amount = parseInt(bountyAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (poolStats && amount > poolStats.availableBalance) {
      toast({
        title: "Insufficient pool balance",
        description: "The repository pool doesn't have enough funds",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest("POST", `/api/issues/${issueId}/set-bounty`, { amount });
      toast({
        title: "Bounty set",
        description: `Successfully set ${amount} TOKENS bounty on issue`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/repositories/${id}/issues`] });
      setIsBountyDialogOpen(false);
      setBountyAmount("50");
    } catch (error) {
      toast({
        title: "Failed to set bounty",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const openBountyDialog = (issueId: string) => {
    setIssueId(issueId);
    setIsBountyDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-16 w-16 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Check for various error conditions
  if (!repository || !Object.keys(repository).length) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
          <h3 className="text-lg font-medium mb-2">Repository not found</h3>
          <p className="text-muted-foreground mb-4">
            The repository you're looking for doesn't exist or you don't have access to it
          </p>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-2">
              Details: Repository ID: {id}, Authentication status: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
              {repoError && <div className="text-destructive">Error: {String(repoError)}</div>}
            </p>
            <Button onClick={() => setLocation("/")}>
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-card p-4 rounded-md">
            <Github className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{repository.name}</h1>
            <p className="text-muted-foreground">{repository.owner}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => window.open(repository.url, '_blank')} className="flex items-center">
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
          </Button>
          
          {isOwner && (
            <Button onClick={() => setIsFundDialogOpen(true)} className="neon-border-primary">
              <CircleDollarSign className="mr-2 h-4 w-4" />
              Fund Repository
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Repository Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="flex items-center text-muted-foreground">
                  <Star className="mr-2 h-4 w-4" />
                  Stars
                </div>
                <span>{repository.stars}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center text-muted-foreground">
                  <GitFork className="mr-2 h-4 w-4" />
                  Forks
                </div>
                <span>{repository.forks}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  Contributors
                </div>
                <span>{repository.contributors}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  Last Updated
                </div>
                <span>{repository.updatedAt ? formatDistanceToNow(new Date(repository.updatedAt), { addSuffix: true }) : 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center text-muted-foreground">
                  <GitPullRequest className="mr-2 h-4 w-4" />
                  Open PRs
                </div>
                <span>{repository.openPRs}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Reward Pool</CardTitle>
            <CardDescription>
              Funds available for bounties on this repository
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-3xl font-bold neon-primary font-mono">
                    {poolStats?.availableBalance || 0} TOKENS
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Daily Deposit Limit</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-right">
                      {poolStats?.dailyDeposited || 0} / 1000 TOKENS
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <p className="text-muted-foreground">Daily Deposit Usage</p>
                  <p>{poolStats ? Math.round((poolStats.dailyDeposited / 1000) * 100) : 0}%</p>
                </div>
                <Progress value={poolStats ? (poolStats.dailyDeposited / 1000) * 100 : 0} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-primary/10 rounded-md p-3">
                  <p className="text-sm text-muted-foreground">Reward Pool</p>
                  <p className="text-lg font-medium neon-primary">
                    {poolStats?.totalBalance || 0}
                  </p>
                </div>
                <div className="bg-primary/10 rounded-md p-3">
                  <p className="text-sm text-muted-foreground">Active Bounties</p>
                  <p className="text-lg font-medium">
                    {poolStats?.activeBounties || 0}
                  </p>
                </div>
                <div className="bg-primary/10 rounded-md p-3">
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-lg font-medium">
                    {poolStats?.totalPaid || 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="issues">
        <TabsList>
          <TabsTrigger value="issues">Open Issues</TabsTrigger>
          <TabsTrigger value="bounties">Active Bounties</TabsTrigger>
        </TabsList>
        <TabsContent value="issues" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Available Issues</CardTitle>
              <CardDescription>
                Issues without bounties that you can fund
              </CardDescription>
            </CardHeader>
            <CardContent>
              {issuesError ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
                  <h3 className="text-lg font-medium mb-2">Error loading issues</h3>
                  <p className="text-muted-foreground mb-4">
                    {String(issuesError)}
                  </p>
                </div>
              ) : issues.length === 0 ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium mb-2">Loading issues...</h3>
                  <p className="text-muted-foreground">
                    Fetching issues from GitHub
                  </p>
                </div>
              ) : issues.filter((issue: any) => !issue.hasBounty).length > 0 ? (
                <div className="space-y-4">
                  {issues
                    .filter((issue: any) => !issue.hasBounty)
                    .map((issue: any) => (
                      <div key={issue.id} className="flex justify-between items-center border-b border-border pb-4 last:border-0 last:pb-0">
                        <div>
                          <div className="flex items-center">
                            <Unlock className="w-4 h-4 text-muted-foreground mr-2" />
                            <h3 className="font-medium">{issue.title}</h3>
                          </div>
                          <div className="flex items-center mt-1 text-sm text-muted-foreground">
                            <span>#{issue.number}</span>
                            <span className="mx-2">•</span>
                            <span>Opened {issue.createdAt ? formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true }) : 'recently'}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => window.open(issue.url, '_blank')}>
                            View
                          </Button>
                          {isOwner && (
                            <Button size="sm" onClick={() => openBountyDialog(issue.id)}>
                              Set Bounty
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Unlock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No open issues found</h3>
                  <p className="text-muted-foreground">
                    This repository doesn't have any open issues without bounties
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bounties" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Active Bounties</CardTitle>
              <CardDescription>
                Issues with active bounties available for claiming
              </CardDescription>
            </CardHeader>
            <CardContent>
              {issuesError ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
                  <h3 className="text-lg font-medium mb-2">Error loading issues</h3>
                  <p className="text-muted-foreground mb-4">
                    {String(issuesError)}
                  </p>
                </div>
              ) : issues.length === 0 ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium mb-2">Loading issues...</h3>
                  <p className="text-muted-foreground">
                    Fetching issues from GitHub
                  </p>
                </div>
              ) : issues.filter((issue: any) => issue.hasBounty).length > 0 ? (
                <div className="space-y-4">
                  {issues
                    .filter((issue: any) => issue.hasBounty)
                    .map((issue: any) => (
                      <div key={issue.id} className="flex justify-between items-center border-b border-border pb-4 last:border-0 last:pb-0">
                        <div>
                          <div className="flex items-center">
                            <Lock className="w-4 h-4 text-primary mr-2" />
                            <h3 className="font-medium">{issue.title}</h3>
                            <Badge className="ml-2 bg-primary/20 text-primary">
                              {issue.reward} TOKENS
                            </Badge>
                          </div>
                          <div className="flex items-center mt-1 text-sm text-muted-foreground">
                            <span>#{issue.number}</span>
                            <span className="mx-2">•</span>
                            <span>Bounty added {issue.bountyAddedAt ? formatDistanceToNow(new Date(issue.bountyAddedAt), { addSuffix: true }) : 'recently'}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => window.open(issue.url, '_blank')}>
                            View
                          </Button>
                          <Button size="sm" onClick={() => setLocation(`/browse-issues?id=${issue.id}`)}>
                            Claim
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CircleDollarSign className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No active bounties</h3>
                  <p className="text-muted-foreground">
                    This repository doesn't have any issues with active bounties
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Fund Repository Dialog */}
      <Dialog open={isFundDialogOpen} onOpenChange={setIsFundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fund Repository</DialogTitle>
            <DialogDescription>
              Add funds to the repository's reward pool. The daily deposit limit is 1000 TOKENS.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount (TOKENS)</span>
                <span className="text-sm text-muted-foreground">Balance: {balance} TOKENS</span>
              </div>
              <Input
                type="number"
                min="1"
                max={Math.min(balance, 1000 - (poolStats?.dailyDeposited || 0))}
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Daily deposit used: {poolStats?.dailyDeposited || 0}/1000 TOKENS
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFundDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFundRepository} className="neon-border-primary">
              Fund Repository
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Bounty Dialog */}
      <Dialog open={isBountyDialogOpen} onOpenChange={setIsBountyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Issue Bounty</DialogTitle>
            <DialogDescription>
              Assign a bounty to this issue from the repository's reward pool.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bounty Amount (TOKENS)</span>
                <span className="text-sm text-muted-foreground">
                  Available: {poolStats?.availableBalance || 0} TOKENS
                </span>
              </div>
              <Input
                type="number"
                min="1"
                max={poolStats?.availableBalance || 0}
                value={bountyAmount}
                onChange={(e) => setBountyAmount(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBountyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetBounty} className="neon-border-primary">
              Set Bounty
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
