import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Plus, Trash2, Calculator } from "lucide-react";
import { toast } from "sonner";

interface Person {
  id: string;
  name: string;
  paid: number;
  shouldPay: number;
}

export function BillSplitter() {
  const [people, setPeople] = useState<Person[]>([]);
  const [newPersonName, setNewPersonName] = useState("");
  const [totalBill, setTotalBill] = useState("");
  const [selectedPayers, setSelectedPayers] = useState<Set<string>>(new Set());
  const [selectedSplitters, setSelectedSplitters] = useState<Set<string>>(new Set());
  const [paidAmounts, setPaidAmounts] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const addPerson = () => {
    if (!newPersonName.trim()) {
      toast.error("Please enter a name");
      return;
    }

    const person: Person = {
      id: Date.now().toString(),
      name: newPersonName.trim(),
      paid: 0,
      shouldPay: 0
    };

    setPeople([...people, person]);
    setNewPersonName("");
    toast.success(`${person.name} added!`);
  };

  const removePerson = (id: string) => {
    setPeople(people.filter(p => p.id !== id));
    setSelectedPayers(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setSelectedSplitters(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    const newPaidAmounts = { ...paidAmounts };
    delete newPaidAmounts[id];
    setPaidAmounts(newPaidAmounts);
  };

  const calculateSplit = () => {
    if (!totalBill || parseFloat(totalBill) <= 0) {
      toast.error("Please enter a valid total bill amount");
      return;
    }

    if (selectedSplitters.size === 0) {
      toast.error("Please select at least one person to split the bill");
      return;
    }

    const total = parseFloat(totalBill);
    const totalPaid = Object.values(paidAmounts).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

    if (Math.abs(totalPaid - total) > 0.01) {
      toast.error(`Total paid ($${totalPaid.toFixed(2)}) doesn't match bill amount ($${total.toFixed(2)})`);
      return;
    }

    const sharePerPerson = total / selectedSplitters.size;

    const updatedPeople = people.map(person => {
      const paid = parseFloat(paidAmounts[person.id] || "0");
      const shouldPay = selectedSplitters.has(person.id) ? sharePerPerson : 0;
      return { ...person, paid, shouldPay };
    });

    setPeople(updatedPeople);
    setShowResults(true);
    toast.success("Bill split calculated!");
  };

  const reset = () => {
    setPeople([]);
    setNewPersonName("");
    setTotalBill("");
    setSelectedPayers(new Set());
    setSelectedSplitters(new Set());
    setPaidAmounts({});
    setShowResults(false);
  };

  const getSettlement = () => {
    const debtors: { person: Person; owes: number }[] = [];
    const creditors: { person: Person; gets: number }[] = [];

    people.forEach(person => {
      const balance = person.paid - person.shouldPay;
      if (balance < -0.01) {
        debtors.push({ person, owes: Math.abs(balance) });
      } else if (balance > 0.01) {
        creditors.push({ person, gets: balance });
      }
    });

    return { debtors, creditors };
  };

  const { debtors, creditors } = showResults ? getSettlement() : { debtors: [], creditors: [] };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Bill Splitter</h2>
      </div>

      <div className="space-y-6">
        {/* Add People */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Add Participants</label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter name"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPerson()}
              className="bg-input border-border text-foreground"
            />
            <Button onClick={addPerson} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* People List */}
        {people.length > 0 && (
          <div className="space-y-3">
            {people.map(person => (
              <div key={person.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="font-medium text-foreground">{person.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePerson(person.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {people.length > 0 && (
          <>
            {/* Total Bill */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Total Bill Amount ($)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={totalBill}
                onChange={(e) => setTotalBill(e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>

            {/* Who Paid */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Who Paid? (Enter amounts)</label>
              <div className="space-y-2">
                {people.map(person => (
                  <div key={person.id} className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedPayers.has(person.id)}
                      onCheckedChange={(checked) => {
                        const newSet = new Set(selectedPayers);
                        if (checked) {
                          newSet.add(person.id);
                        } else {
                          newSet.delete(person.id);
                          const newAmounts = { ...paidAmounts };
                          delete newAmounts[person.id];
                          setPaidAmounts(newAmounts);
                        }
                        setSelectedPayers(newSet);
                      }}
                    />
                    <span className="flex-1 text-foreground">{person.name}</span>
                    {selectedPayers.has(person.id) && (
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={paidAmounts[person.id] || ""}
                        onChange={(e) => setPaidAmounts({ ...paidAmounts, [person.id]: e.target.value })}
                        className="w-32 bg-input border-border text-foreground"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Split Between */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Split Between</label>
              <div className="space-y-2">
                {people.map(person => (
                  <div key={person.id} className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedSplitters.has(person.id)}
                      onCheckedChange={(checked) => {
                        const newSet = new Set(selectedSplitters);
                        if (checked) {
                          newSet.add(person.id);
                        } else {
                          newSet.delete(person.id);
                        }
                        setSelectedSplitters(newSet);
                      }}
                    />
                    <span className="text-foreground">{person.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculate Button */}
            <div className="flex gap-2">
              <Button onClick={calculateSplit} className="flex-1 bg-primary hover:bg-primary/90">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Split
              </Button>
              <Button onClick={reset} variant="outline" className="border-border text-foreground hover:bg-secondary">
                Reset
              </Button>
            </div>

            {/* Results */}
            {showResults && (
              <div className="space-y-4 p-4 bg-secondary rounded-lg">
                <h3 className="font-bold text-foreground text-lg">Settlement Details</h3>
                
                {creditors.length > 0 && (
                  <div>
                    <p className="text-sm text-success font-semibold mb-2">Should Receive:</p>
                    {creditors.map(({ person, gets }) => (
                      <p key={person.id} className="text-foreground ml-4">
                        {person.name} should receive <span className="font-bold text-success">${gets.toFixed(2)}</span>
                      </p>
                    ))}
                  </div>
                )}

                {debtors.length > 0 && (
                  <div>
                    <p className="text-sm text-destructive font-semibold mb-2">Needs to Pay:</p>
                    {debtors.map(({ person, owes }) => (
                      <p key={person.id} className="text-foreground ml-4">
                        {person.name} needs to pay <span className="font-bold text-destructive">${owes.toFixed(2)}</span>
                      </p>
                    ))}
                  </div>
                )}

                {creditors.length === 0 && debtors.length === 0 && (
                  <p className="text-muted-foreground text-center">Everyone is settled up! 🎉</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
