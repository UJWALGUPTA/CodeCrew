import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useGithub } from "@/hooks/use-github";
import { useWallet } from "@/hooks/use-wallet";
import { apiRequest } from "@/lib/queryClient";
import { AlertCircle, Github, Plus, ExternalLink, RefreshCw, Star, GitFork } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  stars: number | null;
  forks: number | null;
  openIssues: number | null;
  isPrivate: boolean | null;
  owner: string;
}

const formSchema = z.object({
  repositoryUrl: z.string().url("Please enter a valid GitHub URL").startsWith("https://github.com/", "Must be a GitHub repository URL"),
  initialFunding: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Initial funding must be a positive number" }
  ),
});

export default function AddRepository() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { isConnected, connect } = useWallet();
  const { isConnected: isGithubConnected, connect: connectGithub, fetchUserRepositories } = useGithub();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);

  // Fetch GitHub repositories
  const { data: githubRepos = [], isLoading: isLoadingRepos, refetch: refetchRepos, error: reposError } = useQuery<Repository[]>({
    queryKey: ["/api/github/repositories"],
    enabled: isGithubConnected,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repositoryUrl: "",
      initialFunding: "100",
    },
  });

  const addRepositoryMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Extract owner and repo from the GitHub URL
      const url = new URL(values.repositoryUrl);
      const pathParts = url.pathname.split('/').filter(Boolean);
      const owner = pathParts[0];
      const repo = pathParts[1];
      
      if (!owner || !repo) {
        throw new Error("Invalid repository URL");
      }
      
      const fullName = `${owner}/${repo}`;
      
      // First, create the repository
      const repository: any = await apiRequest("POST", "/api/repositories", {
        fullName,
        name: repo,
        owner,
        url: values.repositoryUrl,
      });
      
      // Then fund it
      await apiRequest("POST", `/api/repositories/${repository.id}/fund`, {
        amount: Number(values.initialFunding),
      });
      
      return repository;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/repositories"] });
      toast({
        title: "Repository added",
        description: "The repository has been added and funded successfully.",
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Failed to add repository",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleSelectRepository = (repo: Repository) => {
    // Update form values
    form.setValue("repositoryUrl", repo.url, { 
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
    
    // Store selected repository details in state
    setSelectedRepository(repo);
    
    // Show a small confirmation toast
    toast({
      title: "Repository selected",
      description: `Selected ${repo.fullName}`,
    });
    
    // Scroll to form section
    setTimeout(() => {
      const formSection = document.getElementById('repository-form');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isAuthenticated) {
      toast({
        title: "Not authenticated",
        description: "Please log in to add a repository",
        variant: "destructive",
      });
      return;
    }

    if (!isGithubConnected) {
      toast({
        title: "GitHub not connected",
        description: "Please connect your GitHub account to add a repository",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to fund the repository",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);
    try {
      await addRepositoryMutation.mutateAsync(values);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Add Repository</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Add a GitHub Repository</CardTitle>
          <CardDescription>
            Add your GitHub repository to the platform and fund it with tokens to reward contributors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isGithubConnected && (
            <Alert className="mb-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>GitHub Account Required</AlertTitle>
              <AlertDescription>
                You need to connect your GitHub account first.
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-2"
                  onClick={connectGithub}
                >
                  <Github className="mr-2 h-4 w-4" />
                  Connect GitHub
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {!isConnected && (
            <Alert className="mb-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wallet Required</AlertTitle>
              <AlertDescription>
                You need to connect your wallet to fund the repository.
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-2"
                  onClick={connect}
                >
                  Connect Wallet
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Your GitHub Repositories</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetchRepos()}
                  disabled={isLoadingRepos || !isGithubConnected}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingRepos ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              <div className="relative mb-4">
                <Input
                  placeholder="Search repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Debug info */}
              <div className="text-xs text-muted-foreground mb-4">
                <div>isConnected: {isConnected.toString()}</div>
                <div>isGithubConnected: {isGithubConnected.toString()}</div>
                <div>isLoadingRepos: {isLoadingRepos.toString()}</div>
                <div>Repos count: {githubRepos ? githubRepos.length : 0}</div>
                {reposError && <div className="text-destructive">Error: {String(reposError)}</div>}
              </div>

              {isLoadingRepos ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : githubRepos && githubRepos.length > 0 ? (
                <div className="space-y-3">
                  {githubRepos
                    .filter(repo => 
                      searchQuery === "" || 
                      repo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((repo: Repository) => (
                      <Card key={repo.id} className="hover:border-primary cursor-pointer transition-all" onClick={() => handleSelectRepository(repo)}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{repo.fullName}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1 mt-1">{repo.description || 'No description'}</div>
                            </div>
                            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Star className="h-3.5 w-3.5 mr-1" />
                                {repo.stars || 0}
                              </div>
                              <div className="flex items-center">
                                <GitFork className="h-3.5 w-3.5 mr-1" />
                                {repo.forks || 0}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md">
                  <div className="text-muted-foreground mb-2">No repositories found</div>
                  {isGithubConnected && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => refetchRepos()}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  )}
                </div>
              )}
            </div>

            {form.getValues("repositoryUrl") && (
              <Form {...form}>
                <form id="repository-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 border rounded-lg p-4 bg-muted/10">
                  <div className="text-sm mb-3">
                    <div className="font-medium mb-1">Selected Repository:</div>
                    {selectedRepository ? (
                      <div className="flex items-start gap-2 p-2 rounded bg-muted/30">
                        <div className="flex-1">
                          <div className="font-medium text-primary">{selectedRepository.fullName}</div>
                          <div className="text-xs text-muted-foreground mt-1">{selectedRepository.description || 'No description'}</div>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            {selectedRepository.stars || 0}
                          </div>
                          <div className="flex items-center">
                            <GitFork className="h-3 w-3 mr-1" />
                            {selectedRepository.forks || 0}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-primary">{form.getValues("repositoryUrl")}</div>
                    )}
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="initialFunding"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Funding (CREW Tokens)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            step="1"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Amount of CREW tokens to add to the repository reward pool
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isAdding || !isGithubConnected || !isConnected}
                  >
                    {isAdding ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding Repository...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Plus className="mr-2 h-5 w-5" />
                        Add Repository
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}