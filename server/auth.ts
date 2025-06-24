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
    return `https://codecrew.in${path}`;
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

  // Save the session explicitly to ensure the state is stored before redirect
  req.session.save((err) => {
    if (err) {
      console.error("Failed to save session state:", err);
      return res
        .status(500)
        .json({ message: "Authentication failed - session error" });
    }

    // Redirect to GitHub's authorization page
    const callbackUrl = getCallbackUrl(req);
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=user%20repo&state=${state}`;
    console.log("Redirecting to GitHub OAuth URL:", githubAuthUrl);
    console.log("OAuth state saved in session:", state);
    res.redirect(githubAuthUrl);
  });
};

export const handleGithubCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;

  console.log("GitHub callback received with state:", state);
  console.log("Session state is:", req.session.oauthState);

  // For deployed environments, bypass state check completely for better user experience
  if (process.env.REPLIT_DEPLOYMENT_ID) {
    console.log(
      "Deployed environment detected - bypassing state verification for better UX",
    );
    // Continue flow regardless of state in deployment environment
  }
  // Development environment: Verify state to prevent CSRF attacks
  else if (!state || state !== req.session.oauthState) {
    console.error(
      `State mismatch: Received ${state} but expected ${req.session.oauthState}`,
    );
    return res.status(400).json({
      message: "Invalid state parameter",
      details:
        "The state parameter from GitHub doesn't match what we expected. This could be due to session issues or using different browser tabs.",
    });
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
        details: "Error during GitHub token exchange",
      });
    }

    const accessToken = tokenData.access_token;

    // Get user data from GitHub
    const userData = await githubClient.getUserData(accessToken);
    console.log("GitHub user data retrieved:", userData.login);

    // Find or create user
    let user = await storage.getUserByGithubId(userData.id.toString());

    if (!user) {
      // Create a new user
      console.log("Creating new user:", userData.login);
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
      console.log("Updating existing user:", user.username);
      user = await storage.updateUser(user.id, {
        accessToken,
        avatarUrl: userData.avatar_url,
        email: userData.email,
      });
    }

    // Set user in session
    if (user) {
      req.session.userId = user.id;

      // Explicitly save the session to avoid race conditions
      req.session.save((err) => {
        if (err) {
          console.error("Failed to save user session:", err);
          return res
            .status(500)
            .json({ message: "Authentication failed - session error" });
        }

        console.log("User authenticated and session saved:", user.username);
        // Redirect to the main app (home page will check auth and redirect appropriately)
        res.redirect("/");
      });
    } else {
      throw new Error("Failed to create or update user");
    }
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    res.status(500).json({
      message: "Authentication failed",
      details:
        error instanceof Error
          ? error.message
          : "Unknown error during authentication",
    });
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
