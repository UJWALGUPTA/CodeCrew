import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/hooks/use-wallet";
import { Tag, CircleDollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WalletCard() {
  const { balance, address, disconnect } = useWallet();
  const { toast } = useToast();
  const [isFundRepoDialogOpen, setIsFundRepoDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > balance) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to withdraw",
        variant: "destructive",
      });
      return;
    }
    
    // This would connect to the actual blockchain in a real implementation
    toast({
      title: "Withdrawal simulated",
      description: `${amount} TOKENS would be withdrawn to your wallet`,
    });
    
    setIsWithdrawDialogOpen(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-5">
          <h3 className="font-medium text-sm flex items-center">
            <Tag className="w-4 h-4 mr-1.5 text-primary" />
            Base Wallet
          </h3>
          <div className="mt-2">
            <p className="text-2xl font-bold code-font">{balance} <span className="text-muted-foreground text-sm">TOKENS</span></p>
            <p className="text-muted-foreground mt-1 text-sm code-font truncate">{address}</p>
          </div>
        </div>
        <div className="bg-primary/20 p-4 flex justify-between">
          <Button 
            className="bg-primary text-white neon-border-primary"
            onClick={() => setIsFundRepoDialogOpen(true)}
          >
            Fund Repository
          </Button>
          <Button 
            variant="outline" 
            className="bg-card"
            onClick={() => setIsWithdrawDialogOpen(true)}
          >
            Withdraw
          </Button>
        </div>
      </CardContent>

      {/* Fund Repository Dialog - Will redirect to repository selection */}
      <Dialog open={isFundRepoDialogOpen} onOpenChange={setIsFundRepoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fund a Repository</DialogTitle>
            <DialogDescription>
              Select a repository to fund with TOKENS.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Please select a repository from the sidebar or navigate to the repository page directly.
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsFundRepoDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Tokens</DialogTitle>
            <DialogDescription>
              Enter the amount of TOKENS you want to withdraw to your connected wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Amount</label>
                <span className="text-sm text-muted-foreground">Balance: {balance} TOKENS</span>
              </div>
              <div className="flex items-center space-x-2">
                <CircleDollarSign className="w-5 h-5 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Amount to withdraw"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="1"
                  max={balance}
                  className="font-mono"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsWithdrawDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleWithdraw}>
              Withdraw
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
