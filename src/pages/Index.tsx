import { useState, useEffect } from "react";
import { Wallet, TrendingUp, Receipt, PieChart, Edit2 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { AddExpenseForm } from "@/components/AddExpenseForm";
import { TransactionList } from "@/components/TransactionList";
import { BillSplitter } from "@/components/BillSplitter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  timestamp: string;
}

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [initialBalance, setInitialBalance] = useState<number>(() => {
    const saved = localStorage.getItem('initialBalance');
    return saved ? parseFloat(saved) : 0;
  });

  const [balanceInput, setBalanceInput] = useState<string>("");
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('initialBalance', initialBalance.toString());
  }, [initialBalance]);

  const addExpense = (expense: Transaction) => {
    setTransactions([expense, ...transactions]);
  };

  const deleteExpense = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast.success("Expense deleted");
  };

  const handleSetBalance = () => {
    const amount = parseFloat(balanceInput);
    if (isNaN(amount) || amount < 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setInitialBalance(amount);
    setBalanceInput("");
    setIsBalanceDialogOpen(false);
    toast.success("Balance updated!");
  };

  const monthlyExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = initialBalance - monthlyExpenses;
  const transactionCount = transactions.length;
  
  // Category breakdown
  const categoryExpenses = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryExpenses).sort(([, a], [, b]) => b - a)[0];
  const categoryCount = Object.keys(categoryExpenses).length;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Smart Expense Tracker</h1>
          </div>
          <p className="text-muted-foreground text-lg">Track your spending with intelligence</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <StatCard
              icon={Wallet}
              title="Total Balance"
              value={`$${currentBalance.toFixed(2)}`}
              subtitle={initialBalance === 0 ? "Click to set initial balance" : `From $${initialBalance.toFixed(2)} initial`}
              trend={currentBalance >= 0 ? "up" : "down"}
            />
            <Dialog open={isBalanceDialogOpen} onOpenChange={setIsBalanceDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 w-8 h-8 hover:bg-primary/10"
                >
                  <Edit2 className="w-4 h-4 text-primary" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Set Initial Balance</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Enter your starting balance
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={balanceInput}
                      onChange={(e) => setBalanceInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSetBalance()}
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <Button onClick={handleSetBalance} className="w-full bg-primary hover:bg-primary/90">
                    Set Balance
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <StatCard
            icon={TrendingUp}
            title="Monthly Expenses"
            value={`$${monthlyExpenses.toFixed(2)}`}
            subtitle={`${transactionCount} transaction${transactionCount !== 1 ? 's' : ''}`}
          />
          <StatCard
            icon={Receipt}
            title="Transactions"
            value={transactionCount.toString()}
            subtitle={categoryCount > 0 ? `Across ${categoryCount} categories` : "No expenses yet"}
          />
          <StatCard
            icon={PieChart}
            title="Category Report"
            value={topCategory ? topCategory[0] : "—"}
            subtitle={topCategory ? `$${topCategory[1].toFixed(2)} spent` : "Add expenses to see report"}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="expenses" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-secondary">
            <TabsTrigger value="expenses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Expense Tracker
            </TabsTrigger>
            <TabsTrigger value="splitter" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Bill Splitter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <TransactionList transactions={transactions} onDelete={deleteExpense} />
              </div>
              <div>
                <AddExpenseForm onAddExpense={addExpense} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="splitter">
            <div className="max-w-2xl mx-auto">
              <BillSplitter />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
