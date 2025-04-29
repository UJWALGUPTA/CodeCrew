import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function MyClaims() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const { data: claims = [], isLoading } = useQuery({
    queryKey: ["/api/claims/recent"],
    enabled: isAuthenticated,
  });

  const handleLinkPR = async (claimId: string) => {
    setLocation(`/my-claims?link=${claimId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'claimed':
        return <Badge variant="outline" className="bg-primary/20 text-primary">Claimed</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="bg-orange-500/20 text-orange-500">PR Submitted</Badge>;
      case 'review':
        return <Badge variant="outline" className="bg-secondary/20 text-secondary">Awaiting Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">My Active Claims</h2>
        <Button variant="link" className="text-primary" onClick={() => setLocation("/history")}>
          View History →
        </Button>
      </div>
      
      <Card className="border-border overflow-hidden">
        {isLoading ? (
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-full divide-y divide-border">
                <div className="bg-card/80 px-6 py-3">
                  <div className="grid grid-cols-5 gap-4">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Repository / Issue</div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Reward</div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">PR</div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Action</div>
                  </div>
                </div>
                <div className="bg-card divide-y divide-border">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="px-6 py-4 animate-pulse">
                      <div className="grid grid-cols-5 gap-4">
                        <div>
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                        <div className="h-4 bg-muted rounded w-1/2 self-center"></div>
                        <div className="h-6 bg-muted rounded w-3/4 self-center"></div>
                        <div className="h-4 bg-muted rounded w-1/4 self-center"></div>
                        <div className="h-8 bg-muted rounded w-3/4 justify-self-end"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        ) : claims.length > 0 ? (
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-card/80">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Repository / Issue</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Reward</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">PR</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {claims.map((claim: any) => (
                    <tr key={claim.id} className="hover:bg-card/80">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium">{claim.repository}</div>
                          <div className="text-sm text-muted-foreground">#{claim.issueNumber}: {claim.issueTitle}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm code-font text-primary neon-primary">{claim.reward} TOKENS</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(claim.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {claim.prUrl ? (
                          <a href={claim.prUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            #{claim.prNumber}
                          </a>
                        ) : (
                          <span>Not submitted</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {claim.status === 'claimed' ? (
                          <Button 
                            variant="link" 
                            className="text-primary hover:text-primary/80"
                            onClick={() => handleLinkPR(claim.id)}
                          >
                            Link PR
                          </Button>
                        ) : (
                          <Button 
                            variant="link" 
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => setLocation(`/my-claims?id=${claim.id}`)}
                          >
                            View Details
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        ) : (
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No active claims</h3>
            <p className="text-muted-foreground mb-4">
              Start by claiming open issues with bounties to earn rewards
            </p>
            <Button onClick={() => setLocation("/browse-issues")}>
              Browse Issues
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
