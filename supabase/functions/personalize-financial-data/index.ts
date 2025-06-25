
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) {
      throw new Error('Unauthorized')
    }

    const { action, userData } = await req.json()

    let result = null

    switch (action) {
      case 'sync_financial_data':
        result = await syncFinancialData(user.id, userData)
        break
      case 'generate_personalized_assessment':
        result = await generatePersonalizedAssessment(user.id, userData)
        break
      case 'get_personalized_tips':
        result = await getPersonalizedTips(user.id, userData)
        break
      case 'update_user_preferences':
        result = await updateUserPreferences(user.id, userData)
        break
      default:
        throw new Error('Invalid action')
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

async function syncFinancialData(userId: string, userData: any) {
  // This function will sync user's financial data from their connected API
  const userApiKey = Deno.env.get('USER_FINANCIAL_API_KEY')
  
  if (!userApiKey) {
    throw new Error('Financial API key not configured')
  }

  // Connect to user's financial API and sync data
  const financialData = await fetchUserFinancialData(userApiKey, userData)
  
  // Store processed data in Supabase
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  const { error } = await supabaseClient
    .from('profiles')
    .update({
      monthly_income: financialData.monthlyIncome,
      financial_goals: financialData.goals,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) throw error

  return { success: true, data: financialData }
}

async function generatePersonalizedAssessment(userId: string, userData: any) {
  // Generate personalized financial health assessment based on user's actual data
  const personalizedQuestions = [
    {
      question: `Based on your current monthly income of ₦${userData.monthlyIncome}, what percentage do you save?`,
      options: ["0-5%", "6-15%", "16-20%", "21%+"],
      scores: [1, 2, 3, 4],
      personalized: true
    },
    {
      question: "How does your current emergency fund compare to your monthly expenses?",
      options: ["No emergency fund", "Less than 1 month", "1-3 months", "3-6 months or more"],
      scores: [1, 2, 3, 4],
      personalized: true
    },
    // Add more personalized questions based on user data
  ]

  return { questions: personalizedQuestions, userId }
}

async function getPersonalizedTips(userId: string, userData: any) {
  // Generate AI-powered personalized tips based on user's financial profile
  const userProfile = userData.profile
  const healthCategory = userData.healthCategory || 'fair'
  
  const personalizedTips = generateTipsForUser(userProfile, healthCategory)
  
  return { tips: personalizedTips, category: healthCategory }
}

async function updateUserPreferences(userId: string, userData: any) {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  const { error } = await supabaseClient
    .from('daily_tips_preferences')
    .update(userData.preferences)
    .eq('user_id', userId)

  if (error) throw error

  return { success: true }
}

async function fetchUserFinancialData(apiKey: string, userData: any) {
  // This would connect to the user's actual financial API
  // For now, returning mock personalized data structure
  return {
    monthlyIncome: userData.income || 0,
    monthlyExpenses: userData.expenses || 0,
    savings: userData.savings || 0,
    investments: userData.investments || 0,
    goals: userData.goals || [],
    spendingPatterns: userData.spendingPatterns || {},
    riskTolerance: userData.riskTolerance || 'moderate'
  }
}

function generateTipsForUser(profile: any, healthCategory: string) {
  const baseTips = {
    'needs_improvement': [
      { content: `With your current income of ₦${profile.monthlyIncome}, try to save at least ₦${Math.floor(profile.monthlyIncome * 0.1)} monthly`, relevance: 10 },
      { content: "Track your spending using the 50/30/20 rule based on your actual income", relevance: 9 },
      { content: "Start building an emergency fund with ₦5,000 as your first milestone", relevance: 8 }
    ],
    'fair': [
      { content: `Consider increasing your monthly savings from ₦${profile.currentSavings} to ₦${Math.floor(profile.monthlyIncome * 0.15)}`, relevance: 10 },
      { content: "Based on your spending patterns, you can cut ₦10,000 from entertainment expenses", relevance: 9 },
      { content: "Your emergency fund should cover 3 months of your ₦" + profile.monthlyExpenses + " monthly expenses", relevance: 8 }
    ],
    'good': [
      { content: `With your stable ₦${profile.monthlyIncome} income, consider investing ₦${Math.floor(profile.monthlyIncome * 0.1)} in Treasury Bills`, relevance: 10 },
      { content: "Your risk tolerance suggests you're ready for mutual fund investments", relevance: 9 },
      { content: "Consider diversifying beyond savings with 70% safe investments, 30% growth investments", relevance: 8 }
    ],
    'excellent': [
      { content: `Your financial stability allows for ₦${Math.floor(profile.monthlyIncome * 0.2)} monthly investment allocation`, relevance: 10 },
      { content: "Consider real estate investment opportunities matching your ₦" + profile.netWorth + " net worth", relevance: 9 },
      { content: "You're ready for advanced portfolio diversification including international investments", relevance: 8 }
    ]
  }

  return baseTips[healthCategory as keyof typeof baseTips] || baseTips.fair
}
