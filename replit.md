# CodeCrew - Decentralized GitHub Bounty Platform

## Overview

CodeCrew is a decentralized bounty platform that connects GitHub repositories with cryptocurrency rewards on the Pharos Testnet. It enables developers to earn tokens for open-source contributions through a smart contract-based reward system. The platform integrates GitHub OAuth authentication, Web3 wallet connectivity, and blockchain-based token distribution to create a seamless experience for managing code bounties.

## System Architecture

The application follows a full-stack architecture with separate frontend and backend components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with shadcn/ui component library
- **State Management**: React Query for server state, React Context for authentication
- **Routing**: Wouter for client-side routing
- **Web3 Integration**: RainbowKit + wagmi for wallet connectivity
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: GitHub OAuth with session-based auth
- **GitHub Integration**: GitHub App for repository webhooks and API access
- **Blockchain**: Integration with Pharos Testnet (Chain ID: 688688)

## Key Components

### Authentication System
- **GitHub OAuth**: Users authenticate via GitHub to access their repositories
- **Session Management**: Express sessions with secure cookie configuration
- **Protected Routes**: Client-side route protection based on authentication status

### Repository Management
- **GitHub API Integration**: Fetch user repositories and issue data
- **Repository Pools**: Smart contract-based funding pools for each repository
- **Issue Tracking**: Real-time synchronization of GitHub issues with bounty status

### Bounty System
- **Smart Contracts**: 
  - `CodeCrewToken`: ERC20 token for rewards
  - `RewardPoolManager`: Manages repository funding pools
  - `BountyContract`: Handles individual issue bounties and claims
- **Claim Management**: Users can claim issues and submit proof of completion
- **Reward Distribution**: Automated token distribution upon bounty completion

### Web3 Integration
- **Wallet Connection**: RainbowKit integration for multiple wallet providers
- **Chain Support**: Pharos Testnet with fallback configuration
- **Contract Interaction**: Type-safe contract interactions using Viem

## Data Flow

1. **User Authentication**: GitHub OAuth → Session creation → User data storage
2. **Repository Addition**: GitHub API → Repository data → Smart contract pool creation
3. **Issue Synchronization**: GitHub webhooks → Issue data → Bounty opportunity creation
4. **Bounty Creation**: Pool manager → Token allocation → Issue marking
5. **Claim Process**: User claim → GitHub PR submission → Verification → Token distribution

## External Dependencies

### GitHub Integration
- **GitHub OAuth App**: For user authentication and repository access
- **GitHub App**: For webhooks and repository management
- **GitHub API**: For fetching repositories, issues, and user data

### Blockchain Infrastructure
- **Pharos Testnet**: Primary blockchain network (Chain ID: 688688)
- **RPC Endpoint**: `https://testnet.dplabs-internal.com`
- **Smart Contracts**: Deployed token and bounty management contracts

### Third-Party Services
- **WalletConnect**: For wallet connectivity via RainbowKit
- **PostgreSQL**: Database hosted via environment configuration
- **Replit**: Development and deployment platform

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: PostgreSQL connection via `DATABASE_URL`
- **Environment Variables**: Local `.env` file for configuration

### Production Deployment
- **Platform**: Replit autoscale deployment
- **Build Process**: Vite build + esbuild for server bundling
- **Port Configuration**: Internal port 5000, external port 80
- **Static Assets**: Served from `/dist/public`

### Environment Configuration
Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: OAuth credentials
- `GITHUB_APP_ID` & `GITHUB_APP_PRIVATE_KEY`: GitHub App credentials
- `GITHUB_WEBHOOK_SECRET`: Webhook verification secret
- `VITE_WALLETCONNECT_PROJECT_ID`: WalletConnect project identifier

## Changelog

- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.