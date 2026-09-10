import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calculator, Landmark, PiggyBank, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const money = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
const numeric = (value: string) => Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;

const Field = ({ id, label, value, setValue, suffix }: { id: string; label: string; value: string; setValue: (value: string) => void; suffix?: string }) => (
  <div className="space-y-2"><Label htmlFor={id}>{label}</Label><div className="relative"><Input id={id} type="number" min="0" value={value} onChange={(event) => setValue(event.target.value)} /><span className="absolute right-3 top-2.5 text-sm text-slate-400">{suffix}</span></div></div>
);

const Calculators = () => {
  const navigate = useNavigate();
  const [loan, setLoan] = useState("1000000"); const [loanRate, setLoanRate] = useState("20"); const [loanMonths, setLoanMonths] = useState("12");
  const [principal, setPrincipal] = useState("100000"); const [returnRate, setReturnRate] = useState("12"); const [years, setYears] = useState("5");
  const [monthlySaving, setMonthlySaving] = useState("25000"); const [savingRate, setSavingRate] = useState("10"); const [savingYears, setSavingYears] = useState("3");
  const [essentialSpend, setEssentialSpend] = useState("150000"); const [fundMonths, setFundMonths] = useState("6"); const [currentFund, setCurrentFund] = useState("100000");

  const loanResult = useMemo(() => { const p=numeric(loan), n=numeric(loanMonths), r=numeric(loanRate)/1200; const payment=!p||!n?0:r===0?p/n:(p*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1); return {payment,total:payment*n}; }, [loan,loanMonths,loanRate]);
  const compound = useMemo(() => numeric(principal)*Math.pow(1+numeric(returnRate)/100,numeric(years)), [principal,returnRate,years]);
  const savings = useMemo(() => { const months=numeric(savingYears)*12, r=numeric(savingRate)/1200, payment=numeric(monthlySaving); return r===0?payment*months:payment*((Math.pow(1+r,months)-1)/r); }, [monthlySaving,savingRate,savingYears]);
  const emergencyTarget=numeric(essentialSpend)*numeric(fundMonths), emergencyGap=Math.max(0,emergencyTarget-numeric(currentFund));

  return <div className="min-h-screen bg-slate-50"><header className="border-b bg-white"><div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4"><strong>MyFinance</strong><Button variant="outline" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button></div></header><main className="mx-auto max-w-5xl px-4 py-10"><div className="mb-8"><p className="font-medium text-emerald-700">Plan with real numbers</p><h1 className="text-3xl font-bold">Financial calculators</h1><p className="mt-2 text-slate-600">Explore scenarios in naira. Results are estimates, not financial advice.</p></div><Tabs defaultValue="loan"><TabsList className="grid h-auto grid-cols-2 gap-1 md:grid-cols-4"><TabsTrigger value="loan">Loan</TabsTrigger><TabsTrigger value="compound">Compound growth</TabsTrigger><TabsTrigger value="savings">Savings</TabsTrigger><TabsTrigger value="emergency">Emergency fund</TabsTrigger></TabsList>
    <TabsContent value="loan"><CalculatorCard icon={Landmark} title="Loan repayment" description="Estimate monthly repayments on a reducing-balance loan."><div className="grid gap-4 md:grid-cols-3"><Field id="loan" label="Amount (₦)" value={loan} setValue={setLoan}/><Field id="loan-rate" label="Annual interest" value={loanRate} setValue={setLoanRate} suffix="%"/><Field id="loan-months" label="Term" value={loanMonths} setValue={setLoanMonths} suffix="months"/></div><Result items={[["Monthly repayment",loanResult.payment],["Total repayment",loanResult.total],["Estimated interest",loanResult.total-numeric(loan)]]}/></CalculatorCard></TabsContent>
    <TabsContent value="compound"><CalculatorCard icon={Calculator} title="Compound growth" description="Project how a lump sum may grow with annually compounded returns."><div className="grid gap-4 md:grid-cols-3"><Field id="principal" label="Starting amount (₦)" value={principal} setValue={setPrincipal}/><Field id="return" label="Annual return" value={returnRate} setValue={setReturnRate} suffix="%"/><Field id="years" label="Duration" value={years} setValue={setYears} suffix="years"/></div><Result items={[["Projected value",compound],["Estimated growth",compound-numeric(principal)]]}/></CalculatorCard></TabsContent>
    <TabsContent value="savings"><CalculatorCard icon={PiggyBank} title="Savings projection" description="Estimate the future value of regular end-of-month contributions."><div className="grid gap-4 md:grid-cols-3"><Field id="monthly-saving" label="Monthly contribution (₦)" value={monthlySaving} setValue={setMonthlySaving}/><Field id="saving-rate" label="Annual return" value={savingRate} setValue={setSavingRate} suffix="%"/><Field id="saving-years" label="Duration" value={savingYears} setValue={setSavingYears} suffix="years"/></div><Result items={[["Projected savings",savings],["Your contributions",numeric(monthlySaving)*numeric(savingYears)*12]]}/></CalculatorCard></TabsContent>
    <TabsContent value="emergency"><CalculatorCard icon={ShieldCheck} title="Emergency fund" description="Calculate a target based on essential monthly expenses."><div className="grid gap-4 md:grid-cols-3"><Field id="essential" label="Essential monthly spend (₦)" value={essentialSpend} setValue={setEssentialSpend}/><Field id="fund-months" label="Months of cover" value={fundMonths} setValue={setFundMonths}/><Field id="current-fund" label="Already saved (₦)" value={currentFund} setValue={setCurrentFund}/></div><Result items={[["Target fund",emergencyTarget],["Remaining gap",emergencyGap]]}/></CalculatorCard></TabsContent>
  </Tabs></main></div>;
};

const CalculatorCard = ({ icon: Icon, title, description, children }: { icon: typeof Calculator; title: string; description: string; children: React.ReactNode }) => <Card className="mt-6"><CardHeader><CardTitle className="flex items-center gap-2"><Icon className="h-5 w-5 text-emerald-700" />{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader><CardContent className="space-y-6">{children}</CardContent></Card>;
const Result = ({ items }: { items: [string,number][] }) => <div className="grid gap-3 rounded-xl bg-emerald-50 p-5 sm:grid-cols-3">{items.map(([label,value])=><div key={label}><p className="text-sm text-emerald-800">{label}</p><p className="mt-1 text-2xl font-bold text-emerald-950">{money.format(Number.isFinite(value)?value:0)}</p></div>)}</div>;

export default Calculators;
