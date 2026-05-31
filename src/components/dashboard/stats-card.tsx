import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { StatsCardProps } from "@/types";

export function StatsCard({ title, value, description, trend, icon: Icon, color = "brand" }: StatsCardProps) {
  const colorMap: Record<string, string> = {
    brand: "bg-brand-50 text-brand-600",
    teal: "bg-teal-50 text-teal-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend !== undefined && (
              <div className={cn(
                "flex items-center gap-1 mt-2 text-xs font-medium",
                trend >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(trend)}% from last month
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-xl flex-shrink-0 ml-4", colorMap[color] || colorMap.brand)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
