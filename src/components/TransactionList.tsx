import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, Trash2 } from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  timestamp: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: "bg-chart-5/20 text-chart-5",
      transport: "bg-chart-3/20 text-chart-3",
      bills: "bg-chart-2/20 text-chart-2",
      shopping: "bg-chart-4/20 text-chart-4",
      entertainment: "bg-primary/20 text-primary",
      healthcare: "bg-destructive/20 text-destructive",
      other: "bg-muted-foreground/20 text-muted-foreground"
    };
    return colors[category] || colors.other;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays === 0) return 'Today, ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday, ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-2 mb-6">
        <Receipt className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Recent Transactions</h2>
      </div>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No transactions yet. Add your first expense!</p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2 py-1 rounded uppercase ${getCategoryColor(transaction.category)}`}>
                    {transaction.category}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{transaction.description}</h3>
                <p className="text-sm text-muted-foreground">{formatTime(transaction.timestamp)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-foreground">${transaction.amount.toFixed(2)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(transaction.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
