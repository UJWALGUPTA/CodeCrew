import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { githubClient } from "./github";
import { web3Client } from "./web3";
import session from "express-session";
import { startGithubOAuth, handleGithubCallback, logoutUser } from "./auth";

// Authentication middleware
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // -------------------- Auth Routes --------------------
  
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        req.session.destroy(() => {});
        return res.status(401).json({ message: "User not found" });
      }

      // Don't send sensitive data to the client
      const { accessToken, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Error in /api/auth/me:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GitHub OAuth routes
  app.get("/api/auth/github", startGithubOAuth);
  app.get("/api/auth/github/callback", handleGithubCallback);

  // Logout route  
  app.post("/api/auth/logout", logoutUser);
  
  // For development/testing purposes in case GitHub OAuth isn't available
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    // This is a fallback login route for testing
    // For this project, we simulate a successful login
    try {
      // Find an existing user or create a new one
      const githubId = req.body.githubId || "johndoe";
      let user = await storage.getUserByGithubId(githubId);

      if (!user) {
        // Create new user
        user = await storage.createUser({
          username: githubId,
          githubId,
          email: `${githubId}@example.com`,
          avatarUrl: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 1000000)}`,
          accessToken: "mock_github_token",
          walletAddress: null,
        });
      }

      // Set user in session
      req.session.userId = user.id;
      
      // Don't send sensitive data to the client
      const { accessToken, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Error in /api/auth/login:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // -------------------- GitHub Routes --------------------

  app.get("/api/github/repositories", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // In a real implementation, this would use the user's GitHub token to fetch repos
      // For this project, we'll return the repositories from our in-memory database
      const repos = await storage.listRepositories();
      res.json(repos);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      res.status(500).json({ message: "Failed to fetch repositories" });
    }
  });

  app.get("/api/repositories", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const repos = await storage.listRepositories();
      res.json(repos);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      res.status(500).json({ message: "Failed to fetch repositories" });
    }
  });

  app.get("/api/repositories/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const repo = await storage.getRepository(parseInt(req.params.id));
      if (!repo) {
        return res.status(404).json({ message: "Repository not found" });
      }
      res.json(repo);
    } catch (error) {
      console.error(`Error fetching repository ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch repository" });
    }
  });

  app.get("/api/repositories/:id/is-owner", isAuthenticated, async (req: Request, res: Response) => {
    // In a real implementation, this would check if the user is the owner or has admin rights
    // For this simulation, we'll always return true
    res.json(true);
  });

  app.get("/api/repositories/:id/pool", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const repoId = parseInt(req.params.id);
      const pool = await storage.getPoolByRepository(repoId);
      
      if (!pool) {
        return res.status(404).json({ message: "Pool not found" });
      }
      
      // Calculate the available balance and other stats
      const issues = await storage.listIssues({ repositoryId: repoId, hasBounty: true });
      const totalBounties = issues.reduce((sum, issue) => sum + issue.reward, 0);
      
      res.json({
        totalBalance: pool.balance,
        availableBalance: pool.balance - totalBounties,
        dailyDeposited: pool.dailyDeposited,
        activeBounties: issues.length,
        totalPaid: 0, // In a real implementation, this would be calculated
      });
    } catch (error) {
      console.error(`Error fetching pool for repository ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch pool data" });
    }
  });

  app.post("/api/repositories/:id/fund", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const repoId = parseInt(req.params.id);
      const amount = parseInt(req.body.amount);
      
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      
      let pool = await storage.getPoolByRepository(repoId);
      
      if (!pool) {
        // Create a new pool
        pool = await storage.createPool({
          repositoryId: repoId,
          managerId: req.session.userId!,
          balance: amount,
          dailyDeposited: amount,
          lastDepositTime: new Date(),
          isActive: true,
          contractAddress: null,
        });
      } else {
        // Update existing pool
        const currentDate = new Date();
        const lastDepositDate = pool.lastDepositTime ? new Date(pool.lastDepositTime) : null;
        
        // Reset daily deposit if it's a new day
        let dailyDeposited = pool.dailyDeposited || 0;
        if (lastDepositDate && 
            lastDepositDate.getDate() !== currentDate.getDate() ||
            lastDepositDate.getMonth() !== currentDate.getMonth() ||
            lastDepositDate.getFullYear() !== currentDate.getFullYear()) {
          dailyDeposited = 0;
        }
        
        // Check daily deposit limit
        if (dailyDeposited + amount > 1000) {
          return res.status(400).json({ 
            message: "Daily deposit limit exceeded",
            remaining: 1000 - dailyDeposited
          });
        }
        
        // Update pool
        pool = await storage.updatePool(pool.id, {
          balance: (pool.balance || 0) + amount,
          dailyDeposited: dailyDeposited + amount,
          lastDepositTime: currentDate,
        });
      }
      
      // In a real implementation, this would call the blockchain to transfer tokens
      
      res.json({ success: true, pool });
    } catch (error) {
      console.error(`Error funding repository ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fund repository" });
    }
  });

  app.get("/api/repositories/:id/issues", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const repoId = parseInt(req.params.id);
      const issues = await storage.listIssues({ repositoryId: repoId });
      res.json(issues);
    } catch (error) {
      console.error(`Error fetching issues for repository ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch issues" });
    }
  });

  // -------------------- Issue Routes --------------------

  app.get("/api/issues", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Get all issues with bounties
      const issues = await storage.listIssues({ hasBounty: true });
      
      // Enrich with repository info
      const enrichedIssues = await Promise.all(issues.map(async (issue) => {
        const repo = await storage.getRepository(issue.repositoryId);
        return {
          id: issue.id,
          title: issue.title,
          description: issue.description,
          repository: repo?.fullName || "unknown/repo",
          url: issue.url,
          reward: issue.reward,
          type: issue.type,
          labels: [], // In a real implementation, this would come from GitHub
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
        };
      }));
      
      res.json(enrichedIssues);
    } catch (error) {
      console.error("Error fetching issues:", error);
      res.status(500).json({ message: "Failed to fetch issues" });
    }
  });

  app.get("/api/issues/featured", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Get all issues with bounties, but limit to 4 for featured list
      const issues = await storage.listIssues({ hasBounty: true });
      
      // Sort by reward and take top 4
      const featuredIssues = issues
        .sort((a, b) => b.reward - a.reward)
        .slice(0, 4);
      
      // Enrich with repository info
      const enrichedIssues = await Promise.all(featuredIssues.map(async (issue) => {
        const repo = await storage.getRepository(issue.repositoryId);
        return {
          id: issue.id,
          title: issue.title,
          description: issue.description,
          repository: repo?.fullName || "unknown/repo",
          url: issue.url,
          reward: issue.reward,
          type: issue.type,
          labels: [], // In a real implementation, this would come from GitHub
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
        };
      }));
      
      res.json(enrichedIssues);
    } catch (error) {
      console.error("Error fetching featured issues:", error);
      res.status(500).json({ message: "Failed to fetch featured issues" });
    }
  });

  app.post("/api/issues/:id/claim", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const issueId = parseInt(req.params.id);
      const userId = req.session.userId!;
      
      // Check if issue exists and has a bounty
      const issue = await storage.getIssue(issueId);
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }
      
      if (!issue.hasBounty) {
        return res.status(400).json({ message: "Issue does not have a bounty" });
      }
      
      // Check if issue is already claimed by this user
      const existingClaim = await storage.getClaimByUserAndIssue(userId, issueId);
      if (existingClaim) {
        return res.status(400).json({ message: "You have already claimed this issue" });
      }
      
      // Create a new claim
      const claim = await storage.createClaim({
        userId,
        issueId,
        status: "claimed",
        prUrl: null,
        prNumber: null,
        transactionHash: null,
        completedAt: null,
      });
      
      // In a real implementation, this would call the blockchain to claim the bounty
      
      res.json({ success: true, claim });
    } catch (error) {
      console.error(`Error claiming issue ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to claim issue" });
    }
  });

  app.post("/api/issues/:id/set-bounty", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const issueId = parseInt(req.params.id);
      const amount = parseInt(req.body.amount);
      
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      
      // Check if issue exists
      const issue = await storage.getIssue(issueId);
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }
      
      // Check if pool has enough funds
      const pool = await storage.getPoolByRepository(issue.repositoryId);
      if (!pool) {
        return res.status(404).json({ message: "Repository pool not found" });
      }
      
      // Calculate available balance
      const issues = await storage.listIssues({ repositoryId: issue.repositoryId, hasBounty: true });
      const totalBounties = issues.reduce((sum, i) => sum + (i.id !== issueId ? i.reward : 0), 0);
      const availableBalance = pool.balance - totalBounties;
      
      if (amount > availableBalance) {
        return res.status(400).json({ 
          message: "Insufficient pool funds",
          available: availableBalance
        });
      }
      
      // Update the issue with bounty info
      const updatedIssue = await storage.updateIssue(issueId, {
        hasBounty: true,
        reward: amount,
        bountyAddedAt: new Date(),
      });
      
      // In a real implementation, this would call the blockchain to set the bounty
      
      res.json({ success: true, issue: updatedIssue });
    } catch (error) {
      console.error(`Error setting bounty for issue ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to set bounty" });
    }
  });

  // -------------------- Claim Routes --------------------

  app.get("/api/claims", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId!;
      const claims = await storage.listUserClaims(userId);
      
      // Enrich with issue and repository info
      const enrichedClaims = await Promise.all(claims.map(async (claim) => {
        const issue = await storage.getIssue(claim.issueId);
        const repo = issue ? await storage.getRepository(issue.repositoryId) : null;
        
        return {
          id: claim.id,
          issue: {
            id: issue?.id,
            title: issue?.title,
            url: issue?.url,
            reward: issue?.reward,
          },
          repository: repo?.fullName || "unknown/repo",
          status: claim.status,
          prUrl: claim.prUrl,
          prNumber: claim.prNumber,
          createdAt: claim.createdAt,
          updatedAt: claim.updatedAt,
        };
      }));
      
      res.json(enrichedClaims);
    } catch (error) {
      console.error("Error fetching claims:", error);
      res.status(500).json({ message: "Failed to fetch claims" });
    }
  });

  app.get("/api/claims/recent", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId!;
      const claims = await storage.listUserClaims(userId);
      
      // Sort by most recent and take top 3
      const recentClaims = claims
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
      
      // Enrich with issue and repository info
      const enrichedClaims = await Promise.all(recentClaims.map(async (claim) => {
        const issue = await storage.getIssue(claim.issueId);
        const repo = issue ? await storage.getRepository(issue.repositoryId) : null;
        
        return {
          id: claim.id,
          repository: repo?.fullName || "unknown/repo",
          issueNumber: issue?.issueNumber || 0,
          issueTitle: issue?.title || "Unknown Issue",
          reward: issue?.reward || 0,
          status: claim.status,
          prUrl: claim.prUrl,
          prNumber: claim.prNumber,
          createdAt: claim.createdAt,
        };
      }));
      
      res.json(enrichedClaims);
    } catch (error) {
      console.error("Error fetching recent claims:", error);
      res.status(500).json({ message: "Failed to fetch recent claims" });
    }
  });

  app.post("/api/claims/:id/link-pr", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const claimId = parseInt(req.params.id);
      const { prUrl } = req.body;
      
      if (!prUrl) {
        return res.status(400).json({ message: "PR URL is required" });
      }
      
      // Extract PR number from URL
      const prNumberMatch = prUrl.match(/\/pull\/(\d+)/);
      if (!prNumberMatch) {
        return res.status(400).json({ message: "Invalid PR URL format" });
      }
      
      const prNumber = parseInt(prNumberMatch[1]);
      
      // Check if claim exists and belongs to user
      const claim = await storage.getClaim(claimId);
      if (!claim) {
        return res.status(404).json({ message: "Claim not found" });
      }
      
      if (claim.userId !== req.session.userId) {
        return res.status(403).json({ message: "You do not own this claim" });
      }
      
      if (claim.status !== "claimed") {
        return res.status(400).json({ message: "Claim is not in the 'claimed' state" });
      }
      
      // Update the claim with PR info
      const updatedClaim = await storage.updateClaim(claimId, {
        status: "submitted",
        prUrl,
        prNumber,
      });
      
      // In a real implementation, this would notify the repository owner
      
      res.json({ success: true, claim: updatedClaim });
    } catch (error) {
      console.error(`Error linking PR to claim ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to link PR" });
    }
  });

  // -------------------- Dashboard Routes --------------------

  app.get("/api/dashboard", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId!;
      
      // Get user claims
      const claims = await storage.listUserClaims(userId);
      
      // Calculate total earnings from completed claims
      const completedClaims = claims.filter(claim => claim.status === "completed");
      let totalEarnings = 0;
      
      for (const claim of completedClaims) {
        const issue = await storage.getIssue(claim.issueId);
        if (issue) {
          totalEarnings += issue.reward;
        }
      }
      
      // Count pending claims (claimed or submitted)
      const pendingClaims = claims.filter(claim => 
        claim.status === "claimed" || 
        claim.status === "submitted" || 
        claim.status === "review"
      ).length;
      
      res.json({
        totalEarnings,
        completedBounties: completedClaims.length,
        pendingClaims,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  app.get("/api/charts/rewards", isAuthenticated, async (req: Request, res: Response) => {
    const period = req.query.period || "week";
    
    try {
      // Generate sample chart data based on the period
      let data: { label: string; value: number }[] = [];
      
      if (period === "week") {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        data = days.map(day => ({
          label: day,
          value: Math.floor(Math.random() * 100),
        }));
        
        // Make Thursday the highest for the design reference
        data[3].value = 90;
      } else if (period === "month") {
        // Generate data for the last 4 weeks
        data = Array.from({ length: 4 }).map((_, i) => ({
          label: `Week ${i + 1}`,
          value: Math.floor(Math.random() * 400),
        }));
      } else if (period === "year") {
        // Generate data for the last 12 months
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        data = months.map(month => ({
          label: month,
          value: Math.floor(Math.random() * 1000),
        }));
      }
      
      res.json({ data });
    } catch (error) {
      console.error("Error fetching chart data:", error);
      res.status(500).json({ message: "Failed to fetch chart data" });
    }
  });

  app.get("/api/history", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId!;
      const claims = await storage.listUserClaims(userId);
      
      // Simulate some completed and other types of claims
      const historyItems = await Promise.all(claims.map(async (claim, index) => {
        const issue = await storage.getIssue(claim.issueId);
        const repo = issue ? await storage.getRepository(issue.repositoryId) : null;
        
        // For demo purposes, we'll create some variety in statuses
        let status = claim.status;
        let completedAt = claim.completedAt;
        
        // For the first claim, simulate it as completed if it's not already
        if (index === 0 && status !== "completed") {
          status = "completed";
          completedAt = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
        }
        // For the second claim, simulate it as rejected if it's not already
        else if (index === 1 && status !== "rejected") {
          status = "rejected";
          completedAt = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
        }
        
        return {
          id: claim.id,
          repository: repo?.fullName || "unknown/repo",
          issue: {
            id: issue?.id,
            title: issue?.title,
            url: issue?.url,
            reward: issue?.reward,
          },
          status,
          prUrl: claim.prUrl,
          prNumber: claim.prNumber,
          transactionHash: status === "completed" ? "0x123...456" : null,
          transactionUrl: status === "completed" ? "https://goerli.basescan.org/tx/0x123...456" : null,
          completedAt,
          updatedAt: claim.updatedAt,
        };
      }));
      
      // Sort by completed date, most recent first
      historyItems.sort((a, b) => {
        const dateA = a.completedAt || a.updatedAt;
        const dateB = b.completedAt || b.updatedAt;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
      
      res.json(historyItems);
    } catch (error) {
      console.error("Error fetching history:", error);
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  app.get("/api/labels/popular", isAuthenticated, async (req: Request, res: Response) => {
    // Sample popular labels
    const popularLabels = ["bug", "feature", "documentation", "enhancement", "good-first-issue", "help-wanted", "security"];
    res.json(popularLabels);
  });

  return httpServer;
}
