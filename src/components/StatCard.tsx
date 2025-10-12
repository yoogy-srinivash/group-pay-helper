import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  subtitle: string;
  trend?: "up" | "down";
}

export function StatCard({ icon: Icon, title, value, subtitle, trend }: StatCardProps) {
  return (
    <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300">
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
          <p className={`text-sm ${trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}`}>
            {subtitle}
          </p>
        </div>
      </div>
    </Card>
  );
}
