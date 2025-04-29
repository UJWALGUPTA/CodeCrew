import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import Home from "@/pages/home";
import BrowseIssues from "@/pages/browse-issues";
import MyClaims from "@/pages/my-claims";
import History from "@/pages/history";
import RepositoryDetail from "@/pages/repository-detail";
import Login from "@/pages/login";
import { WalletProvider } from "@/hooks/use-wallet";
import { AuthProvider } from "@/hooks/use-auth";
import { GithubProvider } from "@/hooks/use-github";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/browse-issues" component={BrowseIssues} />
      <Route path="/my-claims" component={MyClaims} />
      <Route path="/history" component={History} />
      <Route path="/repository/:id" component={RepositoryDetail} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <GithubProvider>
            <WalletProvider>
              <Layout>
                <Router />
              </Layout>
              <Toaster />
            </WalletProvider>
          </GithubProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
