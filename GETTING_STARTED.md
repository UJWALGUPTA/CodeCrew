# Getting Started with CodeCrew

This guide will help you set up and run the CodeCrew platform on your local machine for development and testing purposes.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or later)
- **npm** (v8 or later)
- **PostgreSQL** (v14 or later)
- **Git**

You'll also need:

- A **GitHub account** with administrative access to at least one repository
- A **GitHub OAuth App** for authentication
- A **GitHub App** for repository integration
- An **Ethereum wallet** (MetaMask or any WalletConnect compatible wallet)

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/codecrew.git
cd codecrew
```

## Step 2: Set Up GitHub OAuth App

1. Go to your GitHub account settings
2. Navigate to Developer settings > OAuth Apps > New OAuth App
3. Register a new application with the following details:
   - **Application name**: CodeCrew Local
   - **Homepage URL**: http://localhost:5000
   - **Authorization callback URL**: http://localhost:5000/api/auth/github/callback
4. Click "Register application"
5. Note your Client ID and generate a Client Secret

## Step 3: Set Up GitHub App

1. Go to your GitHub account settings
2. Navigate to Developer settings > GitHub Apps > New GitHub App
3. Register a new application with the following details:
   - **GitHub App name**: CodeCrew Local
   - **Homepage URL**: http://localhost:5000
   - **Webhook URL**: http://localhost:5000/api/github/webhook
   - **Webhook secret**: Generate a secret
   - **Permissions**:
     - Repository permissions:
       - Issues: Read & Write
       - Pull requests: Read & Write
       - Webhooks: Read & Write
     - Organization permissions:
       - Members: Read
4. Generate a private key and download it
5. Note your App ID, App name, and Webhook secret

## Step 4: Environment Configuration

Create a `.env` file in the root directory with the following content:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/codecrew

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# GitHub App
GITHUB_APP_ID=your_github_app_id
GITHUB_APP_NAME=your_github_app_name
GITHUB_APP_PRIVATE_KEY=your_github_app_private_key_contents
GITHUB_WEBHOOK_SECRET=your_github_webhook_secret

# Web3
VITE_BASE_RPC_URL=https://sepolia.base.org
WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

Replace the placeholder values with your actual credentials. For the `GITHUB_APP_PRIVATE_KEY`, you need to convert the downloaded .pem file into a single line string with newlines replaced by `\n`.

## Step 5: Database Setup

1. Create a PostgreSQL database:
   ```bash
   createdb codecrew
   ```

2. Update the `DATABASE_URL` in your `.env` file with your database credentials.

## Step 6: Install Dependencies

```bash
npm install
```

## Step 7: Initialize the Database

```bash
npm run db:push
```

This command will create all necessary tables in your database based on the schema defined in `shared/schema.ts`.

## Step 8: Compile Smart Contracts

```bash
npm run compile:contracts
```

This will compile the smart contracts and generate the necessary artifacts.

## Step 9: Start the Development Server

```bash
npm run dev
```

This will start both the backend Express server and the frontend Vite development server on the same port (default: 5000).

## Step 10: Access the Application

Open your browser and navigate to [http://localhost:5000](http://localhost:5000).

## Using the Application

### Logging In

1. Click on "Connect GitHub" to authenticate with your GitHub account
2. Authorize the CodeCrew application

### Adding a Repository

1. Navigate to "Add Repository" in the sidebar
2. Install the GitHub App on your repositories if not already done
3. Select a repository from the list or enter a repository URL
4. Click "Add Repository"

### Connecting Your Wallet

1. Click on "Connect Wallet" in the header
2. Select your preferred wallet provider
3. Follow the wallet provider's instructions to connect

### Funding a Repository

1. Navigate to the repository detail page
2. Enter the amount of CREW tokens you want to add to the repository pool
3. Click "Fund Repository"
4. Confirm the transaction in your wallet

### Setting Bounties

1. Navigate to the repository detail page
2. Browse the issues list
3. Click "Set Bounty" on an issue
4. Enter the bounty amount
5. Click "Set Bounty"
6. Confirm the transaction in your wallet

## Troubleshooting

### Common Issues

#### GitHub Authentication Issues

- Ensure your OAuth App's callback URL is correct
- Check that your `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are correct in the `.env` file

#### GitHub App Integration Issues

- Verify that the GitHub App is installed on the repositories you're trying to add
- Check that your `GITHUB_APP_PRIVATE_KEY` is formatted correctly in the `.env` file
- Ensure the Webhook URL is accessible from GitHub (may require a tunnel service like ngrok for local development)

#### Database Issues

- Verify your PostgreSQL server is running
- Check that your database credentials in `DATABASE_URL` are correct
- Ensure you've run the database initialization (`npm run db:push`)

#### Web3 Connection Issues

- Ensure you're connected to the Base Sepolia testnet in your wallet
- Verify that your wallet has Base Sepolia ETH for gas fees
- Check that your `VITE_BASE_RPC_URL` is correct in the `.env` file

### Getting Help

If you encounter any issues not covered here, please:

1. Check the existing GitHub issues to see if your problem has been reported
2. Create a new issue with detailed information about your problem
3. Reach out to the maintainers through GitHub discussions

## Next Steps

- Review the [Contributing Guidelines](CONTRIBUTING.md) to learn how to contribute to the project
- Explore the codebase to understand the application structure
- Check the [README](README.md) for additional information about the project