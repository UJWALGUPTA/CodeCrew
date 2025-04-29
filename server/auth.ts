import { Request, Response } from "express";
import { storage } from "./storage";
import { githubClient } from "./github";

// Extend express-session to include our custom data
declare module "express-session" {
  interface SessionData {
    userId?: number;
    oauthState?: string;
  }
}

// GitHub OAuth Configuration
// In a real application, these would be environment variables
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "your_github_client_id";
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "your_github_client_secret";
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/api/auth/github/callback";

export const startGithubOAuth = (req: Request, res: Response) => {
  // Create a random state to prevent CSRF attacks
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store the state in the session for verification later
  req.session.oauthState = state;
  
  // Redirect to GitHub's authorization page
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_CALLBACK_URL)}&scope=user%20repo&state=${state}`;
  
  res.redirect(githubAuthUrl);
};

export const handleGithubCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;
  
  // Verify state to prevent CSRF attacks
  if (!state || state !== req.session.oauthState) {
    return res.status(400).json({ message: "Invalid state parameter" });
  }
  
  try {
    // Exchange code for access token
    // In a real app, we would call GitHub's API to exchange the code for a token
    // For this simulation, we'll mock the token exchange
    
    // To implement the real exchange:
    // const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Accept": "application/json"
    //   },
    //   body: JSON.stringify({
    //     client_id: GITHUB_CLIENT_ID,
    //     client_secret: GITHUB_CLIENT_SECRET,
    //     code,
    //     redirect_uri: GITHUB_CALLBACK_URL
    //   })
    // });
    // const tokenData = await tokenResponse.json();
    // const accessToken = tokenData.access_token;
    
    // For this demo, we'll use a mock access token
    const accessToken = "mock_github_token";
    
    // Get user data from GitHub
    const userData = await githubClient.getUserData(accessToken);
    
    // Find or create user
    let user = await storage.getUserByGithubId(userData.id.toString());
    
    if (!user) {
      // Create a new user
      user = await storage.createUser({
        username: userData.login,
        githubId: userData.id.toString(),
        email: userData.email,
        avatarUrl: userData.avatar_url,
        accessToken,
        walletAddress: null,
      });
    } else {
      // Update existing user with new token
      user = await storage.updateUser(user.id, {
        accessToken,
        avatarUrl: userData.avatar_url,
        email: userData.email,
      });
    }
    
    // Set user in session
    if (user) {
      req.session.userId = user.id;
    }
    
    // Redirect to client app
    res.redirect("/");
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to logout" });
    }
    res.json({ message: "Logged out successfully" });
  });
};