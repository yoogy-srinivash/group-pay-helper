import { useState, useEffect } from "react";
import { Wallet, TrendingUp, Receipt, PieChart } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { AddExpenseForm } from "@/components/AddExpenseForm";
import { TransactionList } from "@/components/TransactionList";
import { BillSplitter } from "@/components/BillSplitter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(transactions));
  }, [transactions]);

  const addExpense = (expense: Transaction) => {
    setTransactions([expense, ...transactions]);
  };

  const deleteExpense = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast.success("Expense deleted");
  };

  const totalBalance = 5240.00; // Mock data
  const monthlyExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  const transactionCount = transactions.length;
  
  const budgetLimit = 3500;
  const budgetPercentage = Math.min(Math.round((monthlyExpenses / budgetLimit) * 100), 100);
  const budgetRemaining = Math.max(budgetLimit - monthlyExpenses, 0);

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
          <StatCard
            icon={Wallet}
            title="Total Balance"
            value={`$${totalBalance.toFixed(2)}`}
            subtitle="+12.5% from last month"
            trend="up"
          />
          <StatCard
            icon={TrendingUp}
            title="Monthly Expenses"
            value={`$${monthlyExpenses.toFixed(2)}`}
            subtitle="-8.3% from last month"
            trend="down"
          />
          <StatCard
            icon={Receipt}
            title="Transactions"
            value={transactionCount.toString()}
            subtitle="15 this week"
          />
          <StatCard
            icon={PieChart}
            title="Budget Status"
            value={`${budgetPercentage}%`}
            subtitle={`$${budgetRemaining.toFixed(2)} remaining`}
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
