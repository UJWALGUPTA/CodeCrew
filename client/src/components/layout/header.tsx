import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell, LogOut, Settings, User } from "lucide-react";
import GithubConnectButton from "@/components/github/github-connect-button";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLocation } from "wouter";

export default function Header() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <header className="bg-card border-b border-border py-3 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5c4.142 0 7.5 3.358 7.5 7.5 0 2.786-1.917 5.223-4.667 5.943v-3.943h1.917v-2h-1.917v-1.5c0-0.942 0.442-1.5 1.5-1.5h0.5v-2h-0.583c-1.978 0-3.23 1.305-3.23 3.25v1.75h-2.12v2h2.12v3.938c-2.737-0.729-4.642-3.161-4.642-5.938 0-4.142 3.358-7.5 7.5-7.5z"/>
          </svg>
          <span className="text-xl font-bold text-primary">CodeCrew</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-destructive rounded-full">
                  2
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4">
                <h4 className="font-medium mb-4">Notifications</h4>
                <div className="space-y-4">
                  <div className="bg-primary/10 p-3 rounded-md border border-primary/20">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">PR approved</span>
                      <span className="text-xs text-muted-foreground">2h ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your PR to ethereum/solidity has been approved and merged. Reward transferred!
                    </p>
                  </div>
                  <div className="bg-card p-3 rounded-md border border-border">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">New bounty available</span>
                      <span className="text-xs text-muted-foreground">5h ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      A new high-value bounty was posted for a repository you follow.
                    </p>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <GithubConnectButton />
          <ConnectButton showBalance={{smallScreen: false, largeScreen: true}} />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.username} />
                  <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.username}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onSelect={() => setLocation("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onSelect={() => setLocation("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onSelect={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
