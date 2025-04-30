import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig } from "wagmi";
import { http, createConfig } from "wagmi";
import { base, baseSepolia } from "viem/chains";
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
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
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
