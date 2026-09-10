import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, ClipboardCheck, RotateCcw, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Question = {
  dimension: string;
  prompt: string;
  options: { label: string; score: number }[];
};

const questions: Question[] = [
  { dimension: "Cash flow", prompt: "At the end of a typical month, what happens to your income?", options: [{ label: "I regularly spend more than I earn", score: 0 }, { label: "I use almost everything and sometimes borrow", score: 1 }, { label: "I usually break even", score: 2 }, { label: "I usually have money left", score: 3 }, { label: "I consistently keep a planned surplus", score: 4 }] },
  { dimension: "Saving", prompt: "What portion of your income do you save consistently?", options: [{ label: "I do not currently save", score: 0 }, { label: "Less than 5%", score: 1 }, { label: "5%–10%", score: 2 }, { label: "11%–20%", score: 3 }, { label: "More than 20%", score: 4 }] },
  { dimension: "Emergency fund", prompt: "How many months of essential expenses could your emergency savings cover?", options: [{ label: "None", score: 0 }, { label: "Less than one month", score: 1 }, { label: "One to two months", score: 2 }, { label: "Three to six months", score: 3 }, { label: "More than six months", score: 4 }] },
  { dimension: "Debt", prompt: "How manageable are your current debt repayments?", options: [{ label: "I am behind or struggling seriously", score: 0 }, { label: "Repayments consume a large part of my income", score: 1 }, { label: "Repayments are manageable but restrictive", score: 2 }, { label: "Debt is low and always paid on time", score: 3 }, { label: "I have no costly debt", score: 4 }] },
  { dimension: "Budgeting", prompt: "How consistently do you plan and track your spending?", options: [{ label: "I do not plan or track", score: 0 }, { label: "I check only when money is tight", score: 1 }, { label: "I track occasionally", score: 2 }, { label: "I budget and review monthly", score: 3 }, { label: "I budget, track and adjust throughout the month", score: 4 }] },
  { dimension: "Protection", prompt: "How prepared are you for major financial shocks?", options: [{ label: "I have no financial protection", score: 0 }, { label: "I depend mainly on family or borrowing", score: 1 }, { label: "I have limited emergency support", score: 2 }, { label: "I have relevant cover and emergency savings", score: 3 }, { label: "My key risks are reviewed and adequately covered", score: 4 }] },
  { dimension: "Investing", prompt: "How would you describe your investment activity?", options: [{ label: "I do not invest", score: 0 }, { label: "I intend to start but have no plan", score: 1 }, { label: "I invest occasionally", score: 2 }, { label: "I invest consistently in understood products", score: 3 }, { label: "I follow a diversified long-term plan", score: 4 }] },
  { dimension: "Long-term planning", prompt: "Do you have defined long-term financial goals?", options: [{ label: "No goals yet", score: 0 }, { label: "General goals, but no figures or dates", score: 1 }, { label: "Some goals with rough estimates", score: 2 }, { label: "Clear goals with amounts and dates", score: 3 }, { label: "Clear goals that I fund and review regularly", score: 4 }] },
];

const guidance: Record<string, string> = {
  "Cash flow": "Create a positive monthly margin by separating essential spending from flexible spending and setting a realistic limit for each.",
  Saving: "Start with an affordable automatic amount and increase it gradually; consistency matters more than waiting for a perfect income level.",
  "Emergency fund": "Build a starter emergency reserve, then work toward three to six months of essential expenses.",
  Debt: "List debts by balance, interest cost and due date, maintain minimum payments, and direct extra repayments toward the costliest debt.",
  Budgeting: "Use MyFinance to record transactions weekly and compare actual spending with your monthly plan.",
  Protection: "Identify the financial shocks that would hurt most and review suitable emergency savings and regulated insurance options.",
  Investing: "Strengthen your emergency fund first, then learn about regulated investments that match your goals, timeline and risk capacity.",
  "Long-term planning": "Give each major goal a target amount, target date and regular contribution so progress can be measured.",
};

const statusFor = (score: number) => {
  if (score >= 80) return { label: "Strong", className: "bg-emerald-100 text-emerald-800", message: "Your foundation is strong. Focus on consistency, protection and long-term optimisation." };
  if (score >= 60) return { label: "Stable", className: "bg-blue-100 text-blue-800", message: "You have useful habits in place, with a few areas that can materially strengthen your position." };
  if (score >= 40) return { label: "Developing", className: "bg-amber-100 text-amber-800", message: "Your foundation is developing. Prioritise cash flow, saving and emergency resilience." };
  return { label: "Vulnerable", className: "bg-rose-100 text-rose-800", message: "Start with stability: essential spending, urgent debt pressure and a small emergency buffer." };
};

const HealthAssessment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const recommendations = useMemo(() => answers.map((score, index) => ({ dimension: questions[index].dimension, score, guidance: guidance[questions[index].dimension] })).sort((a, b) => a.score - b.score).slice(0, 3), [answers]);

  const answer = async (score: number) => {
    const nextAnswers = [...answers, score];
    setAnswers(nextAnswers);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      return;
    }
    const finalScore = Math.round((nextAnswers.reduce((sum, value) => sum + value, 0) / (questions.length * 4)) * 100);
    const status = statusFor(finalScore);
    const finalRecommendations = nextAnswers.map((value, index) => ({ dimension: questions[index].dimension, score: value, guidance: guidance[questions[index].dimension] })).sort((a, b) => a.score - b.score).slice(0, 3);
    setResult(finalScore);
    setSaving(true);
    const { error } = await supabase.from("financial_health_assessments").insert({
      user_id: user!.id,
      health_score: finalScore,
      health_category: status.label.toLowerCase(),
      assessment_data: { version: 2, answers: questions.map((question, index) => ({ dimension: question.dimension, score: nextAnswers[index] })) } as Json,
      recommendations: { priority_actions: finalRecommendations } as Json,
    });
    setSaving(false);
    if (error) toast({ title: "Your score was calculated but could not be saved", description: error.message, variant: "destructive" });
    else toast({ title: "Assessment saved", description: "Your dashboard now reflects your latest financial health score." });
  };

  const restart = () => { setAnswers([]); setCurrent(0); setResult(null); };

  if (result !== null) {
    const status = statusFor(result);
    return <div className="min-h-screen bg-slate-50"><header className="border-b bg-white"><div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4"><strong>MyFinance</strong><Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}><ArrowLeft className="mr-2 h-4 w-4" />Dashboard</Button></div></header><main className="mx-auto max-w-4xl px-4 py-8"><Card><CardHeader className="text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-emerald-700" /><CardTitle className="text-3xl">Your financial health score</CardTitle><div className="text-6xl font-bold text-emerald-800">{result}<span className="text-2xl text-slate-400">/100</span></div><div><Badge className={status.className}>{status.label}</Badge></div><CardDescription className="mx-auto max-w-xl text-base">{status.message}</CardDescription></CardHeader><CardContent><Progress value={result} className="mb-8" /><h2 className="mb-4 text-lg font-bold">Your three priority actions</h2><div className="grid gap-4 md:grid-cols-3">{recommendations.map((item, index) => <div key={item.dimension} className="rounded-xl border p-4"><span className="text-xs font-bold text-emerald-700">PRIORITY {index + 1}</span><h3 className="mt-2 font-bold">{item.dimension}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.guidance}</p></div>)}</div><div className="mt-8 rounded-xl bg-slate-100 p-4 text-xs leading-5 text-slate-600">This assessment is an educational self-check, not personalised investment, credit or insurance advice. Consider a qualified professional for decisions involving significant risk.</div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => navigate("/dashboard")}>Return to dashboard</Button><Button variant="outline" onClick={restart}><RotateCcw className="mr-2 h-4 w-4" />Retake assessment</Button></div></CardContent></Card></main></div>;
  }

  const question = questions[current];
  return <div className="min-h-screen bg-slate-50"><header className="border-b bg-white"><div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4"><strong>MyFinance</strong><Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}><ArrowLeft className="mr-2 h-4 w-4" />Exit</Button></div></header><main className="mx-auto max-w-3xl px-4 py-10"><div className="mb-8 text-center"><ClipboardCheck className="mx-auto mb-3 h-10 w-10 text-emerald-700" /><h1 className="text-3xl font-bold">Financial Health Check</h1><p className="mt-2 text-slate-600">Eight questions covering the foundations of everyday financial wellbeing.</p></div><Card><CardHeader><div className="mb-3 flex items-center justify-between text-sm"><span className="font-medium text-emerald-700">{question.dimension}</span><span className="text-slate-500">Question {current + 1} of {questions.length}</span></div><Progress value={(current / questions.length) * 100} /><CardTitle className="pt-4 text-xl">{question.prompt}</CardTitle><CardDescription>Select the answer that most closely reflects your present situation.</CardDescription></CardHeader><CardContent className="space-y-3">{question.options.map((option) => <Button key={option.label} variant="outline" className="h-auto w-full justify-start whitespace-normal px-4 py-4 text-left" disabled={saving} onClick={() => void answer(option.score)}>{option.label}</Button>)}<div className="flex items-center gap-2 pt-3 text-xs text-slate-500"><ShieldCheck className="h-4 w-4" />Your responses are stored only against your account.</div></CardContent></Card></main></div>;
};

export default HealthAssessment;
