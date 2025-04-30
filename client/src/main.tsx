import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiConfig } from 'wagmi';
import { http, createConfig } from 'wagmi'
import { base, baseGoerli } from 'viem/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

// Configure chains & providers for Rainbow Kit
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '';

// Check if project ID is available
if (!walletConnectProjectId) {
  console.warn('WalletConnect Project ID is missing! Wallet connections may not work properly.');
}

const config = getDefaultConfig({
  appName: 'CodeCrew',
  projectId: walletConnectProjectId,
  chains: [base, baseGoerli],
  transports: {
    [base.id]: http(),
    [baseGoerli.id]: http()
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <WagmiConfig config={config}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: '#3B82F6', // Primary blue
          accentColorForeground: 'white',
          borderRadius: 'medium',
          fontStack: 'system',
        })}
      >
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </QueryClientProvider>
);
