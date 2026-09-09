import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownRight,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  PiggyBank,
  Plus,
  ReceiptText,
  Target,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
};

type SavingsGoal = {
  id: string;
  name: string;
  current_amount: number | null;
  target_amount: number;
  target_date: string | null;
};

type Budget = {
  id: string;
  name: string;
  total_amount: number;
};

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const expenseCategories = ["Food", "Transport", "Housing", "Utilities", "Health", "Education", "Debt", "Lifestyle", "Other"];

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const startOfMonth = useMemo(() => {
    const current = new Date();
    return new Date(current.getFullYear(), current.getMonth(), 1).toISOString().slice(0, 10);
  }, []);

  const loadDashboard = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const [profileResult, expenseResult, goalsResult, budgetsResult, healthResult] = await Promise.all([
      supabase.from("profiles").select("monthly_income").eq("id", user.id).maybeSingle(),
      supabase.from("expenses").select("id, amount, category, description, date").eq("user_id", user.id).gte("date", startOfMonth).order("date", { ascending: false }),
      supabase.from("savings_goals").select("id, name, current_amount, target_amount, target_date").eq("user_id", user.id).eq("is_completed", false).order("created_at", { ascending: false }).limit(3),
      supabase.from("budgets").select("id, name, total_amount").eq("user_id", user.id).lte("start_date", date).gte("end_date", date).limit(1),
      supabase.from("financial_health_assessments").select("health_score").eq("user_id", user.id).order("completed_at", { ascending: false }).limit(1).maybeSingle(),
    ]);

    const firstError = [profileResult.error, expenseResult.error, goalsResult.error, budgetsResult.error, healthResult.error].find(Boolean);
    if (firstError) {
      toast({ title: "Could not load all dashboard data", description: firstError.message, variant: "destructive" });
    }

    setMonthlyIncome(Number(profileResult.data?.monthly_income ?? 0));
    setExpenses((expenseResult.data ?? []) as Expense[]);
    setGoals((goalsResult.data ?? []) as SavingsGoal[]);
    setBudgets((budgetsResult.data ?? []) as Budget[]);
    setHealthScore(healthResult.data?.health_score ?? null);
    setLoading(false);
  }, [date, startOfMonth, toast, user]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const monthlyExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const balance = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? Math.max(0, Math.round((balance / monthlyIncome) * 100)) : 0;
  const activeBudget = budgets[0];
  const budgetUsed = activeBudget?.total_amount ? Math.min(100, Math.round((monthlyExpenses / Number(activeBudget.total_amount)) * 100)) : 0;

  const addExpense = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || Number(amount) <= 0) return;
    setSaving(true);
    const { error } = await supabase.from("expenses").insert({
      user_id: user.id,
      description: description.trim(),
      amount: Number(amount),
      category,
      date,
    });
    setSaving(false);

    if (error) {
      toast({ title: "Expense not saved", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Expense recorded", description: `${currency.format(Number(amount))} added to ${category}.` });
    setAmount("");
    setDescription("");
    setDialogOpen(false);
    await loadDashboard();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button className="flex items-center gap-3" onClick={() => navigate("/")}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-700 font-bold text-white">MF</span>
            <span className="text-left"><strong className="block text-lg">MyFinance</strong><span className="text-xs text-slate-500">by Finance Wise</span></span>
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:block">{user?.user_metadata?.full_name || user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" />Sign out</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-700"><LayoutDashboard className="h-4 w-4" />Financial command centre</p>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.user_metadata?.full_name?.split(" ")[0] || "there"}</h1>
            <p className="mt-2 text-slate-600">Here is your money position for {new Date().toLocaleString("en-NG", { month: "long", year: "numeric" })}.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button className="bg-emerald-700 hover:bg-emerald-800"><Plus className="mr-2 h-4 w-4" />Record expense</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record an expense</DialogTitle></DialogHeader>
              <form className="space-y-4" onSubmit={addExpense}>
                <div className="space-y-2"><Label htmlFor="description">Description</Label><Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Weekly groceries" required /></div>
                <div className="space-y-2"><Label htmlFor="amount">Amount (₦)</Label><Input id="amount" type="number" min="1" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required /></div>
                <div className="space-y-2"><Label>Category</Label><Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{expenseCategories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label htmlFor="date">Date</Label><Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></div>
                <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800" disabled={saving}>{saving ? "Saving…" : "Save expense"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Monthly income", value: monthlyIncome, icon: TrendingUp, tone: "text-emerald-700 bg-emerald-50" },
            { label: "Expenses", value: monthlyExpenses, icon: ArrowDownRight, tone: "text-rose-700 bg-rose-50" },
            { label: "Available balance", value: balance, icon: WalletCards, tone: "text-blue-700 bg-blue-50" },
            { label: "Savings rate", value: savingsRate, icon: PiggyBank, tone: "text-amber-700 bg-amber-50", percent: true },
          ].map(({ label, value, icon: Icon, tone, percent }) => (
            <Card key={label}><CardContent className="flex items-start justify-between p-6"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold">{loading ? "—" : percent ? `${value}%` : currency.format(value)}</p></div><span className={`rounded-xl p-3 ${tone}`}><Icon className="h-5 w-5" /></span></CardContent></Card>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="flex items-center gap-2"><ReceiptText className="h-5 w-5 text-emerald-700" />Recent expenses</CardTitle><span className="text-sm text-slate-500">This month</span></CardHeader>
            <CardContent>
              {expenses.length === 0 ? <div className="rounded-xl border border-dashed p-8 text-center text-slate-500">No expenses recorded this month.</div> : <div className="space-y-1">{expenses.slice(0, 7).map((expense) => <div key={expense.id} className="flex items-center justify-between border-b py-3 last:border-0"><div><p className="font-medium">{expense.description}</p><p className="text-xs text-slate-500">{expense.category} · {new Date(`${expense.date}T00:00:00`).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</p></div><span className="font-semibold text-rose-700">−{currency.format(expense.amount)}</span></div>)}</div>}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-blue-700" />Monthly budget</CardTitle></CardHeader><CardContent>{activeBudget ? <div className="space-y-3"><div className="flex justify-between text-sm"><span>{activeBudget.name}</span><strong>{budgetUsed}% used</strong></div><Progress value={budgetUsed} /><p className="text-sm text-slate-500">{currency.format(monthlyExpenses)} of {currency.format(activeBudget.total_amount)}</p></div> : <p className="text-sm text-slate-500">No active budget yet. Budget creation is coming in the next build.</p>}</CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-amber-700" />Financial health</CardTitle></CardHeader><CardContent><div className="flex items-end gap-2"><span className="text-4xl font-bold">{healthScore ?? "—"}</span><span className="pb-1 text-slate-500">/100</span></div><p className="mt-3 text-sm text-slate-500">{healthScore === null ? "Complete your health assessment to unlock personalised guidance." : "Your latest assessment score."}</p></CardContent></Card>
          </div>
        </section>

        <section className="mt-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><PiggyBank className="h-5 w-5 text-emerald-700" />Savings goals</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-3">{goals.length === 0 ? <p className="text-sm text-slate-500">No savings goals yet.</p> : goals.map((goal) => { const progress = Math.min(100, Math.round(((goal.current_amount ?? 0) / goal.target_amount) * 100)); return <div key={goal.id} className="rounded-xl border p-4"><div className="mb-3 flex items-start justify-between gap-3"><div><p className="font-semibold">{goal.name}</p><p className="text-xs text-slate-500">Target {currency.format(goal.target_amount)}</p></div><span className="text-sm font-bold text-emerald-700">{progress}%</span></div><Progress value={progress} /><p className="mt-3 text-sm text-slate-600">{currency.format(goal.current_amount ?? 0)} saved</p></div>; })}</CardContent></Card>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
