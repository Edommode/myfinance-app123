
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { usePersonalization } from '@/hooks/usePersonalization';
import { useToast } from '@/hooks/use-toast';
import { Settings, DollarSign, Target, TrendingUp } from 'lucide-react';

const PersonalizationSetup = () => {
  const { syncFinancialData, loading } = usePersonalization();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    monthlyExpenses: '',
    savings: '',
    investments: '',
    riskTolerance: 'moderate',
    goals: [] as string[],
    connectAPI: false
  });

  const goalOptions = [
    'Emergency Fund',
    'House Purchase',
    'Car Purchase',
    'Investment Portfolio',
    'Retirement Planning',
    'Education Fund',
    'Business Investment',
    'Debt Reduction'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const personalizationData = {
      monthlyIncome: parseFloat(formData.monthlyIncome) || 0,
      monthlyExpenses: parseFloat(formData.monthlyExpenses) || 0,
      savings: parseFloat(formData.savings) || 0,
      investments: parseFloat(formData.investments) || 0,
      riskTolerance: formData.riskTolerance as 'conservative' | 'moderate' | 'aggressive',
      goals: formData.goals
    };

    await syncFinancialData(personalizationData);
    
    toast({
      title: "Personalization Complete!",
      description: "Your financial profile has been set up. All features are now tailored to your data.",
    });
  };

  const handleGoalChange = (goal: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, goal]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        goals: prev.goals.filter(g => g !== goal)
      }));
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Settings className="w-6 h-6 text-emerald-600 mr-2" />
          <CardTitle className="text-2xl text-emerald-900">
            Personalize Your Finance Experience
          </CardTitle>
        </div>
        <CardDescription>
          Connect your financial data to get personalized assessments, tips, and investment recommendations tailored specifically to your situation.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center mb-3">
                <DollarSign className="w-5 h-5 text-emerald-600 mr-2" />
                <h3 className="text-lg font-semibold text-emerald-800">Financial Overview</h3>
              </div>
              
              <div>
                <Label htmlFor="monthlyIncome">Monthly Income (₦)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                  placeholder="Enter your monthly income"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="monthlyExpenses">Monthly Expenses (₦)</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  value={formData.monthlyExpenses}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyExpenses: e.target.value }))}
                  placeholder="Enter your monthly expenses"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="savings">Current Savings (₦)</Label>
                <Input
                  id="savings"
                  type="number"
                  value={formData.savings}
                  onChange={(e) => setFormData(prev => ({ ...prev, savings: e.target.value }))}
                  placeholder="Enter your total savings"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="investments">Current Investments (₦)</Label>
                <Input
                  id="investments"
                  type="number"
                  value={formData.investments}
                  onChange={(e) => setFormData(prev => ({ ...prev, investments: e.target.value }))}
                  placeholder="Enter your total investments"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center mb-3">
                <Target className="w-5 h-5 text-emerald-600 mr-2" />
                <h3 className="text-lg font-semibold text-emerald-800">Preferences & Goals</h3>
              </div>

              <div>
                <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                <Select value={formData.riskTolerance} onValueChange={(value) => setFormData(prev => ({ ...prev, riskTolerance: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your risk tolerance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative - I prefer safe, low-risk investments</SelectItem>
                    <SelectItem value="moderate">Moderate - I'm okay with some risk for better returns</SelectItem>
                    <SelectItem value="aggressive">Aggressive - I'm comfortable with high risk for high returns</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">Financial Goals</Label>
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                  {goalOptions.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.goals.includes(goal)}
                        onCheckedChange={(checked) => handleGoalChange(goal, checked as boolean)}
                      />
                      <Label htmlFor={goal} className="text-sm">{goal}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 mr-2" />
              <h4 className="font-semibold text-emerald-800">Personalization Benefits</h4>
            </div>
            <ul className="text-emerald-700 text-sm space-y-1">
              <li>• Dynamic financial health assessments based on your actual data</li>
              <li>• Investment recommendations matching your risk tolerance and income</li>
              <li>• Daily tips personalized to your spending patterns and goals</li>
              <li>• Progress tracking tailored to your specific financial objectives</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={loading}
          >
            {loading ? 'Setting Up Personalization...' : 'Complete Personalization Setup'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalizationSetup;
