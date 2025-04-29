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
import { AlertCircle, Github, Plus, ExternalLink, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  const { isConnected: isGithubConnected, connect: connectGithub } = useGithub();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

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
      const repository = await apiRequest("POST", "/api/repositories", {
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="repositoryUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repository URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://github.com/username/repository" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the full URL of your GitHub repository
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="initialFunding"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Funding (TOKENS)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        step="1"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Amount of tokens to add to the repository reward pool
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
        </CardContent>
      </Card>
    </div>
  );
}