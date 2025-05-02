import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  BarChart3,
  Briefcase,
  Clock,
  Folder,
  FolderClosed,
  Home,
  Plus,
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const [isRepositoriesExpanded, setIsRepositoriesExpanded] = useState(true);

  const { data: repositories = [] } = useQuery<any[]>({
    queryKey: ["/api/repositories"],
    enabled: isAuthenticated,
  });

  const navItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/browse-issues",
      label: "Browse Issues",
      icon: Briefcase,
    },
    {
      href: "/my-claims",
      label: "My Claims",
      icon: BarChart3,
    },
    {
      href: "/history",
      label: "History",
      icon: Clock,
    },
  ];

  return (
    <aside className="w-64 border-r border-border p-4 hidden md:block">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
          >
            <a
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
                location === item.href
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/80"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-6 w-6",
                location === item.href
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground"
              )} />
              {item.label}
            </a>
          </Link>
        ))}
        
        <div className="pt-5 border-t border-border">
          <div 
            className="flex items-center justify-between px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer"
            onClick={() => setIsRepositoriesExpanded(!isRepositoriesExpanded)}
          >
            <span>My Repositories</span>
            <span>{isRepositoriesExpanded ? "−" : "+"}</span>
          </div>
          
          {isRepositoriesExpanded && (
            <div className="mt-3 space-y-1">
              {repositories.map((repo: any) => (
                <Link 
                  key={repo.id} 
                  href={`/repository-detail/${repo.id}`}
                >
                  <a
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
                      location === `/repository-detail/${repo.id}`
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/80"
                    )}
                  >
                    <FolderClosed className={cn(
                      "mr-3 h-5 w-5",
                      location === `/repository-detail/${repo.id}`
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    {repo.name}
                  </a>
                </Link>
              ))}
              
              <Link href="/add-repository">
                <a className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/80 group">
                  <Plus className="text-muted-foreground group-hover:text-foreground mr-3 h-5 w-5" />
                  Add Repository
                </a>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
