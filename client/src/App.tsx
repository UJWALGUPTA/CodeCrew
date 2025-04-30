import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import Home from "@/pages/home";
import BrowseIssues from "@/pages/browse-issues";
import MyClaims from "@/pages/my-claims";
import History from "@/pages/history";
import RepositoryDetail from "@/pages/repository-detail";
import AddRepository from "@/pages/add-repository";
import Login from "@/pages/login";
import { AuthProvider } from "@/hooks/use-auth";
import { GithubProvider } from "@/hooks/use-github";
import { ProtectedRoute } from "@/components/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/">
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </Route>
      <Route path="/browse-issues">
        <ProtectedRoute>
          <BrowseIssues />
        </ProtectedRoute>
      </Route>
      <Route path="/my-claims">
        <ProtectedRoute>
          <MyClaims />
        </ProtectedRoute>
      </Route>
      <Route path="/history">
        <ProtectedRoute>
          <History />
        </ProtectedRoute>
      </Route>
      <Route path="/repository/:id">
        <ProtectedRoute>
          <RepositoryDetail />
        </ProtectedRoute>
      </Route>
      <Route path="/add-repository">
        <ProtectedRoute>
          <AddRepository />
        </ProtectedRoute>
      </Route>
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <AuthProvider>
        <GithubProvider>
          <Layout>
            <Router />
          </Layout>
          <Toaster />
        </GithubProvider>
      </AuthProvider>
    </TooltipProvider>
  );
}

export default App;
