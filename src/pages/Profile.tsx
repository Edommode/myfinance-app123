import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Save, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const financialPriorities = [
  "Build an emergency fund",
  "Control my spending",
  "Pay down debt",
  "Save for a major purchase",
  "Start investing",
  "Grow business capital",
  "Plan for retirement",
];

type ProfileForm = {
  full_name: string;
  email: string;
  phone: string;
  occupation: string;
  date_of_birth: string;
  monthly_income: string;
  financial_goals: string[];
};

const emptyProfile: ProfileForm = {
  full_name: "",
  email: "",
  phone: "",
  occupation: "",
  date_of_birth: "",
  monthly_income: "",
  financial_goals: [],
};

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProfileForm>(emptyProfile);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("full_name, email, phone, occupation, date_of_birth, monthly_income, financial_goals").eq("id", user.id).maybeSingle();
    if (error) toast({ title: "Profile could not be loaded", description: error.message, variant: "destructive" });
    setForm({
      full_name: data?.full_name ?? user.user_metadata?.full_name ?? "",
      email: data?.email ?? user.email ?? "",
      phone: data?.phone ?? user.user_metadata?.phone ?? "",
      occupation: data?.occupation ?? "",
      date_of_birth: data?.date_of_birth ?? "",
      monthly_income: data?.monthly_income ? String(data.monthly_income) : "",
      financial_goals: data?.financial_goals ?? [],
    });
    setLoading(false);
  }, [toast, user]);

  useEffect(() => { void loadProfile(); }, [loadProfile]);

  const completion = useMemo(() => {
    const fields = [form.full_name, form.email, form.phone, form.occupation, form.date_of_birth, form.monthly_income, form.financial_goals.length ? "yes" : ""];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [form]);

  const update = (field: keyof ProfileForm, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const toggleGoal = (goal: string, checked: boolean) => setForm((current) => ({
    ...current,
    financial_goals: checked ? [...current.financial_goals, goal] : current.financial_goals.filter((item) => item !== goal),
  }));

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: form.full_name.trim(),
      email: form.email,
      phone: form.phone.trim() || null,
      occupation: form.occupation.trim() || null,
      date_of_birth: form.date_of_birth || null,
      monthly_income: form.monthly_income ? Number(form.monthly_income) : null,
      financial_goals: form.financial_goals,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) {
      toast({ title: "Profile not saved", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Profile updated", description: "Your dashboard and recommendations will use the latest information." });
    await loadProfile();
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><Loader2 className="h-8 w-8 animate-spin text-emerald-700" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white"><div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6"><button className="flex items-center gap-3" onClick={() => navigate("/dashboard")}><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-700 font-bold text-white">MF</span><span className="font-bold">MyFinance</span></button><Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}><ArrowLeft className="mr-2 h-4 w-4" />Dashboard</Button></div></header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-7"><p className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-700"><UserRound className="h-4 w-4" />Personalisation profile</p><h1 className="text-3xl font-bold">Your financial profile</h1><p className="mt-2 text-slate-600">Keep this information current so MyFinance can give you more relevant insights.</p></div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2"><CardHeader><CardTitle>Personal and income details</CardTitle><CardDescription>Your information is stored against your authenticated account.</CardDescription></CardHeader><CardContent><form className="space-y-6" onSubmit={saveProfile}><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="full-name">Full name</Label><Input id="full-name" value={form.full_name} onChange={(event) => update("full_name", event.target.value)} required /></div><div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" value={form.email} disabled /></div><div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+234…" /></div><div className="space-y-2"><Label htmlFor="occupation">Occupation</Label><Input id="occupation" value={form.occupation} onChange={(event) => update("occupation", event.target.value)} placeholder="e.g. Accountant" /></div><div className="space-y-2"><Label htmlFor="birth-date">Date of birth</Label><Input id="birth-date" type="date" value={form.date_of_birth} onChange={(event) => update("date_of_birth", event.target.value)} /></div><div className="space-y-2"><Label htmlFor="monthly-income">Typical monthly income (₦)</Label><Input id="monthly-income" type="number" min="0" step="0.01" value={form.monthly_income} onChange={(event) => update("monthly_income", event.target.value)} /></div></div><div><Label className="mb-3 block">What are your current financial priorities?</Label><div className="grid gap-3 sm:grid-cols-2">{financialPriorities.map((goal) => <label key={goal} className="flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-3 text-sm"><Checkbox checked={form.financial_goals.includes(goal)} onCheckedChange={(checked) => toggleGoal(goal, checked === true)} /><span>{goal}</span></label>)}</div></div><Button type="submit" className="bg-emerald-700 hover:bg-emerald-800" disabled={saving}><Save className="mr-2 h-4 w-4" />{saving ? "Saving…" : "Save profile"}</Button></form></CardContent></Card>
          <div className="space-y-6"><Card><CardHeader><CardTitle>Profile completeness</CardTitle></CardHeader><CardContent><div className="mb-3 flex items-end justify-between"><span className="text-4xl font-bold text-emerald-700">{completion}%</span>{completion === 100 && <CheckCircle2 className="h-7 w-7 text-emerald-600" />}</div><Progress value={completion} /><p className="mt-4 text-sm text-slate-500">Complete profiles produce more useful budgets, health assessments and recommendations.</p></CardContent></Card><Card className="border-emerald-100 bg-emerald-50"><CardHeader><CardTitle className="text-emerald-950">Why monthly income matters</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-emerald-900">Until you record income transactions, your dashboard uses this typical monthly figure to calculate available balance and savings rate.</CardContent></Card></div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
