# CodeCrew - Decentralized GitHub Bounty Platform

CodeCrew is a decentralized bounty platform that connects GitHub repositories with cryptocurrency rewards on the Pharos Testnet. It enables developers to earn tokens for open-source contributions through a seamless integration of GitHub repositories with smart contracts on the Pharos Testnet.

![CodeCrew Logo](generated-icon.png)

## 🚀 Features

- **GitHub Integration**: Connect your GitHub account and import repositories
- **Repository Management**: Add, view, and manage your repositories
- **Bounty System**: Set bounties for specific issues in your repositories
- **Decentralized Rewards**: Distribute rewards using CREW tokens on Pharos Testnet
- **Issue Tracking**: Track open issues and their bounties
- **Claim Management**: Manage claims on issues and verify completed work
- **Wallet Integration**: Seamless integration with Ethereum wallets via RainbowKit

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Express.js, PostgreSQL with Drizzle ORM
- **Blockchain**: Pharos Testnet (Chain ID: 688688)
- **Authentication**: GitHub OAuth
- **Web3 Integration**: RainbowKit, wagmi, ethers.js
- **State Management**: React Query

## 🏄‍♂️ Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- GitHub OAuth application credentials
- Pharos Testnet access

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/codecrew

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# GitHub App
GITHUB_APP_ID=your_github_app_id
GITHUB_APP_NAME=your_github_app_name
GITHUB_APP_PRIVATE_KEY=your_github_app_private_key
GITHUB_WEBHOOK_SECRET=your_github_webhook_secret

# Web3
VITE_BASE_RPC_URL=https://testnet.dplabs-internal.com
WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/codecrew.git
   cd codecrew
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up the database
   ```
   npm run db:push
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Access the application at http://localhost:5000

## 📋 Usage Guide

### Connecting Your GitHub Account

1. Click on "Connect GitHub" in the login page or header
2. Authorize the CodeCrew application to access your GitHub account
3. You'll be redirected back to the CodeCrew platform

### Adding a Repository

1. Navigate to "Add Repository" in the sidebar
2. Install the GitHub App on your repositories if not already done
3. Select a repository from the list or enter a repository URL
4. Click "Add Repository"

### Funding a Repository

1. Go to the repository detail page
2. Connect your wallet if not already connected
3. Enter the amount of CREW tokens to fund the repository
4. Confirm the transaction

### Setting Bounties on Issues

1. Navigate to the repository detail page
2. View the list of issues
3. Click "Set Bounty" on an issue
4. Enter the bounty amount
5. Confirm the transaction

### Claiming an Issue

1. Browse available issues with bounties
2. Click "Claim" on an issue you want to work on
3. Submit your Pull Request on GitHub
4. Link your PR to the claim in CodeCrew
5. Wait for approval to receive the bounty

## 🧩 Architecture

### Database Schema

The platform uses a PostgreSQL database with the following main tables:

- **users**: Stores user information and authentication details
- **repositories**: Tracks GitHub repositories added to the platform
- **pools**: Manages token pools for repositories
- **issues**: Stores GitHub issues with bounty information
- **claims**: Tracks claims on issues and their status

### Smart Contracts

The platform utilizes the following smart contracts:

- **CodeCrewToken.sol**: ERC20 token contract for CREW tokens
- **BountyPool.sol**: Manages repository funding and bounty distribution

## 🤝 GitHub Integration

### GitHub App Permissions

The CodeCrew GitHub App requires the following permissions:

- **Repository permissions**:
  - Issues: Read & Write
  - Pull requests: Read & Write
  - Webhooks: Read & Write

### Webhook Commands

The platform responds to GitHub issue comments with special commands:

- `!codecrew claim`: Claim an issue
- `!codecrew bounty [amount]`: Set a bounty amount

## 🔧 Development

### Compiling Smart Contracts

```
npm run compile:contracts
```

### Running Tests

```
npm test
```

### Database Migrations

```
npm run db:push
```

## 🛣️ Roadmap

- [ ] Multi-chain support
- [ ] Custom token integration
- [ ] Reputation system for contributors
- [ ] Advanced analytics dashboard
- [ ] Automated PR verification
- [ ] Integration with additional developer platforms

## 🤖 Contributing

We welcome contributions to CodeCrew! Please feel free to submit a pull request or open an issue for bugs, feature requests, or documentation improvements.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Pharos Testnet](https://dplabs-internal.com/) - Blockchain platform
- [GitHub API](https://docs.github.com/en/rest) - GitHub integration
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm) - Database ORM
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [RainbowKit](https://www.rainbowkit.com/) - Wallet integration
- [wagmi](https://wagmi.sh/) - React hooks for Ethereum
- [Lucide React](https://lucide.dev/) - Icon set