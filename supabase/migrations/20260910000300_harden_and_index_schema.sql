-- The signup trigger must not be callable directly from the Data API.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Cover foreign-key and common ownership lookups used by the application.
CREATE INDEX IF NOT EXISTS budget_categories_budget_id_idx ON public.budget_categories (budget_id);
CREATE INDEX IF NOT EXISTS community_comments_post_id_idx ON public.community_comments (post_id);
CREATE INDEX IF NOT EXISTS community_comments_user_id_idx ON public.community_comments (user_id);
CREATE INDEX IF NOT EXISTS community_posts_user_id_idx ON public.community_posts (user_id);
CREATE INDEX IF NOT EXISTS daily_tips_preferences_user_id_idx ON public.daily_tips_preferences (user_id);
CREATE INDEX IF NOT EXISTS expenses_budget_category_id_idx ON public.expenses (budget_category_id);
CREATE INDEX IF NOT EXISTS financial_goals_user_id_idx ON public.financial_goals (user_id);
CREATE INDEX IF NOT EXISTS financial_health_assessments_user_id_idx ON public.financial_health_assessments (user_id);
CREATE INDEX IF NOT EXISTS financial_health_tips_user_id_idx ON public.financial_health_tips (user_id);
CREATE INDEX IF NOT EXISTS savings_transactions_goal_id_idx ON public.savings_transactions (savings_goal_id);
