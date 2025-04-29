import { CircleDollarSign, Check, Clock } from "lucide-react";

interface StatCardsProps {
  totalEarnings: number;
  completedBounties: number;
  pendingClaims: number;
}

export default function StatCards({ totalEarnings, completedBounties, pendingClaims }: StatCardsProps) {
  return (
    <div className="col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-card border border-border rounded-lg p-5 hover:border-primary transition-all">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-md bg-primary/20">
            <CircleDollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total Earnings</p>
            <p className="mt-1 text-xl font-semibold neon-primary code-font">{totalEarnings} TOKENS</p>
          </div>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-5 hover:border-secondary transition-all">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-md bg-secondary/20">
            <Check className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Completed Bounties</p>
            <p className="mt-1 text-xl font-semibold neon-secondary">{completedBounties}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-5 hover:border-orange-500 transition-all">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-md bg-orange-500/20">
            <Clock className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Pending Claims</p>
            <p className="mt-1 text-xl font-semibold" style={{ textShadow: "0 0 5px #F4A100, 0 0 10px #F4A100" }}>
              {pendingClaims}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
