import { db } from "../server/db";
import { 
  users, 
  repositories, 
  pools, 
  issues, 
  claims 
} from "../shared/schema";
import { eq } from "drizzle-orm";

// Run this script with: npx tsx scripts/add-demo-data.ts

// Function to add a delay between operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function addDemoData() {
  console.log("⭐ Adding demo data for CodeCrew platform...");
  
  try {
    // Check if there's a user in the system
    const userList = await db.select().from(users);
    
    if (userList.length === 0) {
      console.log("❌ No users found in the system. Please log in first before running this script.");
      return;
    }
    
    // Get the first user as the demo user
    const demoUser = userList[0];
    console.log(`✅ Using ${demoUser.username} as the demo user`);
    
    // Add sample repositories
    const repositories_data = [
      {
        owner: "facebook",
        name: "react",
        fullName: "facebook/react",
        description: "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
        url: "https://github.com/facebook/react",
        stars: 203000,
        forks: 42000,
        openIssues: 1252,
        isPrivate: false
      },
      {
        owner: "ethereum",
        name: "go-ethereum",
        fullName: "ethereum/go-ethereum",
        description: "Official Go implementation of the Ethereum protocol",
        url: "https://github.com/ethereum/go-ethereum",
        stars: 41500,
        forks: 18200,
        openIssues: 322,
        isPrivate: false
      },
      {
        owner: "base-org",
        name: "contracts",
        fullName: "base-org/contracts",
        description: "Smart contracts used in the Base ecosystem",
        url: "https://github.com/base-org/contracts",
        stars: 1200,
        forks: 350,
        openIssues: 45,
        isPrivate: false
      },
      {
        owner: demoUser.username,
        name: "code-crew-app",
        fullName: `${demoUser.username}/code-crew-app`,
        description: "A decentralized GitHub bounty platform for open-source projects",
        url: `https://github.com/${demoUser.username}/code-crew-app`,
        stars: 154,
        forks: 23,
        openIssues: 12,
        isPrivate: false
      }
    ];
    
    console.log("🚀 Adding sample repositories...");
    
    // Clear existing repositories and related data
    await db.delete(claims);
    await db.delete(issues);
    await db.delete(pools);
    await db.delete(repositories);
    
    // Add each repository
    for (const repo_data of repositories_data) {
      console.log(`  Adding repository: ${repo_data.fullName}`);
      
      // Check if repository exists
      const existingRepo = await db
        .select()
        .from(repositories)
        .where(eq(repositories.fullName, repo_data.fullName));
      
      if (existingRepo.length > 0) {
        console.log(`  Repository ${repo_data.fullName} already exists, skipping...`);
        continue;
      }
      
      // Add the repository
      const [repository] = await db
        .insert(repositories)
        .values({
          ...repo_data,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      // Create a pool for this repository
      const [pool] = await db
        .insert(pools)
        .values({
          repositoryId: repository.id,
          managerId: demoUser.id,
          balance: 1000,
          dailyDeposited: 1000,
          lastDepositTime: new Date(),
          isActive: true,
          contractAddress: "0x" + Math.random().toString(16).substr(2, 40),
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      console.log(`  Created pool with balance of 1000 CREW tokens`);
      
      // Add issues for this repository
      const issues_data = [
        {
          repositoryId: repository.id,
          issueNumber: 1,
          title: `Fix documentation for ${repository.name}`,
          description: "The installation guide has several outdated steps that need to be updated for the latest version.",
          url: `${repository.url}/issues/1`,
          state: "open",
          type: "docs",
          hasBounty: true,
          reward: 100,
          bountyAddedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        },
        {
          repositoryId: repository.id,
          issueNumber: 2,
          title: `Add dark mode to the ${repository.name} UI`,
          description: "The app should respect the user's system theme preference and offer a toggle for light/dark mode.",
          url: `${repository.url}/issues/2`,
          state: "open",
          type: "enhancement",
          hasBounty: true,
          reward: 250,
          bountyAddedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        },
        {
          repositoryId: repository.id,
          issueNumber: 3,
          title: `Fix memory leak in ${repository.name}`,
          description: "There's a serious memory leak when processing large data sets that needs to be addressed.",
          url: `${repository.url}/issues/3`,
          state: "open",
          type: "bug",
          hasBounty: true,
          reward: 500,
          bountyAddedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
          repositoryId: repository.id,
          issueNumber: 4,
          title: `Add TypeScript type definitions for ${repository.name}`,
          description: "Need to improve developer experience by adding comprehensive TypeScript types.",
          url: `${repository.url}/issues/4`,
          state: "open",
          type: "enhancement",
          hasBounty: false,
          reward: 0
        },
        {
          repositoryId: repository.id,
          issueNumber: 5,
          title: `Implement CI/CD pipeline for ${repository.name}`,
          description: "Need to set up automated testing and deployment workflows using GitHub Actions.",
          url: `${repository.url}/issues/5`,
          state: "open",
          type: "enhancement",
          hasBounty: true,
          reward: 300,
          bountyAddedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        }
      ];
      
      console.log(`  Adding issues for ${repository.fullName}...`);
      
      for (const issue_data of issues_data) {
        const [issue] = await db
          .insert(issues)
          .values({
            ...issue_data,
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            updatedAt: new Date()
          })
          .returning();
        
        console.log(`    Added issue #${issue.issueNumber}: ${issue.title} ${issue.hasBounty ? `(${issue.reward} CREW)` : ''}`);
        
        // For some issues, add claims
        if (issue.issueNumber % 2 === 1) { // Odd numbered issues
          const claim_statuses = ["claimed", "submitted", "review", "approved"];
          const status = claim_statuses[Math.floor(Math.random() * claim_statuses.length)];
          
          const [claim] = await db
            .insert(claims)
            .values({
              userId: demoUser.id,
              issueId: issue.id,
              status,
              prUrl: status !== "claimed" ? `${repository.url}/pull/${issue.issueNumber + 100}` : null,
              prNumber: status !== "claimed" ? issue.issueNumber + 100 : null,
              transactionHash: status === "approved" ? "0x" + Math.random().toString(16).substr(2, 64) : null,
              completedAt: status === "approved" ? new Date() : null,
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
              updatedAt: new Date()
            })
            .returning();
          
          console.log(`      Added claim for issue #${issue.issueNumber} with status: ${status}`);
        }
      }
      
      await delay(100); // Small delay to avoid flooding the database
    }
    
    console.log("✅ Demo data added successfully!");
    
  } catch (error) {
    console.error("Error adding demo data:", error);
  } finally {
    process.exit(0);
  }
}

addDemoData();