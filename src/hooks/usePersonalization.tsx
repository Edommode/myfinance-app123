
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface PersonalizationData {
  monthlyIncome?: number;
  monthlyExpenses?: number;
  savings?: number;
  investments?: number;
  goals?: string[];
  spendingPatterns?: Record<string, number>;
  riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
}

interface PersonalizedContent {
  assessment?: any;
  tips?: any[];
  investments?: any[];
  healthCategory?: string;
}

export const usePersonalization = () => {
  const { user } = useAuth();
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData>({});
  const [personalizedContent, setPersonalizedContent] = useState<PersonalizedContent>({});
  const [loading, setLoading] = useState(false);

  const syncFinancialData = async (userData: PersonalizationData) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('personalize-financial-data', {
        body: {
          action: 'sync_financial_data',
          userData
        }
      });

      if (error) throw error;

      setPersonalizationData(userData);
      await generatePersonalizedContent(userData);
    } catch (error) {
      console.error('Error syncing financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePersonalizedContent = async (userData?: PersonalizationData) => {
    if (!user) return;

    const dataToUse = userData || personalizationData;
    
    try {
      // Generate personalized assessment
      const { data: assessmentData } = await supabase.functions.invoke('personalize-financial-data', {
        body: {
          action: 'generate_personalized_assessment',
          userData: dataToUse
        }
      });

      // Get personalized tips
      const { data: tipsData } = await supabase.functions.invoke('personalize-financial-data', {
        body: {
          action: 'get_personalized_tips',
          userData: {
            profile: dataToUse,
            healthCategory: personalizedContent.healthCategory || 'fair'
          }
        }
      });

      setPersonalizedContent({
        assessment: assessmentData?.questions,
        tips: tipsData?.tips,
        healthCategory: tipsData?.category
      });
    } catch (error) {
      console.error('Error generating personalized content:', error);
    }
  };

  const updatePreferences = async (preferences: any) => {
    if (!user) return;

    try {
      await supabase.functions.invoke('personalize-financial-data', {
        body: {
          action: 'update_user_preferences',
          userData: { preferences }
        }
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const calculatePersonalizedHealthScore = (answers: number[]) => {
    // Enhanced scoring algorithm that considers user's actual financial data
    const baseScore = answers.reduce((sum, score) => sum + score, 0);
    const maxScore = answers.length * 4;
    let adjustedScore = (baseScore / maxScore) * 100;

    // Adjust score based on actual financial data
    if (personalizationData.monthlyIncome && personalizationData.savings) {
      const savingsRate = (personalizationData.savings / personalizationData.monthlyIncome) * 100;
      if (savingsRate > 20) adjustedScore += 5;
      if (savingsRate > 30) adjustedScore += 10;
    }

    return Math.min(Math.round(adjustedScore), 100);
  };

  useEffect(() => {
    if (user && Object.keys(personalizationData).length > 0) {
      generatePersonalizedContent();
    }
  }, [user, personalizationData]);

  return {
    personalizationData,
    personalizedContent,
    loading,
    syncFinancialData,
    generatePersonalizedContent,
    updatePreferences,
    calculatePersonalizedHealthScore
  };
};
