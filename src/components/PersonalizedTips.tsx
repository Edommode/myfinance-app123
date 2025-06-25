import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, Shield, Target, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface DailyTip {
  id: string;
  tip_content: string;
  health_category: string;
  relevance_score: number;
  tip_source: string;
}

const PersonalizedTips = () => {
  const { user } = useAuth();
  const [dailyTips, setDailyTips] = useState<DailyTip[]>([]);
  const [userHealthCategory, setUserHealthCategory] = useState<string>("");

  useEffect(() => {
    if (user) {
      fetchUserHealthData();
      generatePersonalizedTips();
    }
  }, [user]);

  const fetchUserHealthData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('financial_health_assessments')
        .select('health_category, health_score')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      if (data && data.length > 0) {
        setUserHealthCategory(data[0].health_category);
      }
    } catch (error) {
      console.error("Error fetching user health data:", error);
    }
  };

  const generatePersonalizedTips = async () => {
    if (!user) return;

    const tipsData = getTipsForHealthCategory(userHealthCategory);
    
    try {
      // Save tips to database
      const tipsToInsert = tipsData.map(tip => ({
        user_id: user.id,
        tip_content: tip.content,
        health_category: userHealthCategory || 'general',
        relevance_score: tip.relevance,
        tip_source: 'finance_wise_ai'
      }));

      const { error } = await supabase
        .from('financial_health_tips')
        .upsert(tipsToInsert, { onConflict: 'user_id,tip_content' });

      if (error) throw error;

      // Fetch personalized tips
      const { data: tips, error: fetchError } = await supabase
        .from('financial_health_tips')
        .select('*')
        .eq('user_id', user.id)
        .order('relevance_score', { ascending: false })
        .limit(5);

      if (fetchError) throw fetchError;
      setDailyTips(tips || []);
    } catch (error) {
      console.error("Error generating personalized tips:", error);
    }
  };

  const getTipsForHealthCategory = (category: string) => {
    const tipsByCategory = {
      'needs_improvement': [
        { content: "Start with a simple 50/30/20 budget: 50% needs, 30% wants, 20% savings", relevance: 10 },
        { content: "Build an emergency fund of ₦10,000 first, then gradually increase it", relevance: 9 },
        { content: "Track every expense for 30 days to identify spending patterns", relevance: 8 },
        { content: "Use the envelope method for budgeting your monthly expenses", relevance: 7 },
        { content: "Avoid borrowing money for wants - only for true emergencies", relevance: 6 }
      ],
      'fair': [
        { content: "Automate your savings - set up automatic transfers to savings account", relevance: 10 },
        { content: "Increase your emergency fund to cover 3-6 months of expenses", relevance: 9 },
        { content: "Look for ways to increase income through side hustles or skill development", relevance: 8 },
        { content: "Start learning about basic investments like Treasury Bills", relevance: 7 },
        { content: "Review and optimize your monthly subscriptions and recurring expenses", relevance: 6 }
      ],
      'good': [
        { content: "Consider diversifying into mutual funds for better returns", relevance: 10 },
        { content: "Start investing at least 10% of your income consistently", relevance: 9 },
        { content: "Learn about dollar-cost averaging for your investments", relevance: 8 },
        { content: "Explore real estate investment opportunities in Nigeria", relevance: 7 },
        { content: "Consider tax-efficient investment strategies", relevance: 6 }
      ],
      'excellent': [
        { content: "Explore advanced investment strategies like REITs and bonds", relevance: 10 },
        { content: "Consider setting up multiple income streams for financial independence", relevance: 9 },
        { content: "Look into international investment opportunities", relevance: 8 },
        { content: "Plan for retirement with pension fund contributions and personal investments", relevance: 7 },
        { content: "Consider becoming a financial mentor to help others build wealth", relevance: 6 }
      ]
    };

    return tipsByCategory[category as keyof typeof tipsByCategory] || tipsByCategory.fair;
  };

  const getHealthCategoryInfo = (category: string) => {
    const categoryInfo = {
      'needs_improvement': { 
        title: 'Building Foundation', 
        icon: Target, 
        color: 'red',
        description: 'Focus on basic financial habits'
      },
      'fair': { 
        title: 'Growing Stronger', 
        icon: TrendingUp, 
        color: 'gold',
        description: 'Optimizing savings and planning'
      },
      'good': { 
        title: 'Investment Ready', 
        icon: Shield, 
        color: 'emerald',
        description: 'Ready for wealth building'
      },
      'excellent': { 
        title: 'Wealth Builder', 
        icon: Lightbulb, 
        color: 'emerald',
        description: 'Advanced financial strategies'
      }
    };

    return categoryInfo[category as keyof typeof categoryInfo] || categoryInfo.fair;
  };

  if (!user) {
    return (
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-gold-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-center text-emerald-900">
                  <Bell className="w-6 h-6 mr-2" />
                  Daily Money Tips
                </CardTitle>
                <CardDescription>
                  Sign up to get personalized financial tips based on your health assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Sign Up for Personalized Tips
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  const categoryInfo = getHealthCategoryInfo(userHealthCategory);
  const CategoryIcon = categoryInfo.icon;

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 to-gold-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-emerald-900 mb-4">
            Your Personalized Money Tips
          </h2>
          <div className="flex items-center justify-center mb-4">
            <CategoryIcon className={`w-8 h-8 text-${categoryInfo.color}-600 mr-2`} />
            <Badge className={`bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800 text-lg px-4 py-2`}>
              {categoryInfo.title}
            </Badge>
          </div>
          <p className="text-emerald-700 max-w-2xl mx-auto">
            {categoryInfo.description} - Tips curated based on your financial health assessment
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dailyTips.map((tip, index) => (
              <Card key={tip.id || index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Lightbulb className="w-6 h-6 text-gold-600" />
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
                      Day {index + 1}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-emerald-800 leading-relaxed">
                    {tip.tip_content}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-emerald-600">
                      Relevance: {tip.relevance_score}/10
                    </span>
                    <Badge variant="outline">
                      {tip.tip_source || 'Finance Wise'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {dailyTips.length === 0 && (
            <Card className="text-center">
              <CardContent className="py-12">
                <Lightbulb className="w-16 h-16 text-gold-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-emerald-900 mb-2">
                  Setting up your personalized tips...
                </h3>
                <p className="text-emerald-700 mb-4">
                  Complete your financial health assessment to get started!
                </p>
                <Button 
                  onClick={generatePersonalizedTips}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Generate My Tips
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default PersonalizedTips;
