import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

type ChartPeriod = "week" | "month" | "year";

export default function BountyChart() {
  const { isAuthenticated } = useAuth();
  const [activePeriod, setActivePeriod] = useState<ChartPeriod>("week");
  
  const { data: chartData, isLoading } = useQuery({
    queryKey: ["/api/charts/rewards", activePeriod],
    enabled: isAuthenticated,
  });
  
  // Calculate the max value in the dataset for scaling
  const maxValue = chartData?.data?.reduce((max: number, item: any) => 
    Math.max(max, item.value), 0) || 0;
  
  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Reward Activity</h2>
          <div className="flex space-x-2">
            <Button 
              variant={activePeriod === "week" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setActivePeriod("week")}
              className={activePeriod === "week" ? "bg-primary/20 text-primary" : ""}
            >
              Week
            </Button>
            <Button 
              variant={activePeriod === "month" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setActivePeriod("month")}
              className={activePeriod === "month" ? "bg-primary/20 text-primary" : ""}
            >
              Month
            </Button>
            <Button 
              variant={activePeriod === "year" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setActivePeriod("year")}
              className={activePeriod === "year" ? "bg-primary/20 text-primary" : ""}
            >
              Year
            </Button>
          </div>
        </div>
        
        <div className="h-64 w-full flex items-end space-x-2">
          {isLoading ? (
            <div className="w-full flex items-end space-x-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="w-1/7 bg-muted animate-pulse rounded-t" style={{ height: `${Math.random() * 80 + 10}%` }}></div>
              ))}
            </div>
          ) : chartData?.data?.length > 0 ? (
            <div className="relative h-full flex items-end space-x-2" style={{ width: '100%' }}>
              {chartData.data.map((item: any, index: number) => {
                const heightPercentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                const isHighest = item.value === maxValue && maxValue > 0;
                
                return (
                  <div
                    key={index}
                    className={`w-1/7 ${isHighest ? 'bg-primary' : 'bg-primary/20'} hover:bg-primary/30 rounded-t transition-all`}
                    style={{ height: `${heightPercentage}%` }}
                  >
                    <div className="absolute bottom-full mb-2 text-xs text-muted-foreground" style={{ left: `${index * 14.3}%` }}>
                      {item.label}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-muted-foreground">No activity data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
