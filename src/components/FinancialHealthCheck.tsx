import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Target, TrendingUp, AlertCircle, CheckCircle, Brain } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePersonalization } from "@/hooks/usePersonalization";
import PersonalizationSetup from "./PersonalizationSetup";
import PersonalizedAssessment from "./PersonalizedAssessment";

const FinancialHealthCheck = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);
  const [showPersonalizationSetup, setShowPersonalizationSetup] = useState(false);
  const [usePersonalized, setUsePersonalized] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { personalizationData, personalizedContent, calculatePersonalizedHealthScore } = usePersonalization();

  const questions = [
    {
      question: "What percentage of your income do you currently save each month?",
      options: ["0-5%", "6-15%", "16-20%", "21%+"],
      scores: [1, 2, 3, 4]
    },
    {
      question: "Do you have an emergency fund that covers at least 3-6 months of expenses?",
      options: ["No emergency fund", "Less than 1 month", "1-3 months", "3-6 months or more"],
      scores: [1, 2, 3, 4]
    },
    {
      question: "How often do you track your expenses?",
      options: ["Never", "Occasionally", "Monthly", "Daily/Weekly"],
      scores: [1, 2, 3, 4]
    },
    {
      question: "What's your current debt situation?",
      options: ["High debt, struggling", "Moderate debt", "Low debt", "Debt-free"],
      scores: [1, 2, 3, 4]
    },
    {
      question: "Do you have any investments or are you planning to invest?",
      options: ["No plans to invest", "Planning to start", "Small investments", "Regular investor"],
      scores: [1, 2, 3, 4]
    }
  ];

  const handleAnswer = (scoreIndex: number) => {
    const newAnswers = [...answers, questions[currentQuestion].scores[scoreIndex]];
    setAnswers(newAnswers);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      if (!user) {
        setShowSignUpPrompt(true);
      } else {
        saveHealthAssessment(newAnswers);
      }
    }
  };

  const saveHealthAssessment = async (assessmentAnswers: number[]) => {
    if (!user) return;

    const score = usePersonalized 
      ? calculatePersonalizedHealthScore(assessmentAnswers)
      : Math.round((assessmentAnswers.reduce((sum, score) => sum + score, 0) / (questions.length * 4)) * 100);
    
    const health = getHealthStatus(score);

    try {
      // Convert data to proper JSON format for database
      const assessmentData = {
        answers: assessmentAnswers,
        questions: questions.map(q => q.question),
        personalized: usePersonalized,
        userProfile: personalizationData ? {
          monthlyIncome: personalizationData.monthlyIncome || 0,
          monthlyExpenses: personalizationData.monthlyExpenses || 0,
          savings: personalizationData.savings || 0,
          investments: personalizationData.investments || 0,
          riskTolerance: personalizationData.riskTolerance || 'moderate',
          goals: personalizationData.goals || []
        } : null
      };

      const recommendations = {
        advice: health.advice,
        next_steps: "Get personalized action plan",
        focus_areas: score < 40 ? ["budgeting", "emergency_fund"] : 
                    score < 60 ? ["savings", "expense_tracking"] :
                    score < 80 ? ["investing", "diversification"] :
                    ["advanced_investing", "wealth_building"]
      };

      const { error } = await supabase
        .from('financial_health_assessments')
        .insert({
          user_id: user.id,
          health_score: score,
          health_category: health.status.toLowerCase().replace(' ', '_'),
          assessment_data: assessmentData,
          recommendations
        });

      if (error) throw error;

      toast({
        title: "Assessment saved!",
        description: usePersonalized 
          ? "Your personalized financial health data has been saved to your profile."
          : "Your financial health data has been saved to your profile.",
      });
    } catch (error) {
      console.error("Error saving assessment:", error);
    }
  };

  const calculateScore = () => {
    const totalScore = answers.reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 4;
    return Math.round((totalScore / maxScore) * 100);
  };

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { status: "Excellent", color: "emerald", icon: CheckCircle, advice: "You're on track for financial success! Consider advanced investment strategies." };
    if (score >= 60) return { status: "Good", color: "emerald", icon: TrendingUp, advice: "Great foundation! Focus on increasing savings and diversifying investments." };
    if (score >= 40) return { status: "Fair", color: "gold", icon: Target, advice: "You're building good habits. Consider creating a structured savings plan." };
    return { status: "Needs Improvement", color: "red", icon: AlertCircle, advice: "Time to prioritize your financial health. Start with budgeting and emergency fund." };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setShowSignUpPrompt(false);
    setShowPersonalizationSetup(false);
    setUsePersonalized(false);
  };

  // Show personalization setup if user wants personalized assessment
  if (showPersonalizationSetup) {
    return (
      <section id="health-check" className="py-16 bg-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-emerald-900 mb-4">Setup Your Personalized Assessment</h2>
            <p className="text-emerald-700">
              Connect your financial data to get a truly personalized financial health assessment
            </p>
          </div>
          <PersonalizationSetup />
          <div className="text-center mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowPersonalizationSetup(false)}
            >
              Use Standard Assessment Instead
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Show personalized assessment if user has personalization data
  if (usePersonalized && Object.keys(personalizationData).length > 0) {
    return (
      <section id="health-check" className="py-16 bg-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-emerald-900 mb-4">Your Personalized Financial Health Assessment</h2>
            <p className="text-emerald-700">
              Tailored specifically to your financial profile and goals
            </p>
          </div>
          <PersonalizedAssessment />
        </div>
      </section>
    );
  }

  if (showSignUpPrompt) {
    const score = calculateScore();
    const health = getHealthStatus(score);

    return (
      <section id="health-check" className="py-16 bg-emerald-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-2xl text-emerald-900">
                  🎉 Your Financial Health Score: {score}/100
                </CardTitle>
                <CardDescription className="text-lg">
                  Status: <Badge className={`bg-${health.color}-100 text-${health.color}-800`}>{health.status}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-emerald-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-emerald-800 mb-3">
                    🔓 Unlock Your Personalized Financial Action Plan
                  </h3>
                  <p className="text-emerald-700 mb-4">
                    Sign up now to get detailed analysis, personalized investment recommendations, 
                    daily money tips, and access to our exclusive financial education content.
                  </p>
                  <ul className="text-emerald-600 text-sm space-y-2">
                    <li>✅ Detailed financial health breakdown</li>
                    <li>✅ Personalized investment strategies based on your score</li>
                    <li>✅ Daily money tips tailored to your financial level</li>
                    <li>✅ Access to premium courses and coaching</li>
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => navigate("/auth")}
                    className="bg-emerald-600 hover:bg-emerald-700 flex-1"
                  >
                    Sign Up for Detailed Analysis
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetQuiz}
                    className="flex-1"
                  >
                    Retake Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const health = getHealthStatus(score);
    const StatusIcon = health.icon;

    return (
      <section id="health-check" className="py-16 bg-emerald-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-emerald-900 mb-4">Your Financial Health Report</h2>
              <p className="text-emerald-700">Based on your responses, here's your personalized assessment</p>
            </div>

            <Card className="mb-8 animate-scale-in">
              <CardHeader className="text-center">
                <div className={`mx-auto w-20 h-20 rounded-full bg-${health.color}-100 flex items-center justify-center mb-4`}>
                  <StatusIcon className={`w-10 h-10 text-${health.color}-600`} />
                </div>
                <CardTitle className="text-2xl">Financial Health Score</CardTitle>
                <div className="text-4xl font-bold text-emerald-800 mb-2">{score}/100</div>
                <Badge variant="outline" className={`bg-${health.color}-100 text-${health.color}-800 border-${health.color}-200`}>
                  {health.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <Progress value={score} className="mb-6" />
                <div className="bg-emerald-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-emerald-800 mb-2">Personalized Advice:</h4>
                  <p className="text-emerald-700">{health.advice}</p>
                </div>

                {user && (
                  <div className="bg-gold-50 p-4 rounded-lg mb-6 border border-gold-200">
                    <h4 className="font-semibold text-gold-800 mb-2 flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      Upgrade to Personalized Assessment
                    </h4>
                    <p className="text-gold-700 mb-3">
                      Get an AI-powered assessment tailored to your actual financial data for more accurate insights and recommendations.
                    </p>
                    <Button 
                      onClick={() => setShowPersonalizationSetup(true)}
                      className="bg-gold-600 hover:bg-gold-700"
                    >
                      Setup Personalized Assessment
                    </Button>
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <Card className="border-emerald-200">
                    <CardContent className="p-4 text-center">
                      <Target className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                      <h5 className="font-semibold text-emerald-800">Next Steps</h5>
                      <p className="text-sm text-emerald-600">Get personalized action plan</p>
                    </CardContent>
                  </Card>
                  <Card className="border-emerald-200">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                      <h5 className="font-semibold text-emerald-800">Track Progress</h5>
                      <p className="text-sm text-emerald-600">Monitor improvements monthly</p>
                    </CardContent>
                  </Card>
                  <Card className="border-emerald-200">
                    <CardContent className="p-4 text-center">
                      <Activity className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                      <h5 className="font-semibold text-emerald-800">Get Coaching</h5>
                      <p className="text-sm text-emerald-600">Book a session with experts</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button disabled className="bg-emerald-600">
                    Mobile app coming soon
                  </Button>
                  <Button variant="outline" onClick={resetQuiz}>
                    Retake Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="health-check" className="py-16 bg-emerald-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-emerald-900 mb-4">Financial Health Check</h2>
            <p className="text-emerald-700">
              Take our quick 2-minute assessment to discover your financial health score and get personalized recommendations
            </p>
            
            {user && (
              <div className="mt-6">
                <Card className="bg-gradient-to-r from-emerald-50 to-gold-50 border-emerald-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex items-center">
                        <Brain className="w-5 h-5 text-emerald-600 mr-2" />
                        <span className="text-emerald-800 font-medium">Want a personalized assessment?</span>
                      </div>
                      <Button 
                        onClick={() => setShowPersonalizationSetup(true)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                        size="sm"
                      >
                        Setup Personalization
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <Card className="animate-scale-in">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
                <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
                  {Math.round(((currentQuestion) / questions.length) * 100)}% Complete
                </Badge>
              </div>
              <Progress value={(currentQuestion / questions.length) * 100} className="mb-4" />
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold text-emerald-900 mb-6">
                {questions[currentQuestion].question}
              </h3>
              
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
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
        </div>
      </div>
    </section>
  );
};

export default FinancialHealthCheck;
