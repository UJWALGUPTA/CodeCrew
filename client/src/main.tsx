import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig } from "wagmi";
import { http, createConfig } from "wagmi";
import { Chain } from "viem/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

// Define the Pharos Testnet chain configuration
const pharosTestnet: Chain = {
  id: 688688,
  name: 'Pharos Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.dplabs-internal.com'],
      webSocket: ['wss://testnet.dplabs-internal.com'],
    },
    public: {
      http: ['https://testnet.dplabs-internal.com'],
      webSocket: ['wss://testnet.dplabs-internal.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Pharos Explorer',
      url: 'https://testnet.dplabs-internal.com/explorer',
    },
  },
  testnet: true,
};

// Configure chains & providers for Rainbow Kit - use hardcoded project ID for simplicity
// In a real-world scenario, this would come from environment variables
const walletConnectProjectId = "b47a3255a55b6a509c8a690175b7d07e";

// Check if project ID is available
if (!walletConnectProjectId) {
  console.warn(
    "WalletConnect Project ID is missing! Wallet connections may not work properly.",
  );
} else {
  console.log(
    "WalletConnect Project ID is configured successfully:",
    walletConnectProjectId,
  );
}

const config = getDefaultConfig({
  appName: "CodeCrew",
  projectId: walletConnectProjectId,
  chains: [pharosTestnet],
  transports: {
    [pharosTestnet.id]: http(),
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <WagmiConfig config={config}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: "#3B82F6", // Primary blue
          accentColorForeground: "white",
          borderRadius: "medium",
          fontStack: "system",
        })}
      >
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </QueryClientProvider>,
);
