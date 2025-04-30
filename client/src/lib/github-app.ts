/**
 * Helper functions and constants for GitHub App integration
 */

// Import environment variable for GitHub App name
const GITHUB_APP_NAME = import.meta.env.VITE_GITHUB_APP_NAME || 'codecrewai';

/**
 * Get the GitHub App installation URL
 */
export function getGitHubAppInstallUrl() {
  return `https://github.com/apps/${GITHUB_APP_NAME}/installations/new`;
}

/**
 * Get repository-specific GitHub App installation URL
 * 
 * @param owner The GitHub organization or username that owns the repository
 */
export function getRepoGitHubAppInstallUrl(owner: string) {
  return `https://github.com/apps/${GITHUB_APP_NAME}/installations/new/permissions?target_id=${owner}`;
}

/**
 * Constants for GitHub App integration
 */
export const GITHUB_APP = {
  name: GITHUB_APP_NAME,
  installUrl: getGitHubAppInstallUrl(),
  configUrl: `https://github.com/apps/${GITHUB_APP_NAME}/installations/new`,
  
  // GitHub webhook command prefixes
  commands: {
    claim: '!codecrew claim',
    bounty: '!codecrew bounty',
  }
};