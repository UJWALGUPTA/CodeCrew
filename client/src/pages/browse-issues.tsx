import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Hash, Search, ExternalLink, Github } from "lucide-react";

export default function BrowseIssues() {
  const { isAuthenticated } = useAuth();
  const { isConnected } = useWallet();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [minReward, setMinReward] = useState(0);
  const [labelFilters, setLabelFilters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["/api/issues"],
    enabled: isAuthenticated,
  });

  const { data: popularLabels = [] } = useQuery({
    queryKey: ["/api/labels/popular"],
    enabled: isAuthenticated,
  });

  const filteredIssues = issues.filter((issue: any) => {
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.repository.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by minimum reward
    const matchesReward = issue.reward >= minReward;
    
    // Filter by labels
    const matchesLabels = labelFilters.length === 0 || 
      labelFilters.some(label => issue.labels.includes(label));
    
    // Filter by tab (all, bug, feature, etc)
    const matchesTab = activeTab === "all" || issue.type === activeTab;
    
    return matchesSearch && matchesReward && matchesLabels && matchesTab;
  });

  const handleClaimIssue = async (issueId: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to claim issues",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest("POST", `/api/issues/${issueId}/claim`, {});
      toast({
        title: "Issue claimed",
        description: "You've successfully claimed this issue",
      });
    } catch (error) {
      toast({
        title: "Failed to claim issue",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Browse Issues</h1>
          <p className="text-muted-foreground">Find and claim bounties from GitHub repositories</p>
        </div>
        
        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search repositories or issues..."
              className="pl-10 w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Filter by Reward</h3>
              <div className="space-y-4">
                <div>
                  <Slider
                    value={[minReward]}
                    min={0}
                    max={1000}
                    step={50}
                    onValueChange={(values) => setMinReward(values[0])}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Min: {minReward} TOKENS</span>
                  <span className="text-sm text-muted-foreground">Max: 1000 TOKENS</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Popular Labels</h3>
              <div className="space-y-2">
                {popularLabels.map((label: string) => (
                  <div key={label} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`label-${label}`}
                      checked={labelFilters.includes(label)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setLabelFilters([...labelFilters, label]);
                        } else {
                          setLabelFilters(labelFilters.filter(l => l !== label));
                        }
                      }}
                    />
                    <Label htmlFor={`label-${label}`} className="text-sm cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all">All Issues</TabsTrigger>
              <TabsTrigger value="bug">Bug Fixes</TabsTrigger>
              <TabsTrigger value="feature">Features</TabsTrigger>
              <TabsTrigger value="docs">Documentation</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="bg-muted h-4 w-1/3 rounded mb-2"></div>
                        <div className="bg-muted h-6 w-2/3 rounded mb-4"></div>
                        <div className="bg-muted h-4 w-full rounded mb-4"></div>
                        <div className="flex justify-between items-center">
                          <div className="bg-muted h-8 w-24 rounded"></div>
                          <div className="bg-muted h-9 w-32 rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredIssues.length > 0 ? (
                <div className="space-y-4">
                  {filteredIssues.map((issue: any) => (
                    <Card key={issue.id} className="hover:border-primary transition-all">
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <Github className="w-4 h-4 text-muted-foreground mr-1.5" />
                            <span className="text-muted-foreground text-sm">{issue.repository}</span>
                          </div>
                          <Badge variant={
                            issue.type === "bug" ? "destructive" : 
                            issue.type === "feature" ? "default" : 
                            issue.type === "docs" ? "secondary" : 
                            "outline"
                          } className="bg-opacity-20">
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
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => window.open(issue.url, '_blank')}>
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              onClick={() => handleClaimIssue(issue.id)}
                              className="neon-border-primary"
                            >
                              Claim Bounty
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Hash className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No issues found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or search for a different term
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="bug" className="mt-6">
              {/* Same content structure as "all" but filtered for bugs */}
            </TabsContent>
            <TabsContent value="feature" className="mt-6">
              {/* Same content structure as "all" but filtered for features */}
            </TabsContent>
            <TabsContent value="docs" className="mt-6">
              {/* Same content structure as "all" but filtered for documentation */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
