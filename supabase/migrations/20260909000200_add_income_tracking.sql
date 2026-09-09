CREATE TABLE public.incomes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own income" ON public.incomes
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX incomes_user_date_idx ON public.incomes (user_id, date DESC);
CREATE INDEX expenses_user_date_idx ON public.expenses (user_id, date DESC);
CREATE INDEX budgets_user_dates_idx ON public.budgets (user_id, start_date, end_date);
CREATE INDEX savings_goals_user_status_idx ON public.savings_goals (user_id, is_completed);
