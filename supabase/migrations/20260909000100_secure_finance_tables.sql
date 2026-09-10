-- Every personal finance record must be isolated to its owner.
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own budgets" ON public.budgets
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage categories for their budgets" ON public.budget_categories
FOR ALL
USING (EXISTS (SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND b.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND b.user_id = auth.uid()));

CREATE POLICY "Users manage their own expenses" ON public.expenses
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage their own savings goals" ON public.savings_goals
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage transactions for their savings goals" ON public.savings_transactions
FOR ALL
USING (EXISTS (SELECT 1 FROM public.savings_goals g WHERE g.id = savings_goal_id AND g.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.savings_goals g WHERE g.id = savings_goal_id AND g.user_id = auth.uid()));

CREATE POLICY "Users manage their own financial goals" ON public.financial_goals
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can read community posts" ON public.community_posts
FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create their own community posts" ON public.community_posts
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update their own community posts" ON public.community_posts
FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete their own community posts" ON public.community_posts
FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can read community comments" ON public.community_comments
FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create their own community comments" ON public.community_comments
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update their own community comments" ON public.community_comments
FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete their own community comments" ON public.community_comments
FOR DELETE TO authenticated USING (auth.uid() = user_id);
