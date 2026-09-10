import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownRight,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  PiggyBank,
  ReceiptText,
  Target,
  TrendingUp,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { BudgetDialog, SavingsContributionDialog, SavingsGoalDialog, TransactionDialog } from "@/components/DashboardActions";

type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
};

type Income = Expense;

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

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profileIncome, setProfileIncome] = useState(0);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const startOfMonth = useMemo(() => {
    const current = new Date();
    return new Date(current.getFullYear(), current.getMonth(), 1).toISOString().slice(0, 10);
  }, []);

  const loadDashboard = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const [profileResult, incomeResult, expenseResult, goalsResult, budgetsResult, healthResult] = await Promise.all([
      supabase.from("profiles").select("monthly_income").eq("id", user.id).maybeSingle(),
      supabase.from("incomes").select("id, amount, category, description, date").eq("user_id", user.id).gte("date", startOfMonth).order("date", { ascending: false }),
      supabase.from("expenses").select("id, amount, category, description, date").eq("user_id", user.id).gte("date", startOfMonth).order("date", { ascending: false }),
      supabase.from("savings_goals").select("id, name, current_amount, target_amount, target_date").eq("user_id", user.id).eq("is_completed", false).order("created_at", { ascending: false }).limit(3),
      supabase.from("budgets").select("id, name, total_amount").eq("user_id", user.id).lte("start_date", today).gte("end_date", today).limit(1),
      supabase.from("financial_health_assessments").select("health_score").eq("user_id", user.id).order("completed_at", { ascending: false }).limit(1).maybeSingle(),
    ]);

    const firstError = [profileResult.error, incomeResult.error, expenseResult.error, goalsResult.error, budgetsResult.error, healthResult.error].find(Boolean);
    if (firstError) {
      toast({ title: "Could not load all dashboard data", description: firstError.message, variant: "destructive" });
    }

    setProfileIncome(Number(profileResult.data?.monthly_income ?? 0));
    setIncomes((incomeResult.data ?? []) as Income[]);
    setExpenses((expenseResult.data ?? []) as Expense[]);
    setGoals((goalsResult.data ?? []) as SavingsGoal[]);
    setBudgets((budgetsResult.data ?? []) as Budget[]);
    setHealthScore(healthResult.data?.health_score ?? null);
    setLoading(false);
  }, [startOfMonth, toast, today, user]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const recordedIncome = incomes.reduce((sum, income) => sum + Number(income.amount), 0);
  const monthlyIncome = recordedIncome || profileIncome;
  const monthlyExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const balance = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? Math.max(0, Math.round((balance / monthlyIncome) * 100)) : 0;
  const activeBudget = budgets[0];
  const budgetUsed = activeBudget?.total_amount ? Math.min(100, Math.round((monthlyExpenses / Number(activeBudget.total_amount)) * 100)) : 0;

  const chartData = useMemo(() => {
    const days = Array.from({ length: 4 }, (_, index) => {
      const end = new Date();
      end.setDate(end.getDate() - index * 7);
      const start = new Date(end);
      start.setDate(end.getDate() - 6);
      return { start, end, name: `W${4 - index}`, income: 0, expenses: 0 };
    }).reverse();
    const add = (items: Expense[], key: "income" | "expenses") => items.forEach((item) => {
      const itemDate = new Date(`${item.date}T00:00:00`);
      const week = days.find((entry) => itemDate >= entry.start && itemDate <= entry.end);
      if (week) week[key] += Number(item.amount);
    });
    add(incomes, "income");
    add(expenses, "expenses");
    return days.map(({ name, income, expenses: outflow }) => ({ name, Income: income, Expenses: outflow }));
  }, [expenses, incomes]);
  const maxChartValue = Math.max(1, ...chartData.flatMap((item) => [item.Income, item.Expenses]));

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
            <Button variant="ghost" size="sm" onClick={() => navigate("/transactions")}><ReceiptText className="mr-2 h-4 w-4" />Transactions</Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/profile")}><UserRound className="mr-2 h-4 w-4" />Profile</Button>
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
          {user && <TransactionDialog userId={user.id} onSaved={loadDashboard} />}
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

        <section className="mt-6">
          <Card>
            <CardHeader><CardTitle>Four-week cash flow</CardTitle></CardHeader>
            <CardContent>
              <div className="mb-5 flex gap-5 text-xs text-slate-600"><span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-emerald-700" />Income</span><span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-rose-600" />Expenses</span></div>
              <div className="grid h-52 grid-cols-4 gap-4 border-b border-slate-200">
                {chartData.map((item) => <div key={item.name} className="flex min-w-0 flex-col items-center justify-end gap-2"><div className="flex h-40 w-full items-end justify-center gap-2"><div title={`Income: ${currency.format(item.Income)}`} className="w-1/3 max-w-10 rounded-t bg-emerald-700 transition-all" style={{ height: `${Math.max(item.Income ? 4 : 0, (item.Income / maxChartValue) * 100)}%` }} /><div title={`Expenses: ${currency.format(item.Expenses)}`} className="w-1/3 max-w-10 rounded-t bg-rose-600 transition-all" style={{ height: `${Math.max(item.Expenses ? 4 : 0, (item.Expenses / maxChartValue) * 100)}%` }} /></div><span className="pb-2 text-xs font-medium text-slate-500">{item.name}</span></div>)}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="flex items-center gap-2"><ReceiptText className="h-5 w-5 text-emerald-700" />Recent expenses</CardTitle><span className="text-sm text-slate-500">This month</span></CardHeader>
            <CardContent>
              {expenses.length === 0 ? <div className="rounded-xl border border-dashed p-8 text-center text-slate-500">No expenses recorded this month.</div> : <div className="space-y-1">{expenses.slice(0, 7).map((expense) => <div key={expense.id} className="flex items-center justify-between border-b py-3 last:border-0"><div><p className="font-medium">{expense.description}</p><p className="text-xs text-slate-500">{expense.category} · {new Date(`${expense.date}T00:00:00`).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</p></div><span className="font-semibold text-rose-700">−{currency.format(expense.amount)}</span></div>)}</div>}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card><CardHeader><div className="flex items-center justify-between gap-3"><CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-blue-700" />Monthly budget</CardTitle>{user && <BudgetDialog userId={user.id} onSaved={loadDashboard} />}</div></CardHeader><CardContent>{activeBudget ? <div className="space-y-3"><div className="flex justify-between text-sm"><span>{activeBudget.name}</span><strong>{budgetUsed}% used</strong></div><Progress value={budgetUsed} /><p className="text-sm text-slate-500">{currency.format(monthlyExpenses)} of {currency.format(activeBudget.total_amount)}</p></div> : <p className="text-sm text-slate-500">No active budget yet. Create one to set your monthly spending limit.</p>}</CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-amber-700" />Financial health</CardTitle></CardHeader><CardContent><div className="flex items-end gap-2"><span className="text-4xl font-bold">{healthScore ?? "—"}</span><span className="pb-1 text-slate-500">/100</span></div><p className="mt-3 text-sm text-slate-500">{healthScore === null ? "Complete your health assessment to identify your priority actions." : "Your latest assessment score."}</p><Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => navigate("/health-assessment")}>{healthScore === null ? "Take assessment" : "Retake assessment"}</Button></CardContent></Card>
          </div>
        </section>

        <section className="mt-6">
          <Card><CardHeader><div className="flex items-center justify-between gap-3"><CardTitle className="flex items-center gap-2"><PiggyBank className="h-5 w-5 text-emerald-700" />Savings goals</CardTitle>{user && <SavingsGoalDialog userId={user.id} onSaved={loadDashboard} />}</div></CardHeader><CardContent className="grid gap-4 md:grid-cols-3">{goals.length === 0 ? <p className="text-sm text-slate-500">No savings goals yet. Create your first goal to start tracking progress.</p> : goals.map((goal) => { const currentAmount = Number(goal.current_amount ?? 0); const progress = Math.min(100, Math.round((currentAmount / goal.target_amount) * 100)); return <div key={goal.id} className="rounded-xl border p-4"><div className="mb-3 flex items-start justify-between gap-3"><div><p className="font-semibold">{goal.name}</p><p className="text-xs text-slate-500">Target {currency.format(goal.target_amount)}</p></div><span className="text-sm font-bold text-emerald-700">{progress}%</span></div><Progress value={progress} /><p className="mt-3 text-sm text-slate-600">{currency.format(currentAmount)} saved</p>{user && <SavingsContributionDialog userId={user.id} goal={{ id: goal.id, name: goal.name, currentAmount, targetAmount: Number(goal.target_amount) }} onSaved={loadDashboard} />}</div>; })}</CardContent></Card>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
