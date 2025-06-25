
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { usePersonalization } from '@/hooks/usePersonalization';
import { Brain, Target, TrendingUp } from 'lucide-react';

const PersonalizedAssessment = () => {
  const { personalizedContent, personalizationData, calculatePersonalizedHealthScore } = usePersonalization();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const questions = personalizedContent.assessment || [
    {
      question: "Based on your financial profile, how would you rate your current savings habit?",
      options: ["Below average", "Average", "Good", "Excellent"],
      scores: [1, 2, 3, 4],
      personalized: true
    }
  ];

  const handleAnswer = (scoreIndex: number) => {
    const newAnswers = [...answers, questions[currentQuestion].scores[scoreIndex]];
    setAnswers(newAnswers);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const getPersonalizedInsight = () => {
    const score = calculatePersonalizedHealthScore(answers);
    const income = personalizationData.monthlyIncome || 0;
    const savings = personalizationData.savings || 0;
    
    let insight = "";
    
    if (score >= 80) {
      insight = `Excellent! With your ₦${income.toLocaleString()} monthly income and ₦${savings.toLocaleString()} in savings, you're on a strong financial path. Consider advanced investment strategies.`;
    } else if (score >= 60) {
      insight = `Good progress! Your current savings of ₦${savings.toLocaleString()} shows discipline. Focus on increasing your savings rate from your ₦${income.toLocaleString()} monthly income.`;
    } else if (score >= 40) {
      insight = `You're building good habits. With ₦${income.toLocaleString()} monthly income, aim to save at least ₦${Math.floor(income * 0.15).toLocaleString()} each month.`;
    } else {
      insight = `Let's improve your financial foundation. Start by tracking your expenses and try to save ₦${Math.floor(income * 0.1).toLocaleString()} monthly from your ₦${income.toLocaleString()} income.`;
    }
    
    return insight;
  };

  if (showResults) {
    const score = calculatePersonalizedHealthScore(answers);
    
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <Brain className="w-10 h-10 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl">Your Personalized Financial Health Score</CardTitle>
          <div className="text-4xl font-bold text-emerald-800 mb-2">{score}/100</div>
          <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
            AI-Powered Analysis
          </Badge>
        </CardHeader>
        
        <CardContent>
          <Progress value={score} className="mb-6" />
          
          <div className="bg-emerald-50 p-6 rounded-lg mb-6">
            <h4 className="font-semibold text-emerald-800 mb-3 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Personalized Insight:
            </h4>
            <p className="text-emerald-700 leading-relaxed">
              {getPersonalizedInsight()}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-emerald-200">
              <CardContent className="p-4">
                <h5 className="font-semibold text-emerald-800 mb-2">Your Financial Profile</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monthly Income:</span>
                    <span className="font-medium">₦{personalizationData.monthlyIncome?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Savings:</span>
                    <span className="font-medium">₦{personalizationData.savings?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk Tolerance:</span>
                    <span className="font-medium capitalize">{personalizationData.riskTolerance}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200">
              <CardContent className="p-4">
                <h5 className="font-semibold text-emerald-800 mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Next Steps
                </h5>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>• Get personalized daily tips</li>
                  <li>• Explore tailored investment options</li>
                  <li>• Track your progress monthly</li>
                  <li>• Connect with financial advisors</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center">
            <Brain className="w-6 h-6 text-emerald-600 mr-2" />
            Personalized Assessment
          </CardTitle>
          <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
            Question {currentQuestion + 1} of {questions.length}
          </Badge>
        </div>
        <Progress value={(currentQuestion / questions.length) * 100} className="mb-4" />
        <CardDescription>
          This assessment is tailored specifically to your financial profile and goals.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <h3 className="text-xl font-semibold text-emerald-900 mb-6">
          {questions[currentQuestion]?.question}
        </h3>
        
        <div className="space-y-3">
          {questions[currentQuestion]?.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full p-6 text-left justify-start hover:bg-emerald-50 hover:border-emerald-300"
              onClick={() => handleAnswer(index)}
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedAssessment;
