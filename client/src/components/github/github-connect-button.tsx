import { Button } from "@/components/ui/button";
import { useGithub } from "@/hooks/use-github";
import { Github, Loader2 } from "lucide-react";

export default function GithubConnectButton() {
  const { username, isConnected, isConnecting, connect, disconnect } = useGithub();

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <Button
      onClick={handleConnect}
      variant="outline"
      className="flex items-center space-x-2 bg-card"
      disabled={isConnecting}
    >
      {isConnecting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Github className="mr-2 h-4 w-4" />
      )}
      
      {isConnecting ? (
        "Connecting..."
      ) : isConnected ? (
        <>
          <span>Connected to GitHub</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
            {username}
          </span>
        </>
      ) : (
        "Connect GitHub"
      )}
    </Button>
  );
}
