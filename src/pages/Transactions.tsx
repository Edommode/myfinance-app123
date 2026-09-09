import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowLeft, ArrowUpRight, Filter, Loader2, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type Transaction = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: "income" | "expense";
};

const currency = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

const Transactions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState(new Date().toISOString().slice(0, 7));
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadTransactions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const start = `${monthFilter}-01`;
    const endDate = new Date(Number(monthFilter.slice(0, 4)), Number(monthFilter.slice(5, 7)), 0);
    const end = endDate.toISOString().slice(0, 10);
    const [incomeResult, expenseResult] = await Promise.all([
      supabase.from("incomes").select("id, amount, category, description, date").eq("user_id", user.id).gte("date", start).lte("date", end),
      supabase.from("expenses").select("id, amount, category, description, date").eq("user_id", user.id).gte("date", start).lte("date", end),
    ]);
    const error = incomeResult.error || expenseResult.error;
    if (error) toast({ title: "Transactions could not be loaded", description: error.message, variant: "destructive" });
    const combined: Transaction[] = [
      ...((incomeResult.data ?? []).map((item) => ({ ...item, type: "income" as const }))),
      ...((expenseResult.data ?? []).map((item) => ({ ...item, type: "expense" as const }))),
    ].sort((a, b) => b.date.localeCompare(a.date));
    setTransactions(combined);
    setLoading(false);
  }, [monthFilter, toast, user]);

  useEffect(() => { void loadTransactions(); }, [loadTransactions]);

  const filtered = useMemo(() => transactions.filter((item) => {
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const phrase = `${item.description} ${item.category}`.toLowerCase();
    return matchesType && phrase.includes(search.toLowerCase());
  }), [search, transactions, typeFilter]);

  const income = filtered.filter((item) => item.type === "income").reduce((sum, item) => sum + Number(item.amount), 0);
  const expenses = filtered.filter((item) => item.type === "expense").reduce((sum, item) => sum + Number(item.amount), 0);

  const deleteTransaction = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    const table = pendingDelete.type === "income" ? "incomes" : "expenses";
    const { error } = await supabase.from(table).delete().eq("id", pendingDelete.id).eq("user_id", user!.id);
    setDeleting(false);
    if (error) {
      toast({ title: "Transaction not deleted", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Transaction deleted" });
    setPendingDelete(null);
    await loadTransactions();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6"><button className="flex items-center gap-3" onClick={() => navigate("/dashboard")}><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-700 font-bold text-white">MF</span><span className="font-bold">MyFinance</span></button><Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}><ArrowLeft className="mr-2 h-4 w-4" />Dashboard</Button></div></header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-7"><p className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-700"><Filter className="h-4 w-4" />Money records</p><h1 className="text-3xl font-bold">Transactions</h1><p className="mt-2 text-slate-600">Review and manage your recorded income and expenses.</p></div>
        <section className="mb-6 grid gap-4 sm:grid-cols-3"><Card><CardContent className="p-5"><p className="text-sm text-slate-500">Filtered income</p><p className="mt-1 text-2xl font-bold text-emerald-700">{currency.format(income)}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-slate-500">Filtered expenses</p><p className="mt-1 text-2xl font-bold text-rose-700">{currency.format(expenses)}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-slate-500">Net cash flow</p><p className={`mt-1 text-2xl font-bold ${income - expenses >= 0 ? "text-blue-700" : "text-rose-700"}`}>{currency.format(income - expenses)}</p></CardContent></Card></section>
        <Card>
          <CardHeader><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><CardTitle>Transaction register</CardTitle><div className="flex flex-col gap-2 sm:flex-row"><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><Input className="pl-9" placeholder="Search records" value={search} onChange={(event) => setSearch(event.target.value)} /></div><Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All types</SelectItem><SelectItem value="income">Income</SelectItem><SelectItem value="expense">Expenses</SelectItem></SelectContent></Select><Input className="w-full sm:w-40" type="month" value={monthFilter} onChange={(event) => setMonthFilter(event.target.value)} /></div></div></CardHeader>
          <CardContent>{loading ? <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-emerald-700" /></div> : filtered.length === 0 ? <div className="rounded-xl border border-dashed py-12 text-center text-slate-500">No matching transactions found.</div> : <div className="divide-y">{filtered.map((item) => <div key={`${item.type}-${item.id}`} className="flex items-center gap-3 py-4"><span className={`rounded-full p-2 ${item.type === "income" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{item.type === "income" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}</span><div className="min-w-0 flex-1"><p className="truncate font-medium">{item.description}</p><p className="text-xs text-slate-500">{item.category} · {new Date(`${item.date}T00:00:00`).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p></div><p className={`font-bold ${item.type === "income" ? "text-emerald-700" : "text-rose-700"}`}>{item.type === "income" ? "+" : "−"}{currency.format(item.amount)}</p><Button aria-label={`Delete ${item.description}`} variant="ghost" size="icon" onClick={() => setPendingDelete(item)}><Trash2 className="h-4 w-4 text-slate-400" /></Button></div>)}</div>}</CardContent>
        </Card>
      </main>
      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete this transaction?</AlertDialogTitle><AlertDialogDescription>This permanently removes “{pendingDelete?.description}” from your records and recalculates your reports.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep transaction</AlertDialogCancel><AlertDialogAction className="bg-rose-700 hover:bg-rose-800" disabled={deleting} onClick={(event) => { event.preventDefault(); void deleteTransaction(); }}>{deleting ? "Deleting…" : "Delete"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
};

export default Transactions;
