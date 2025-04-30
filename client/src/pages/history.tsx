import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ExternalLink, Search, History as HistoryIcon } from "lucide-react";

export default function History() {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Sample history data for the demo
  const sampleHistory = [
    {
      id: 1,
      type: "claim",
      status: "completed",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      issue: {
        id: 3,
        title: "Fix memory leak in Go-Ethereum",
        url: "https://github.com/ethereum/go-ethereum/issues/3"
      },
      repository: "ethereum/go-ethereum",
      reward: 500,
      transactionHash: "0x" + Math.random().toString(16).substr(2, 64)
    },
    {
      id: 2,
      type: "claim",
      status: "completed",
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      issue: {
        id: 5,
        title: "Add TypeScript definitions",
        url: "https://github.com/base-org/contracts/issues/4"
      },
      repository: "base-org/contracts",
      reward: 200,
      transactionHash: "0x" + Math.random().toString(16).substr(2, 64)
    },
    {
      id: 3,
      type: "claim",
      status: "rejected",
      date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      issue: {
        id: 7,
        title: "Optimize database queries",
        url: "https://github.com/facebook/react/issues/7"
      },
      repository: "facebook/react",
      reward: 300,
      reason: "Pull request didn't address the core performance issues"
    },
    {
      id: 4,
      type: "deposit",
      status: "completed",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      repository: "UJWALGUPTA/code-crew-app",
      amount: 1000,
      transactionHash: "0x" + Math.random().toString(16).substr(2, 64)
    },
    {
      id: 5,
      type: "withdrawal",
      status: "completed",
      date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      amount: 200,
      transactionHash: "0x" + Math.random().toString(16).substr(2, 64)
    }
  ];

  // Use sample history for the demo
  const { data: history = sampleHistory, isLoading = false } = useQuery({
    queryKey: ["/api/history"],
    enabled: false, // Disable actual API request for demo
  });

  const filteredHistory = history.filter((item: any) => {
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      (item.issue && item.issue.title && item.issue.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.repository && item.repository.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by tab
    const matchesTab = activeTab === "all" || activeTab === item.status;
    
    return matchesSearch && matchesTab;
  });

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-secondary text-secondary-foreground">Completed</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-muted text-muted-foreground">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reward History</h1>
          <p className="text-muted-foreground">View your completed bounties and payments</p>
        </div>
        
        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search history..."
              className="pl-10 w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <Card>
            {isLoading ? (
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex justify-between">
                      <div className="bg-muted h-8 w-2/3 rounded"></div>
                      <div className="bg-muted h-8 w-24 rounded"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            ) : filteredHistory.length > 0 ? (
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Repository / Issue</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Reward</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.repository || "System"}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.issue && item.issue.title ? item.issue.title : 
                               item.type === "deposit" ? `Deposit to repository` :
                               item.type === "withdrawal" ? "Withdrawal" : "Transaction"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.date ? format(new Date(item.date), 'MMM d, yyyy') : format(new Date(), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className={`font-mono ${item.status === 'completed' ? 'neon-primary text-primary' : 'text-muted-foreground'}`}>
                            {item.status === 'completed' ? 
                              (item.reward ? `+${item.reward}` : 
                               item.amount ? (item.type === 'deposit' ? `-${item.amount}` : `+${item.amount}`) : "0") 
                              : 
                              (item.reward || item.amount || "0")} TOKENS
                          </div>
                        </TableCell>
                        <TableCell>
                          {renderStatusBadge(item.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              const url = item.transactionUrl || 
                                    (item.transactionHash ? `https://sepolia-explorer.base.org/tx/${item.transactionHash}` : 
                                    (item.issue && item.issue.url ? item.issue.url : '#'));
                              if (url !== '#') window.open(url, '_blank');
                            }}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            {item.transactionHash || item.transactionUrl ? 'View TX' : 'View Issue'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            ) : (
              <CardContent className="p-8 text-center">
                <HistoryIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No history found</h3>
                <p className="text-muted-foreground">
                  Your completed bounties and payments will appear here
                </p>
              </CardContent>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
