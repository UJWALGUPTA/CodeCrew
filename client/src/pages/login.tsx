import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Github } from "lucide-react";

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const [, setLocation] = useLocation();
  const [location] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const handleGitHubLogin = () => {
    // In a real application, this would redirect to GitHub OAuth flow
    login();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-primary/10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <svg className="w-12 h-12 text-primary neon-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm2.5 18c-.667.5-1.5.5-2.5.5s-1.833 0-2.5-.5c-.5-.5-1-1.167-1-2.5 0-2 1.5-3 3.5-3s3.5 1 3.5 3c0 1.333-.5 2-1 2.5zm2.5-8c0 .827-.673 1.5-1.5 1.5S14 10.827 14 10s.673-1.5 1.5-1.5S17 9.173 17 10zm-8 0c0 .827-.673 1.5-1.5 1.5S6 10.827 6 10s.673-1.5 1.5-1.5S9 9.173 9 10z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold neon-primary">ROXONN</h1>
          <p className="text-muted-foreground mt-2">Decentralized GitHub Rewards Platform</p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Connect to the Platform</CardTitle>
            <CardDescription>
              Sign in with GitHub to start earning rewards for your contributions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-card border border-border rounded-md p-4">
              <h3 className="font-medium text-sm mb-2 flex items-center">
                <Github className="inline mr-2 h-4 w-4" />
                GitHub Authentication
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect with your GitHub account to access repositories and track your contributions.
              </p>
              <Button 
                onClick={handleGitHubLogin} 
                className="w-full flex items-center justify-center"
              >
                <Github className="mr-2 h-5 w-5" />
                Sign in with GitHub
              </Button>
            </div>

            <div className="bg-card border border-border rounded-md p-4">
              <h3 className="font-medium text-sm mb-2 flex items-center">
                <svg className="inline mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.5 2h-13C4.12 2 3 3.12 3 4.5v15C3 20.88 4.12 22 5.5 22h13c1.38 0 2.5-1.12 2.5-2.5v-15C21 3.12 19.88 2 18.5 2zM13 17H7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5H13c.28 0 .5.22.5.5S13.28 17 13 17zm3.5-3h-9c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h9c.28 0 .5.22.5.5S16.78 14 16.5 14zm0-3h-9c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h9c.28 0 .5.22.5.5S16.78 11 16.5 11zm.5-5h-10v2h10V6z"/>
                </svg>
                Wallet Connection
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                After signing in, you'll be prompted to connect your crypto wallet to receive rewards.
              </p>
              <p className="text-xs text-muted-foreground">
                New to ROXONN? Every user receives 1000 TOKENS to get started!
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between text-xs text-muted-foreground">
            <span>Powered by Base Chain</span>
            <a href="#" className="hover:text-primary">Terms & Privacy</a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
