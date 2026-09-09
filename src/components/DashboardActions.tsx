import { FormEvent, useState } from "react";
import { CalendarDays, PiggyBank, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type ActionProps = {
  userId: string;
  onSaved: () => Promise<void>;
};

const currency = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
const expenseCategories = ["Food", "Transport", "Housing", "Utilities", "Health", "Education", "Debt", "Lifestyle", "Other"];
const incomeCategories = ["Salary", "Business", "Freelance", "Investment", "Gift", "Other"];

export const TransactionDialog = ({ userId, onSaved }: ActionProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const changeType = (value: string) => {
    const nextType = value as "income" | "expense";
    setType(nextType);
    setCategory(nextType === "income" ? "Salary" : "Food");
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (Number(amount) <= 0) return;
    setSaving(true);
    const payload = { user_id: userId, description: description.trim(), amount: Number(amount), category, date };
    const { error } = type === "income"
      ? await supabase.from("incomes").insert(payload)
      : await supabase.from("expenses").insert(payload);
    setSaving(false);

    if (error) {
      toast({ title: `${type === "income" ? "Income" : "Expense"} not saved`, description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: `${type === "income" ? "Income" : "Expense"} recorded`, description: `${currency.format(Number(amount))} added to ${category}.` });
    setAmount("");
    setDescription("");
    setOpen(false);
    await onSaved();
  };

  const categories = type === "income" ? incomeCategories : expenseCategories;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="bg-emerald-700 hover:bg-emerald-800"><Plus className="mr-2 h-4 w-4" />Add transaction</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add a transaction</DialogTitle></DialogHeader>
        <Tabs value={type} onValueChange={changeType}><TabsList className="grid w-full grid-cols-2"><TabsTrigger value="expense">Expense</TabsTrigger><TabsTrigger value="income">Income</TabsTrigger></TabsList></Tabs>
        <form className="space-y-4" onSubmit={save}>
          <div className="space-y-2"><Label htmlFor="transaction-description">Description</Label><Input id="transaction-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder={type === "income" ? "e.g. September salary" : "e.g. Weekly groceries"} required /></div>
          <div className="space-y-2"><Label htmlFor="transaction-amount">Amount (₦)</Label><Input id="transaction-amount" type="number" min="1" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required /></div>
          <div className="space-y-2"><Label>Category</Label><Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label htmlFor="transaction-date">Date</Label><Input id="transaction-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></div>
          <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800" disabled={saving}>{saving ? "Saving…" : `Save ${type}`}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const BudgetDialog = ({ userId, onSaved }: ActionProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("Monthly spending plan");
  const [amount, setAmount] = useState("");
  const current = new Date();
  const defaultStart = new Date(current.getFullYear(), current.getMonth(), 1).toISOString().slice(0, 10);
  const defaultEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0).toISOString().slice(0, 10);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("budgets").insert({ user_id: userId, name: name.trim(), total_amount: Number(amount), start_date: defaultStart, end_date: defaultEnd, period: "monthly" });
    setSaving(false);
    if (error) {
      toast({ title: "Budget not saved", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Monthly budget created", description: `Your spending limit is ${currency.format(Number(amount))}.` });
    setOpen(false);
    await onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline" size="sm"><CalendarDays className="mr-2 h-4 w-4" />Create budget</Button></DialogTrigger>
      <DialogContent><DialogHeader><DialogTitle>Create this month’s budget</DialogTitle></DialogHeader><form className="space-y-4" onSubmit={save}><div className="space-y-2"><Label htmlFor="budget-name">Budget name</Label><Input id="budget-name" value={name} onChange={(event) => setName(event.target.value)} required /></div><div className="space-y-2"><Label htmlFor="budget-amount">Spending limit (₦)</Label><Input id="budget-amount" type="number" min="1" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required /></div><p className="text-sm text-slate-500">Period: {defaultStart} to {defaultEnd}</p><Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800" disabled={saving}>{saving ? "Saving…" : "Create budget"}</Button></form></DialogContent>
    </Dialog>
  );
};

export const SavingsGoalDialog = ({ userId, onSaved }: ActionProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("0");
  const [targetDate, setTargetDate] = useState("");

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("savings_goals").insert({ user_id: userId, name: name.trim(), target_amount: Number(targetAmount), current_amount: Number(currentAmount), target_date: targetDate || null, is_completed: false });
    setSaving(false);
    if (error) {
      toast({ title: "Goal not saved", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Savings goal created", description: `${name} has a target of ${currency.format(Number(targetAmount))}.` });
    setName("");
    setTargetAmount("");
    setCurrentAmount("0");
    setTargetDate("");
    setOpen(false);
    await onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline" size="sm"><PiggyBank className="mr-2 h-4 w-4" />New savings goal</Button></DialogTrigger>
      <DialogContent><DialogHeader><DialogTitle>Create a savings goal</DialogTitle></DialogHeader><form className="space-y-4" onSubmit={save}><div className="space-y-2"><Label htmlFor="goal-name">Goal name</Label><Input id="goal-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Emergency fund" required /></div><div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label htmlFor="goal-target">Target (₦)</Label><Input id="goal-target" type="number" min="1" value={targetAmount} onChange={(event) => setTargetAmount(event.target.value)} required /></div><div className="space-y-2"><Label htmlFor="goal-current">Already saved (₦)</Label><Input id="goal-current" type="number" min="0" value={currentAmount} onChange={(event) => setCurrentAmount(event.target.value)} required /></div></div><div className="space-y-2"><Label htmlFor="goal-date">Target date</Label><Input id="goal-date" type="date" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} /></div><Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800" disabled={saving}>{saving ? "Saving…" : "Create goal"}</Button></form></DialogContent>
    </Dialog>
  );
};
