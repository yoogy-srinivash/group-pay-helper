import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const categories = ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Healthcare", "Other"];

interface AddExpenseFormProps {
  onAddExpense: (expense: any) => void;
}

export function AddExpenseForm({ onAddExpense }: AddExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category,
      description,
      date,
      notes,
      timestamp: new Date().toISOString()
    };

    onAddExpense(expense);
    
    // Reset form
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date().toISOString().split('T')[0]);
    setNotes("");
    
    toast.success("Expense added successfully!");
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-2 mb-6">
        <Plus className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Add New Expense</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Amount ($)</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Description</label>
          <Input
            placeholder="What did you spend on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Date</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Notes (Optional)</label>
          <Textarea
            placeholder="Add any additional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="bg-input border-border text-foreground min-h-[80px]"
          />
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          ADD EXPENSE
        </Button>
      </form>
    </Card>
  );
}
