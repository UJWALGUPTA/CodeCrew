import { useQuery } from "@tanstack/react-query";
import StatCards from "@/components/dashboard/stat-cards";
import WalletCard from "@/components/dashboard/wallet-card";
import BountyChart from "@/components/dashboard/bounty-chart";
import ActiveIssues from "@/components/dashboard/active-issues";
import MyClaims from "@/components/dashboard/my-claims";
import { useAuth } from "@/hooks/use-auth";
import { useWallet } from "@/hooks/use-wallet";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { isConnected } = useWallet();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
        {isLoading ? (
          <>
            <div className="col-span-3">
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-32 w-full" />
          </>
        ) : (
          <>
            <StatCards
              totalEarnings={dashboardData?.totalEarnings || 0}
              completedBounties={dashboardData?.completedBounties || 0}
              pendingClaims={dashboardData?.pendingClaims || 0}
            />
            <WalletCard />
          </>
        )}
      </div>

      <BountyChart />
      <ActiveIssues />
      <MyClaims />
    </div>
  );
}
