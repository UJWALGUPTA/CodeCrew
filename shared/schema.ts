import { pgTable, text, serial, integer, boolean, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  githubId: text("github_id").notNull().unique(),
  email: text("email"),
  avatarUrl: text("avatar_url"),
  accessToken: text("access_token"),
  walletAddress: text("wallet_address"),
  role: text("role").default("contributor").notNull(), // 'contributor' or 'pool_manager'
  tokenBalance: integer("token_balance").default(1000), // Default 1000 tokens for users
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Repositories table
export const repositories = pgTable("repositories", {
  id: serial("id").primaryKey(),
  owner: text("owner").notNull(),
  name: text("name").notNull(),
  fullName: text("full_name").notNull().unique(),
  description: text("description"),
  url: text("url").notNull(),
  stars: integer("stars").default(0),
  forks: integer("forks").default(0),
  openIssues: integer("open_issues").default(0),
  isPrivate: boolean("is_private").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertRepositorySchema = createInsertSchema(repositories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Repository pools table
export const pools = pgTable("pools", {
  id: serial("id").primaryKey(),
  repositoryId: integer("repository_id").notNull(),
  managerId: integer("manager_id").notNull(),
  balance: integer("balance").default(0),
  dailyDeposited: integer("daily_deposited").default(0),
  lastDepositTime: timestamp("last_deposit_time"),
  isActive: boolean("is_active").default(true),
  contractAddress: text("contract_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPoolSchema = createInsertSchema(pools).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Issues table
export const issues = pgTable("issues", {
  id: serial("id").primaryKey(),
  repositoryId: integer("repository_id").notNull(),
  issueNumber: integer("issue_number").notNull(),
  githubId: text("github_id"), // Store GitHub's issue ID as text to handle large numbers
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  state: text("state").notNull(), // open, closed
  type: text("type").default("enhancement"), // bug, feature, docs, enhancement
  hasBounty: boolean("has_bounty").default(false),
  reward: integer("reward").default(0),
  bountyAddedAt: timestamp("bounty_added_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertIssueSchema = createInsertSchema(issues).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Claims table
export const claims = pgTable("claims", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  issueId: integer("issue_id").notNull(),
  status: text("status").notNull(), // claimed, submitted, review, approved, rejected, expired
  prUrl: text("pr_url"),
  prNumber: integer("pr_number"),
  transactionHash: text("transaction_hash"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertClaimSchema = createInsertSchema(claims).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  claims: many(claims),
}));

export const repositoriesRelations = relations(repositories, ({ one, many }) => ({
  pool: one(pools, { fields: [repositories.id], references: [pools.repositoryId] }),
  issues: many(issues),
}));

export const poolsRelations = relations(pools, ({ one }) => ({
  repository: one(repositories, { fields: [pools.repositoryId], references: [repositories.id] }),
  manager: one(users, { fields: [pools.managerId], references: [users.id] }),
}));

export const issuesRelations = relations(issues, ({ one, many }) => ({
  repository: one(repositories, { fields: [issues.repositoryId], references: [repositories.id] }),
  claims: many(claims),
}));

export const claimsRelations = relations(claims, ({ one }) => ({
  user: one(users, { fields: [claims.userId], references: [users.id] }),
  issue: one(issues, { fields: [claims.issueId], references: [issues.id] }),
}));

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Repository = typeof repositories.$inferSelect;
export type InsertRepository = z.infer<typeof insertRepositorySchema>;

export type Pool = typeof pools.$inferSelect;
export type InsertPool = z.infer<typeof insertPoolSchema>;

export type Issue = typeof issues.$inferSelect;
export type InsertIssue = z.infer<typeof insertIssueSchema>;

export type Claim = typeof claims.$inferSelect;
export type InsertClaim = z.infer<typeof insertClaimSchema>;
