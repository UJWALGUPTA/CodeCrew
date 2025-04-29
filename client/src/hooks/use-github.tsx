import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface GithubContextType {
  username: string;
  isConnected: boolean;
  isConnecting: boolean;
  repositories: any[];
  connect: () => Promise<void>;
  disconnect: () => void;
  fetchUserRepositories: () => Promise<any[]>;
}

const GithubContext = createContext<GithubContextType>({
  username: "",
  isConnected: false,
  isConnecting: false,
  repositories: [],
  connect: async () => {},
  disconnect: () => {},
  fetchUserRepositories: async () => [],
});

export const GithubProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [repositories, setRepositories] = useState<any[]>([]);
  const { toast } = useToast();

  // Initialize GitHub connection if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // In a real implementation, we would check for a valid GitHub token
      // For this simulation, we'll use the GitHub ID from the user object
      setUsername(user.githubId || user.username);
      setIsConnected(true);
      
      // Load repositories when connected
      fetchUserRepositories();
    } else {
      setIsConnected(false);
      setUsername("");
      setRepositories([]);
    }
  }, [isAuthenticated, user]);

  // Function to simulate connecting to GitHub
  const connect = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to connect your GitHub account.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      // In a real implementation, this would redirect to GitHub OAuth
      // For this simulation, we'll just use the user data
      
      if (user) {
        setUsername(user.githubId || user.username);
        setIsConnected(true);
        
        toast({
          title: "GitHub Connected",
          description: "Your GitHub account has been connected successfully.",
        });
        
        // Load repositories after connecting
        await fetchUserRepositories();
      }
    } catch (error) {
      console.error("GitHub connect error:", error);
      toast({
        title: "GitHub Connection Failed",
        description: "There was an error connecting to GitHub. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Function to disconnect from GitHub
  const disconnect = () => {
    setUsername("");
    setIsConnected(false);
    setRepositories([]);
    
    toast({
      title: "GitHub Disconnected",
      description: "Your GitHub account has been disconnected.",
    });
  };

  // Function to fetch user repositories
  const fetchUserRepositories = async () => {
    if (!isConnected) return [];
    
    try {
      const repos = await apiRequest("GET", "/api/github/repositories", undefined);
      setRepositories(repos);
      return repos;
    } catch (error) {
      console.error("Error fetching repositories:", error);
      toast({
        title: "Repository Fetch Failed",
        description: "There was an error fetching your GitHub repositories.",
        variant: "destructive",
      });
      return [];
    }
  };

  return (
    <GithubContext.Provider
      value={{
        username,
        isConnected,
        isConnecting,
        repositories,
        connect,
        disconnect,
        fetchUserRepositories,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export const useGithub = () => useContext(GithubContext);
