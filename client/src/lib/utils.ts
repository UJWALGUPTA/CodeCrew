import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function formatTokenAmount(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const githubRepoToId = (owner: string, repo: string): string => {
  return btoa(`${owner}/${repo}`);
};

export const idToGithubRepo = (id: string): { owner: string, repo: string } => {
  try {
    const decoded = atob(id);
    const [owner, repo] = decoded.split('/');
    return { owner, repo };
  } catch (e) {
    return { owner: '', repo: '' };
  }
};

export function getIssueTypeLabel(type: string): string {
  switch (type?.toLowerCase()) {
    case 'bug':
      return 'Bug Fix';
    case 'feature':
      return 'Feature';
    case 'docs':
      return 'Documentation';
    case 'enhancement':
      return 'Enhancement';
    default:
      return type || 'Issue';
  }
}

export function getIssueTypeColor(type: string): { bg: string, text: string } {
  switch (type?.toLowerCase()) {
    case 'bug':
      return { bg: 'bg-destructive/20', text: 'text-destructive' };
    case 'feature':
      return { bg: 'bg-primary/20', text: 'text-primary' };
    case 'docs':
      return { bg: 'bg-orange-500/20', text: 'text-orange-500' };
    case 'enhancement':
      return { bg: 'bg-secondary/20', text: 'text-secondary' };
    default:
      return { bg: 'bg-muted', text: 'text-muted-foreground' };
  }
}

export const STATUS_COLORS = {
  claimed: { bg: 'bg-primary/20', text: 'text-primary' },
  submitted: { bg: 'bg-orange-500/20', text: 'text-orange-500' },
  review: { bg: 'bg-secondary/20', text: 'text-secondary' },
  completed: { bg: 'bg-secondary', text: 'text-secondary-foreground' },
  rejected: { bg: 'bg-destructive', text: 'text-destructive-foreground' },
  expired: { bg: 'bg-muted', text: 'text-muted-foreground' }
};
