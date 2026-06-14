import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, color = "primary" }: StatCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-purple-600",
    accent: "bg-accent/10 text-amber-600",
    success: "bg-green-100 text-green-600",
  };

  return (
    <Card className="p-6 rounded-2xl border-border hover:shadow-lg transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold mb-2">{value}</h3>
          {trend && (
            <p className={`text-sm ${trendUp ? 'text-green-600' : 'text-destructive'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses] || colorClasses.primary}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}
