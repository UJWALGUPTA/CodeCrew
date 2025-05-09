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
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Get the URL from environment or construct from request
// This function can be used for both OAuth callbacks and webhook URLs
export function getReplicationUrl(req: Request, path: string) {
  if (process.env.REPLIT_DEPLOYMENT_ID) {
    // We're on a deployed Replit instance
    return `https://${process.env.REPLIT_DOMAINS?.split(",")[0] || req.headers.host}${path}`;
  } else {
    // We're in development
    return `http://${req.headers.host}${path}`;
  }
}

// Get the OAuth callback URL
function getCallbackUrl(req: Request) {
  return getReplicationUrl(req, "/api/auth/github/callback");
}

export const startGithubOAuth = (req: Request, res: Response) => {
  // Create a random state to prevent CSRF attacks
  const state = Math.random().toString(36).substring(2, 15);

  // Store the state in the session for verification later
  req.session.oauthState = state;

  // Redirect to GitHub's authorization page
  const callbackUrl = getCallbackUrl(req);
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=user%20repo&state=${state}`;
  console.log("Redirecting to GitHub OAuth URL:", githubAuthUrl);
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
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: getCallbackUrl(req),
        }),
      },
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("GitHub OAuth error:", tokenData.error);
      return res.status(400).json({
        message: tokenData.error_description || "Authentication failed",
      });
    }

    const accessToken = tokenData.access_token;

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

    // Redirect to dashboard
    res.redirect("/dashboard");
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
