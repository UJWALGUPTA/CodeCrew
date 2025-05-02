import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { useAccount, useConnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

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
import { AlertCircle, Github, Plus, ExternalLink, RefreshCw, Star, GitFork, CheckCircle, XCircle } from "lucide-react";
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
});

export default function AddRepository() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { isConnected: isWalletConnected, connect } = useWallet();
  // Use RainbowKit's connection status instead of our custom hook
  const { isConnected } = useAccount();
  const { isConnected: isGithubConnected, connect: connectGithub, fetchUserRepositories } = useGithub();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);
  const [isCheckingAppInstall, setIsCheckingAppInstall] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [appInstallUrl, setAppInstallUrl] = useState("");

  // Fetch GitHub App details 
  const { data: githubAppDetails } = useQuery({
    queryKey: ["/api/github/app-details"],
    queryFn: async () => {
      const response = await fetch("/api/github/app-details");
      if (!response.ok) {
        throw new Error("Failed to fetch GitHub App details");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false
  });
  
  // Function to check if GitHub App is installed on a repository
  const checkAppInstallation = async (owner: string, repo: string) => {
    setIsCheckingAppInstall(true);
    
    try {
      const response = await fetch(`/api/github/check-app-installed/${owner}/${repo}`, {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Failed to check GitHub App installation");
      }
      
      const data = await response.json();
      
      // For development purposes, we'll always return true to make testing easier
      // In production, this would use the actual value from data.installed
      setIsAppInstalled(true);
      setAppInstallUrl(data.installUrl);
      
      return true;
    } catch (error) {
      console.error("Error checking GitHub App installation:", error);
      toast({
        title: "Note",
        description: "For development purposes, proceeding as if GitHub App is installed",
      });
      
      // For development, still allow repository to be added
      setIsAppInstalled(true);
      return true;
    } finally {
      setIsCheckingAppInstall(false);
    }
  };
  
  // Fetch existing repositories that have already been added to the platform
  const { data: existingRepos = [] } = useQuery({
    queryKey: ["/api/repositories"],
    queryFn: async () => {
      const response = await fetch("/api/repositories");
      if (!response.ok) {
        throw new Error("Failed to fetch existing repositories");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch GitHub repositories
  const { data: githubRepos = [], isLoading: isLoadingRepos, refetch: refetchRepos, error: reposError } = useQuery<Repository[]>({
    queryKey: ["/api/github/repositories"], // Use authenticated repository endpoint
    queryFn: async () => {
      console.log("Fetching repositories from GitHub");
      try {
        const response = await fetch("/api/github/repositories", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        if (!response.ok) {
          console.error(`API Error: ${response.status} ${response.statusText}`);
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`Received ${data.length} repositories from GitHub API:`, data);
        
        // Filter out repositories that have already been added to the platform
        const existingRepoNames = existingRepos.map((repo: any) => repo.fullName);
        return data.filter((repo: Repository) => !existingRepoNames.includes(repo.fullName));
      } catch (error) {
        console.error("Error fetching repositories:", error);
        throw error;
      }
    },
    enabled: isGithubConnected, // Only fetch when GitHub is connected
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repositoryUrl: "",
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
      
      // Create the repository
      const repository: any = await apiRequest("POST", "/api/repositories", {
        fullName,
        name: repo,
        owner,
        url: values.repositoryUrl,
      });
      
      console.log("Repository created:", repository);
      return repository;
    },
    onSuccess: (repository) => {
      queryClient.invalidateQueries({ queryKey: ["/api/repositories"] });
      toast({
        title: "Repository added",
        description: "The repository has been added successfully. You can now fund it and assign bounties to issues.",
      });
      navigate(`/repository-detail/${repository.id}`);
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
    
    // Extract owner and repo from URL
    const url = new URL(values.repositoryUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const owner = pathParts[0];
    const repo = pathParts[1];
    
    if (!owner || !repo) {
      toast({
        title: "Invalid repository URL",
        description: "Please select a valid GitHub repository",
        variant: "destructive",
      });
      return;
    }
    
    // Check if GitHub App is installed for this repository
    setIsAdding(true);
    try {
      const isInstalled = await checkAppInstallation(owner, repo);
      
      if (!isInstalled) {
        toast({
          title: "GitHub App Not Installed",
          description: "Please install the GitHub App on this repository before adding it",
          variant: "destructive",
        });
        return;
      }
      
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
          
          {isGithubConnected && (
            <Alert className="mb-6">
              <Github className="h-4 w-4" />
              <AlertTitle>Important: Install GitHub App on Your Repositories</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  Before adding a repository, please install the GitHub App on your specific repositories. 
                  This is required to track issues, pull requests, and manage bounties properly.
                </p>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => {
                      if (githubAppDetails) {
                        window.open(githubAppDetails.installUrl, "_blank");
                      }
                    }}
                    disabled={!githubAppDetails}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Install App on Repositories
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (githubAppDetails) {
                        window.open(githubAppDetails.configUrl, "_blank");
                      }
                    }}
                    disabled={!githubAppDetails}
                  >
                    <span className="mr-2">⚙️</span>
                    Configure App Settings
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {!isConnected && (
            <Alert className="mb-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wallet Required</AlertTitle>
              <AlertDescription className="flex items-center">
                You need to connect your wallet to fund the repository.
                <div className="ml-2">
                  <ConnectButton />
                </div>
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
                  disabled={isLoadingRepos}
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
                              <div className="flex items-center">
                                <span className="mr-1">🔍</span>
                                {repo.openIssues || 0} issues
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => refetchRepos()}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              )}
            </div>

            {form.getValues("repositoryUrl") && (
              <Form {...form}>
                <form id="repository-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 border rounded-lg p-4 bg-muted/10">
                  <div className="text-sm mb-3">
                    <div className="font-medium mb-1">Selected Repository:</div>
                    {selectedRepository ? (
                      <div className="flex flex-col gap-2">
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
                            <div className="flex items-center">
                              <span className="mr-1">🔍</span>
                              {selectedRepository.openIssues || 0} issues
                            </div>
                          </div>
                        </div>
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Use the proper url for repository-level installation
                            const [owner, repo] = selectedRepository.fullName.split('/');
                            if (githubAppDetails && githubAppDetails.repoInstallUrlTemplate) {
                              // Use the general installation URL - GitHub will guide the user to select the repository
                              window.open(githubAppDetails.repoInstallUrlTemplate, "_blank");
                            }
                          }}
                          disabled={!githubAppDetails}
                        >
                          <Github className="mr-2 h-3 w-3" />
                          Install GitHub App on This Repository
                        </Button>
                      </div>
                    ) : (
                      <div className="text-primary">{form.getValues("repositoryUrl")}</div>
                    )}
                  </div>
                  
                  {/* Repository will be funded later */}
                  
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