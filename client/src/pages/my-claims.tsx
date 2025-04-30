import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, GitPullRequest, Github, Search } from "lucide-react";

export default function MyClaims() {
  const { isAuthenticated } = useAuth();
  const { isConnected } = useWallet();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentClaim, setCurrentClaim] = useState<any>(null);
  const [isPrDialogOpen, setIsPrDialogOpen] = useState(false);
  const [prUrl, setPrUrl] = useState("");
  
  // Sample claims data for the demo
  const sampleClaims = [
    {
      id: 1,
      issue: {
        id: 1,
        title: "Fix documentation for React",
        url: "https://github.com/facebook/react/issues/1",
        reward: 100
      },
      repository: "facebook/react",
      status: "claimed",
      prUrl: null,
      prNumber: null,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    },
    {
      id: 2,
      issue: {
        id: 3,
        title: "Fix memory leak in Go-Ethereum",
        url: "https://github.com/ethereum/go-ethereum/issues/3",
        reward: 500
      },
      repository: "ethereum/go-ethereum",
      status: "approved",
      prUrl: "https://github.com/ethereum/go-ethereum/pull/103",
      prNumber: 103,
      transactionHash: "0x" + Math.random().toString(16).substr(2, 64),
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      issue: {
        id: 5,
        title: "Implement CI/CD pipeline for Base contracts",
        url: "https://github.com/base-org/contracts/issues/5",
        reward: 300
      },
      repository: "base-org/contracts",
      status: "review",
      prUrl: "https://github.com/base-org/contracts/pull/105",
      prNumber: 105,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: 4,
      issue: {
        id: 5,
        title: "Fix TypeError in CodeCrew App",
        url: "https://github.com/UJWALGUPTA/code-crew-app/issues/3",
        reward: 500
      },
      repository: "UJWALGUPTA/code-crew-app",
      status: "submitted",
      prUrl: "https://github.com/UJWALGUPTA/code-crew-app/pull/103",
      prNumber: 103,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];

  // Use sample claims for the demo
  const { data: claims = sampleClaims, isLoading = false } = useQuery({
    queryKey: ["/api/claims"],
    enabled: false, // Disable actual API request for demo
  });

  const filteredClaims = claims.filter((claim: any) => 
    searchTerm === "" || 
    claim.issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.repository.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLinkPR = async () => {
    if (!prUrl || !currentClaim) return;
    
    try {
      await apiRequest("POST", `/api/claims/${currentClaim.id}/link-pr`, { prUrl });
      toast({
        title: "PR linked successfully",
        description: "Your pull request has been linked to this claim",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
      setIsPrDialogOpen(false);
      setPrUrl("");
    } catch (error) {
      toast({
        title: "Failed to link PR",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const openLinkPrDialog = (claim: any) => {
    setCurrentClaim(claim);
    setIsPrDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'claimed':
        return <Badge variant="outline" className="bg-primary/20 text-primary">Claimed</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="bg-warning/20 text-warning">PR Submitted</Badge>;
      case 'review':
        return <Badge variant="outline" className="bg-secondary/20 text-secondary">Awaiting Review</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-secondary">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Claims</h1>
          <p className="text-muted-foreground">Manage your claimed issues and pull requests</p>
        </div>
        
        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your claims..."
              className="pl-10 w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex justify-between mb-4">
                  <div className="bg-muted h-6 w-1/3 rounded"></div>
                  <div className="bg-muted h-6 w-24 rounded"></div>
                </div>
                <div className="bg-muted h-8 w-2/3 rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="bg-muted h-8 w-24 rounded"></div>
                  <div className="bg-muted h-9 w-32 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredClaims.length > 0 ? (
        <div className="space-y-4">
          {filteredClaims.map((claim: any) => (
            <Card key={claim.id} className="hover:border-primary transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div className="flex items-center mb-2 md:mb-0">
                    <Github className="w-4 h-4 text-muted-foreground mr-1.5" />
                    <span className="text-sm">{claim.repository}</span>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      Claimed {formatDistanceToNow(new Date(claim.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  {getStatusBadge(claim.status)}
                </div>
                
                <h3 className="text-base font-medium mb-4">{claim.issue.title}</h3>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-primary/20 px-2 py-1 rounded text-primary font-mono text-sm neon-primary mr-4">
                      {claim.issue.reward} TOKENS
                    </div>
                    
                    {claim.prUrl && (
                      <div className="flex items-center">
                        <GitPullRequest className="w-4 h-4 text-muted-foreground mr-1.5" />
                        <a 
                          href={claim.prUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          View Pull Request
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(claim.issue.url, '_blank')}>
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Issue
                    </Button>
                    
                    {claim.status === "claimed" && (
                      <Button onClick={() => openLinkPrDialog(claim)}>
                        Link PR
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <GitPullRequest className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No claims yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by browsing issues and claiming bounties to work on
            </p>
            <Button onClick={() => window.location.href = "/browse-issues"}>
              Browse Issues
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isPrDialogOpen} onOpenChange={setIsPrDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Pull Request</DialogTitle>
            <DialogDescription>
              Enter the URL of your GitHub pull request that resolves this issue.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Input
              placeholder="https://github.com/owner/repo/pull/123"
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPrDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLinkPR}>
              Link Pull Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
