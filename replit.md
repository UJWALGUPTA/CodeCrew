# CodeCrew - Replit Development Guide

## Overview

CodeCrew is a decentralized GitHub bounty platform that connects GitHub repositories with cryptocurrency rewards on the Pharos Testnet. The platform enables developers to earn tokens for open-source contributions through a bounty system integrated with GitHub issues and pull requests.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: TailwindCSS with shadcn/ui component library
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Web3 Integration**: RainbowKit + wagmi for wallet connections and blockchain interactions

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: GitHub OAuth with express-session
- **Development**: tsx for TypeScript execution in development

### Blockchain Integration
- **Target Network**: Pharos Testnet (Chain ID: 688688)
- **Smart Contracts**: Solidity contracts for token management, bounty creation, and reward distribution
- **Contract Structure**: RewardPoolManager, BountyContract, and RoxonnToken (ERC20)
- **Wallet Support**: MetaMask and WalletConnect-compatible wallets via RainbowKit

## Key Components

### Authentication System
- GitHub OAuth integration for user authentication
- Session-based authentication with cookies
- Protected routes with automatic redirects
- User roles: contributor and pool_manager

### Repository Management
- GitHub API integration for repository data
- Repository pools for bounty funding
- Issue tracking with bounty assignments
- GitHub App integration for webhook handling

### Bounty System
- Create bounties for specific GitHub issues
- Claim system for developers to work on issues
- Pull request verification and reward distribution
- Token-based rewards using CREW/ROXN tokens

### Database Schema
- **Users**: GitHub authentication, wallet addresses, token balances
- **Repositories**: GitHub repo metadata and pool associations
- **Issues**: GitHub issues with bounty information
- **Claims**: Developer claims on issues with status tracking
- **Pools**: Repository funding pools managed by maintainers

## Data Flow

1. **User Authentication**: GitHub OAuth → Session Creation → User Database Record
2. **Repository Integration**: GitHub API → Repository Import → Pool Creation
3. **Bounty Creation**: Issue Selection → Pool Funding → Smart Contract Interaction
4. **Claim Process**: Issue Claim → Work Completion → PR Submission → Reward Distribution
5. **Token Management**: Wallet Connection → Balance Tracking → Transaction History

## External Dependencies

### GitHub Integration
- **OAuth App**: For user authentication
- **GitHub App**: For repository webhooks and issue management
- **GitHub API**: For repository and issue data synchronization

### Blockchain Dependencies
- **Pharos Testnet**: Primary blockchain network
- **RainbowKit**: Wallet connection UI and management
- **wagmi/viem**: Ethereum interaction libraries
- **Smart Contracts**: Custom deployed contracts for bounty management

### Database
- **PostgreSQL**: Primary database (configured via DATABASE_URL)
- **Drizzle ORM**: Type-safe database operations
- **Neon Database**: Serverless PostgreSQL provider integration

## Deployment Strategy

### Replit Configuration
- **Node.js 20**: Runtime environment
- **PostgreSQL 16**: Database module
- **Autoscale Deployment**: Production deployment target
- **Port 5000**: Application server port mapped to external port 80

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: OAuth credentials
- `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY`: GitHub App credentials
- `VITE_WALLETCONNECT_PROJECT_ID`: WalletConnect configuration
- `VITE_BASE_RPC_URL`: Blockchain RPC endpoint

### Build Process
1. **Development**: `npm run dev` - Runs TypeScript server with hot reload
2. **Production Build**: `npm run build` - Vite frontend build + esbuild server bundle
3. **Production Start**: `npm run start` - Serves built application

## Changelog
- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.