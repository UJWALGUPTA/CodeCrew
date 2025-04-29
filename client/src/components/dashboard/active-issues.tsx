import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Github } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ActiveIssues() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: featuredIssues = [], isLoading } = useQuery({
    queryKey: ["/api/issues/featured"],
    enabled: isAuthenticated,
  });

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'bug':
        return "destructive";
      case 'feature':
        return "default";
      case 'docs':
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Featured Bounties</h2>
        <Button variant="link" className="text-primary" onClick={() => setLocation("/browse-issues")}>
          View All →
        </Button>
      </div>
      
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-border animate-pulse">
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <div className="bg-muted h-4 w-1/3 rounded"></div>
                  <div className="bg-muted h-4 w-16 rounded"></div>
                </div>
                <div className="bg-muted h-6 w-2/3 rounded mb-2"></div>
                <div className="bg-muted h-4 w-full rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="bg-muted h-8 w-24 rounded"></div>
                  <div className="bg-muted h-9 w-32 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : featuredIssues.length > 0 ? (
          featuredIssues.map((issue: any) => (
            <Card 
              key={issue.id} 
              className="hover:border-primary overflow-hidden transition-all"
            >
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <Github className="w-4 h-4 text-muted-foreground mr-1.5" />
                    <span className="text-muted-foreground text-sm">{issue.repository}</span>
                  </div>
                  <Badge 
                    variant={getBadgeVariant(issue.type)} 
                    className={cn(
                      issue.type === "bug" ? "bg-destructive/20 text-destructive" : 
                      issue.type === "feature" ? "bg-primary/20 text-primary" : 
                      issue.type === "docs" ? "bg-orange-500/20 text-orange-500" : 
                      "bg-secondary/20 text-secondary"
                    )}
                  >
                    {issue.type}
                  </Badge>
                </div>
                
                <h3 className="text-base font-medium mb-2">{issue.title}</h3>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {issue.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-primary/20 px-2 py-1 rounded text-primary font-mono text-sm neon-primary">
                      {issue.reward} TOKENS
                    </div>
                  </div>
                  <Button 
                    onClick={() => setLocation(`/browse-issues?id=${issue.id}`)}
                    className="neon-border-primary"
                  >
                    Claim Bounty
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-1 lg:col-span-2">
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No featured bounties</h3>
                <p className="text-muted-foreground mb-4">
                  Check back later for new bounties or browse all available issues
                </p>
                <Button onClick={() => setLocation("/browse-issues")}>
                  Browse All Issues
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
