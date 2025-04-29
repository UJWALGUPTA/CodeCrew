import { storage } from "./storage";
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

// GitHub client for the ROXONN project - enhanced with GitHub App support
class GitHubClient {
  private appId: string;
  private privateKey: string;
  private webhookSecret: string;
  
  constructor() {
    // Set up GitHub App credentials
    this.appId = process.env.GITHUB_APP_ID || '';
    this.privateKey = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';
    this.webhookSecret = process.env.GITHUB_WEBHOOK_SECRET || '';
    
    if (!this.appId || !this.privateKey || !this.webhookSecret) {
      console.warn('GitHub App credentials missing. Some functionality may not work.');
    }
  }
  
  /**
   * Generate a JWT for GitHub App authentication
   */
  private generateJWT(): string {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iat: now - 60, // Issued 60 seconds in the past to allow for clock drift
      exp: now + (10 * 60), // Expires in 10 minutes
      iss: this.appId
    };
    
    return jwt.sign(payload, this.privateKey, { algorithm: 'RS256' });
  }
  
  /**
   * Get an installation access token for a specific repository installation
   */
  async getInstallationToken(installationId: number): Promise<string> {
    const jwt = this.generateJWT();
    
    const response = await fetch(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error("GitHub API error:", error);
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.token;
  }
  
  /**
   * Get the installation ID for a repository
   */
  async getInstallationIdForRepo(owner: string, repo: string): Promise<number> {
    const jwt = this.generateJWT();
    
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/installation`, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error("GitHub API error:", error);
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.id;
  }
  
  /**
   * Verify the signature of a webhook payload
   */
  verifyWebhookSignature(payload: string, signatureHeader: string): boolean {
    if (!signatureHeader || !this.webhookSecret) return false;
    
    const signature = Buffer.from(signatureHeader.replace('sha256=', ''), 'hex');
    const hmac = crypto.createHmac('sha256', this.webhookSecret);
    const digest = Buffer.from(hmac.update(payload).digest('hex'), 'hex');
    
    if (signature.length !== digest.length) return false;
    
    return crypto.timingSafeEqual(signature, digest);
  }
  
  /**
   * Add a comment to an issue as the GitHub App
   */
  async addIssueComment(owner: string, repo: string, issueNumber: number, comment: string): Promise<any> {
    try {
      const installationId = await this.getInstallationIdForRepo(owner, repo);
      const token = await this.getInstallationToken(installationId);
      
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: comment })
      });
      
      if (!response.ok) {
        const error = await response.text();
        console.error("GitHub API error:", error);
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error("Failed to add comment:", error);
      throw error;
    }
  }
  
  /**
   * Add a label to an issue as the GitHub App
   */
  async addIssueLabel(owner: string, repo: string, issueNumber: number, labels: string[]): Promise<any> {
    try {
      const installationId = await this.getInstallationIdForRepo(owner, repo);
      const token = await this.getInstallationToken(installationId);
      
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/labels`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ labels })
      });
      
      if (!response.ok) {
        const error = await response.text();
        console.error("GitHub API error:", error);
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error("Failed to add labels:", error);
      throw error;
    }
  }
  async getUserData(accessToken: string) {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json"
      }
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error("GitHub API error:", error);
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return response.json();
  }

  async getUserRepositories(accessToken: string) {
    const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json"
      }
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error("GitHub API error:", error);
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return response.json();
  }

  async getRepositoryIssues(owner: string, repo: string, accessToken: string) {
    // In a real implementation, this would call the GitHub API
    // For this project, we'll return issues from our database
    const repository = await storage.getRepositoryByFullName(`${owner}/${repo}`);
    if (!repository) {
      throw new Error("Repository not found");
    }

    const issues = await storage.listIssues({ repositoryId: repository.id });
    return issues.map(issue => ({
      id: issue.id,
      number: issue.issueNumber,
      title: issue.title,
      body: issue.description,
      html_url: issue.url,
      state: issue.state,
      labels: [
        { name: issue.type }
      ],
      created_at: issue.createdAt.toISOString(),
      updated_at: issue.updatedAt.toISOString(),
    }));
  }

  async createWebhook(owner: string, repo: string, accessToken: string, webhookUrl: string) {
    console.log(`Setting up webhook for ${owner}/${repo} to ${webhookUrl}`);
    
    try {
      // Check if webhook already exists for this repo
      const hooksResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/hooks`, {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!hooksResponse.ok) {
        throw new Error(`GitHub API error: ${hooksResponse.status} ${await hooksResponse.text()}`);
      }
      
      const hooks = await hooksResponse.json();
      
      // Check if we already have a webhook with this URL
      const existingHook = hooks.find((hook: any) => hook.config.url === webhookUrl);
      if (existingHook) {
        console.log(`Webhook already exists for ${owner}/${repo} with ID ${existingHook.id}`);
        return existingHook;
      }
      
      // Create new webhook
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/hooks`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'web',
          active: true,
          events: ['issues', 'issue_comment', 'pull_request'],
          config: {
            url: webhookUrl,
            content_type: 'json',
            insecure_ssl: '0',
            secret: process.env.GITHUB_WEBHOOK_SECRET
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${await response.text()}`);
      }
      
      const webhook = await response.json();
      console.log(`Created webhook for ${owner}/${repo} with ID ${webhook.id}`);
      return webhook;
    } catch (error) {
      console.error('Error creating webhook:', error);
      throw new Error(`Failed to create webhook: ${error.message}`);
    }
  }

  // This method is deprecated and kept for backward compatibility
  async verifyWebhookSignatureOld(payload: any, signature: string, secret: string) {
    console.warn("Using deprecated verifyWebhookSignature method, consider upgrading to the new version");
    // For backward compatibility, defer to the new signature verification method
    return this.verifyWebhookSignature(JSON.stringify(payload), signature);
  }

  async getIssue(owner: string, repo: string, issueNumber: number, accessToken: string) {
    // In a real implementation, this would call the GitHub API
    // For this project, we'll return an issue from our database
    const repository = await storage.getRepositoryByFullName(`${owner}/${repo}`);
    if (!repository) {
      throw new Error("Repository not found");
    }

    const issue = await storage.getIssueByRepoAndNumber(repository.id, issueNumber);
    if (!issue) {
      throw new Error("Issue not found");
    }

    return {
      id: issue.id,
      number: issue.issueNumber,
      title: issue.title,
      body: issue.description,
      html_url: issue.url,
      state: issue.state,
      labels: [
        { name: issue.type }
      ],
      created_at: issue.createdAt.toISOString(),
      updated_at: issue.updatedAt.toISOString(),
    };
  }

  async getPullRequest(owner: string, repo: string, prNumber: number, accessToken: string) {
    // In a real implementation, this would call the GitHub API
    // For this project, we'll return mock data
    return {
      id: prNumber,
      number: prNumber,
      title: `Fix issue #${prNumber}`,
      body: "This PR fixes the issue",
      html_url: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
      state: "open",
      user: {
        login: "johndoe",
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      merged: false,
      merged_at: null,
    };
  }

  async checkPullRequestStatus(owner: string, repo: string, prNumber: number, accessToken: string) {
    // In a real implementation, this would call the GitHub API
    // For this project, we'll return mock data
    return {
      state: "open",
      merged: false,
      mergeable: true,
      rebaseable: true,
    };
  }

  async mergePullRequest(owner: string, repo: string, prNumber: number, accessToken: string) {
    // In a real implementation, this would call the GitHub API
    // For this project, we'll return mock data
    return {
      merged: true,
      message: "Pull request successfully merged",
      sha: "abc123",
    };
  }
}

export const githubClient = new GitHubClient();
