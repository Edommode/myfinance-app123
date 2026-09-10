CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','premium','coaching_plus')),
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('inactive','trialing','active','past_due','cancelled','expired')),
  provider TEXT,
  provider_reference TEXT UNIQUE,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.user_subscriptions TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.user_subscriptions FROM anon, authenticated;
CREATE POLICY "Users read their own subscription" ON public.user_subscriptions FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE TABLE IF NOT EXISTS public.course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL CHECK (char_length(course_slug) BETWEEN 2 AND 100),
  lesson_slug TEXT NOT NULL CHECK (char_length(lesson_slug) BETWEEN 2 AND 120),
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_slug, lesson_slug)
);
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_progress TO authenticated;
REVOKE ALL ON public.course_progress FROM anon;
CREATE POLICY "Users manage their own course progress" ON public.course_progress FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE INDEX IF NOT EXISTS course_progress_user_id_idx ON public.course_progress(user_id);
CREATE INDEX IF NOT EXISTS user_subscriptions_status_idx ON public.user_subscriptions(status, current_period_end);
