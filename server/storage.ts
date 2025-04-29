import { 
  users, type User, type InsertUser,
  repositories, type Repository, type InsertRepository,
  pools, type Pool, type InsertPool,
  issues, type Issue, type InsertIssue,
  claims, type Claim, type InsertClaim
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Interface for all storage methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByGithubId(githubId: string): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Repository methods
  getRepository(id: number): Promise<Repository | undefined>;
  getRepositoryByFullName(fullName: string): Promise<Repository | undefined>;
  listRepositories(): Promise<Repository[]>;
  listUserRepositories(ownerId: number): Promise<Repository[]>;
  createRepository(repo: InsertRepository): Promise<Repository>;
  updateRepository(id: number, updates: Partial<Repository>): Promise<Repository | undefined>;

  // Pool methods
  getPool(id: number): Promise<Pool | undefined>;
  getPoolByRepository(repositoryId: number): Promise<Pool | undefined>;
  createPool(pool: InsertPool): Promise<Pool>;
  updatePool(id: number, updates: Partial<Pool>): Promise<Pool | undefined>;

  // Issue methods
  getIssue(id: number): Promise<Issue | undefined>;
  getIssueByRepoAndNumber(repositoryId: number, issueNumber: number): Promise<Issue | undefined>;
  listIssues(filter?: { repositoryId?: number, hasBounty?: boolean }): Promise<Issue[]>;
  createIssue(issue: InsertIssue): Promise<Issue>;
  updateIssue(id: number, updates: Partial<Issue>): Promise<Issue | undefined>;

  // Claim methods
  getClaim(id: number): Promise<Claim | undefined>;
  getClaimByUserAndIssue(userId: number, issueId: number): Promise<Claim | undefined>;
  listUserClaims(userId: number): Promise<Claim[]>;
  createClaim(claim: InsertClaim): Promise<Claim>;
  updateClaim(id: number, updates: Partial<Claim>): Promise<Claim | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private repositories: Map<number, Repository>;
  private pools: Map<number, Pool>;
  private issues: Map<number, Issue>;
  private claims: Map<number, Claim>;
  
  // Auto-incrementing IDs
  private userId: number = 1;
  private repoId: number = 1;
  private poolId: number = 1;
  private issueId: number = 1;
  private claimId: number = 1;

  constructor() {
    this.users = new Map();
    this.repositories = new Map();
    this.pools = new Map();
    this.issues = new Map();
    this.claims = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample users
    const user1 = this.createUser({
      username: "johndoe",
      githubId: "johndoe123",
      email: "john.doe@example.com",
      avatarUrl: "https://avatars.githubusercontent.com/u/1234567",
      accessToken: "mock_access_token_1",
      walletAddress: "0x71C...F93A"
    });

    // Sample repositories
    const repo1 = this.createRepository({
      owner: "ethereum",
      name: "solidity",
      fullName: "ethereum/solidity",
      description: "Solidity, the Smart Contract Programming Language",
      url: "https://github.com/ethereum/solidity",
      stars: 3500,
      forks: 900,
      openIssues: 250,
      isPrivate: false
    });

    const repo2 = this.createRepository({
      owner: "coinbase",
      name: "base-contracts",
      fullName: "coinbase/base-contracts",
      description: "Smart contracts for Base blockchain",
      url: "https://github.com/coinbase/base-contracts",
      stars: 1200,
      forks: 300,
      openIssues: 85,
      isPrivate: false
    });

    const repo3 = this.createRepository({
      owner: "uniswap",
      name: "v3-periphery",
      fullName: "uniswap/v3-periphery",
      description: "Peripheral smart contracts for interacting with Uniswap v3",
      url: "https://github.com/uniswap/v3-periphery",
      stars: 2800,
      forks: 750,
      openIssues: 120,
      isPrivate: false
    });

    const repo4 = this.createRepository({
      owner: "my-cool-project",
      name: "web3-tools",
      fullName: "my-cool-project/web3-tools",
      description: "Tools for Web3 development",
      url: "https://github.com/my-cool-project/web3-tools",
      stars: 450,
      forks: 120,
      openIssues: 35,
      isPrivate: false
    });

    // Sample pools
    const pool1 = this.createPool({
      repositoryId: repo1.id,
      managerId: user1.id,
      balance: 500,
      dailyDeposited: 200,
      lastDepositTime: new Date(),
      isActive: true,
      contractAddress: "0x123...",
    });

    const pool2 = this.createPool({
      repositoryId: repo2.id,
      managerId: user1.id,
      balance: 800,
      dailyDeposited: 300,
      lastDepositTime: new Date(),
      isActive: true,
      contractAddress: "0x456...",
    });

    // Sample issues
    const issue1 = this.createIssue({
      repositoryId: repo1.id,
      issueNumber: 1234,
      title: "Fix memory leak in compiler optimization",
      description: "The optimizer has a potential memory leak when handling complex nested function calls. Need to identify and fix the issue.",
      url: "https://github.com/ethereum/solidity/issues/1234",
      state: "open",
      type: "bug",
      hasBounty: true,
      reward: 200,
      bountyAddedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    });

    const issue2 = this.createIssue({
      repositoryId: repo2.id,
      issueNumber: 456,
      title: "Implement EIP-4337 account abstraction",
      description: "Add support for EIP-4337 account abstraction to enable gasless transactions and social recovery for wallets on Base.",
      url: "https://github.com/coinbase/base-contracts/issues/456",
      state: "open",
      type: "feature",
      hasBounty: true,
      reward: 500,
      bountyAddedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    });

    const issue3 = this.createIssue({
      repositoryId: repo3.id,
      issueNumber: 789,
      title: "Improve custom pool creation docs",
      description: "Update the documentation for creating custom liquidity pools with detailed examples and best practices.",
      url: "https://github.com/uniswap/v3-periphery/issues/789",
      state: "open",
      type: "docs",
      hasBounty: true,
      reward: 75,
      bountyAddedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    });

    const issue4 = this.createIssue({
      repositoryId: repo4.id,
      issueNumber: 321,
      title: "Fix security vulnerability in wallet connect",
      description: "Patch a critical security vulnerability in the wallet connection flow that could allow unauthorized access.",
      url: "https://github.com/my-cool-project/web3-tools/issues/321",
      state: "open",
      type: "bug",
      hasBounty: true,
      reward: 350,
      bountyAddedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    });

    // Sample claims
    const claim1 = this.createClaim({
      userId: user1.id,
      issueId: issue1.id,
      status: "submitted",
      prUrl: "https://github.com/ethereum/solidity/pull/456",
      prNumber: 456,
      transactionHash: null,
      completedAt: null,
    });

    const claim2 = this.createClaim({
      userId: user1.id,
      issueId: issue3.id,
      status: "review",
      prUrl: "https://github.com/uniswap/v3-periphery/pull/890",
      prNumber: 890,
      transactionHash: null,
      completedAt: null,
    });

    const claim3 = this.createClaim({
      userId: user1.id,
      issueId: issue4.id,
      status: "claimed",
      prUrl: null,
      prNumber: null,
      transactionHash: null,
      completedAt: null,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByGithubId(githubId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.githubId === githubId
    );
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now, updatedAt: now };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Repository methods
  async getRepository(id: number): Promise<Repository | undefined> {
    return this.repositories.get(id);
  }

  async getRepositoryByFullName(fullName: string): Promise<Repository | undefined> {
    return Array.from(this.repositories.values()).find(
      (repo) => repo.fullName === fullName
    );
  }

  async listRepositories(): Promise<Repository[]> {
    return Array.from(this.repositories.values());
  }

  async listUserRepositories(ownerId: number): Promise<Repository[]> {
    // In a real implementation, this would filter by repositories the user can access
    // For now, we'll return all repositories
    return this.listRepositories();
  }

  async createRepository(insertRepo: InsertRepository): Promise<Repository> {
    const id = this.repoId++;
    const now = new Date();
    const repo: Repository = { ...insertRepo, id, createdAt: now, updatedAt: now };
    this.repositories.set(id, repo);
    return repo;
  }

  async updateRepository(id: number, updates: Partial<Repository>): Promise<Repository | undefined> {
    const repo = this.repositories.get(id);
    if (!repo) return undefined;
    
    const updatedRepo = { ...repo, ...updates, updatedAt: new Date() };
    this.repositories.set(id, updatedRepo);
    return updatedRepo;
  }

  // Pool methods
  async getPool(id: number): Promise<Pool | undefined> {
    return this.pools.get(id);
  }

  async getPoolByRepository(repositoryId: number): Promise<Pool | undefined> {
    return Array.from(this.pools.values()).find(
      (pool) => pool.repositoryId === repositoryId
    );
  }

  async createPool(insertPool: InsertPool): Promise<Pool> {
    const id = this.poolId++;
    const now = new Date();
    const pool: Pool = { ...insertPool, id, createdAt: now, updatedAt: now };
    this.pools.set(id, pool);
    return pool;
  }

  async updatePool(id: number, updates: Partial<Pool>): Promise<Pool | undefined> {
    const pool = this.pools.get(id);
    if (!pool) return undefined;
    
    const updatedPool = { ...pool, ...updates, updatedAt: new Date() };
    this.pools.set(id, updatedPool);
    return updatedPool;
  }

  // Issue methods
  async getIssue(id: number): Promise<Issue | undefined> {
    return this.issues.get(id);
  }

  async getIssueByRepoAndNumber(repositoryId: number, issueNumber: number): Promise<Issue | undefined> {
    return Array.from(this.issues.values()).find(
      (issue) => issue.repositoryId === repositoryId && issue.issueNumber === issueNumber
    );
  }

  async listIssues(filter?: { repositoryId?: number, hasBounty?: boolean }): Promise<Issue[]> {
    let issues = Array.from(this.issues.values());
    
    if (filter) {
      if (filter.repositoryId !== undefined) {
        issues = issues.filter(issue => issue.repositoryId === filter.repositoryId);
      }
      
      if (filter.hasBounty !== undefined) {
        issues = issues.filter(issue => issue.hasBounty === filter.hasBounty);
      }
    }
    
    return issues;
  }

  async createIssue(insertIssue: InsertIssue): Promise<Issue> {
    const id = this.issueId++;
    const now = new Date();
    const issue: Issue = { ...insertIssue, id, createdAt: now, updatedAt: now };
    this.issues.set(id, issue);
    return issue;
  }

  async updateIssue(id: number, updates: Partial<Issue>): Promise<Issue | undefined> {
    const issue = this.issues.get(id);
    if (!issue) return undefined;
    
    const updatedIssue = { ...issue, ...updates, updatedAt: new Date() };
    this.issues.set(id, updatedIssue);
    return updatedIssue;
  }

  // Claim methods
  async getClaim(id: number): Promise<Claim | undefined> {
    return this.claims.get(id);
  }

  async getClaimByUserAndIssue(userId: number, issueId: number): Promise<Claim | undefined> {
    return Array.from(this.claims.values()).find(
      (claim) => claim.userId === userId && claim.issueId === issueId
    );
  }

  async listUserClaims(userId: number): Promise<Claim[]> {
    return Array.from(this.claims.values()).filter(
      (claim) => claim.userId === userId
    );
  }

  async createClaim(insertClaim: InsertClaim): Promise<Claim> {
    const id = this.claimId++;
    const now = new Date();
    const claim: Claim = { ...insertClaim, id, createdAt: now, updatedAt: now };
    this.claims.set(id, claim);
    return claim;
  }

  async updateClaim(id: number, updates: Partial<Claim>): Promise<Claim | undefined> {
    const claim = this.claims.get(id);
    if (!claim) return undefined;
    
    const updatedClaim = { ...claim, ...updates, updatedAt: new Date() };
    this.claims.set(id, updatedClaim);
    return updatedClaim;
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByGithubId(githubId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.githubId, githubId));
    return user || undefined;
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    if (!walletAddress) return undefined;
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({...updates, updatedAt: new Date()})
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Repository methods
  async getRepository(id: number): Promise<Repository | undefined> {
    const [repo] = await db.select().from(repositories).where(eq(repositories.id, id));
    return repo || undefined;
  }

  async getRepositoryByFullName(fullName: string): Promise<Repository | undefined> {
    const [repo] = await db.select().from(repositories).where(eq(repositories.fullName, fullName));
    return repo || undefined;
  }

  async listRepositories(): Promise<Repository[]> {
    return db.select().from(repositories).orderBy(repositories.createdAt);
  }

  async listUserRepositories(ownerId: number): Promise<Repository[]> {
    // In a real implementation, this would filter by repositories the user owns or has access to
    return this.listRepositories();
  }

  async createRepository(insertRepo: InsertRepository): Promise<Repository> {
    const [repo] = await db.insert(repositories).values(insertRepo).returning();
    return repo;
  }

  async updateRepository(id: number, updates: Partial<Repository>): Promise<Repository | undefined> {
    const [repo] = await db.update(repositories)
      .set({...updates, updatedAt: new Date()})
      .where(eq(repositories.id, id))
      .returning();
    return repo || undefined;
  }

  // Pool methods
  async getPool(id: number): Promise<Pool | undefined> {
    const [pool] = await db.select().from(pools).where(eq(pools.id, id));
    return pool || undefined;
  }

  async getPoolByRepository(repositoryId: number): Promise<Pool | undefined> {
    const [pool] = await db.select().from(pools).where(eq(pools.repositoryId, repositoryId));
    return pool || undefined;
  }

  async createPool(insertPool: InsertPool): Promise<Pool> {
    const [pool] = await db.insert(pools).values(insertPool).returning();
    return pool;
  }

  async updatePool(id: number, updates: Partial<Pool>): Promise<Pool | undefined> {
    const [pool] = await db.update(pools)
      .set({...updates, updatedAt: new Date()})
      .where(eq(pools.id, id))
      .returning();
    return pool || undefined;
  }

  // Issue methods
  async getIssue(id: number): Promise<Issue | undefined> {
    const [issue] = await db.select().from(issues).where(eq(issues.id, id));
    return issue || undefined;
  }

  async getIssueByRepoAndNumber(repositoryId: number, issueNumber: number): Promise<Issue | undefined> {
    const [issue] = await db.select().from(issues).where(
      and(
        eq(issues.repositoryId, repositoryId),
        eq(issues.issueNumber, issueNumber)
      )
    );
    return issue || undefined;
  }

  async listIssues(filter?: { repositoryId?: number, hasBounty?: boolean }): Promise<Issue[]> {
    let query = db.select().from(issues);
    
    if (filter) {
      if (filter.repositoryId !== undefined) {
        query = query.where(eq(issues.repositoryId, filter.repositoryId));
      }
      
      if (filter.hasBounty !== undefined) {
        query = query.where(eq(issues.hasBounty, filter.hasBounty));
      }
    }
    
    return query.orderBy(desc(issues.createdAt));
  }

  async createIssue(insertIssue: InsertIssue): Promise<Issue> {
    const [issue] = await db.insert(issues).values(insertIssue).returning();
    return issue;
  }

  async updateIssue(id: number, updates: Partial<Issue>): Promise<Issue | undefined> {
    const [issue] = await db.update(issues)
      .set({...updates, updatedAt: new Date()})
      .where(eq(issues.id, id))
      .returning();
    return issue || undefined;
  }

  // Claim methods
  async getClaim(id: number): Promise<Claim | undefined> {
    const [claim] = await db.select().from(claims).where(eq(claims.id, id));
    return claim || undefined;
  }

  async getClaimByUserAndIssue(userId: number, issueId: number): Promise<Claim | undefined> {
    const [claim] = await db.select().from(claims).where(
      and(
        eq(claims.userId, userId),
        eq(claims.issueId, issueId)
      )
    );
    return claim || undefined;
  }

  async listUserClaims(userId: number): Promise<Claim[]> {
    return db.select().from(claims)
      .where(eq(claims.userId, userId))
      .orderBy(desc(claims.createdAt));
  }

  async createClaim(insertClaim: InsertClaim): Promise<Claim> {
    const [claim] = await db.insert(claims).values(insertClaim).returning();
    return claim;
  }

  async updateClaim(id: number, updates: Partial<Claim>): Promise<Claim | undefined> {
    const [claim] = await db.update(claims)
      .set({...updates, updatedAt: new Date()})
      .where(eq(claims.id, id))
      .returning();
    return claim || undefined;
  }
}

export const storage = new DatabaseStorage();
