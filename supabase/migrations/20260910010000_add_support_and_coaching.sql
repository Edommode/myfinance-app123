CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL CHECK (char_length(first_name) BETWEEN 1 AND 80),
  last_name TEXT NOT NULL CHECK (char_length(last_name) BETWEEN 1 AND 80),
  email TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  phone TEXT CHECK (phone IS NULL OR char_length(phone) <= 40),
  subject TEXT NOT NULL CHECK (subject IN ('Budgeting Help','Investment Education','Debt Management','Premium Coaching','Other')),
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 10 AND 3000),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_progress','resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
REVOKE SELECT, UPDATE, DELETE ON public.contact_submissions FROM anon, authenticated;
CREATE POLICY "Anyone can submit a contact request" ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'new' AND (user_id IS NULL OR user_id = (SELECT auth.uid())));

CREATE TABLE IF NOT EXISTS public.coaching_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL CHECK (char_length(topic) BETWEEN 2 AND 100),
  preferred_date DATE,
  notes TEXT CHECK (notes IS NULL OR char_length(notes) <= 2000),
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested','confirmed','completed','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.coaching_requests ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.coaching_requests TO authenticated;
REVOKE ALL ON public.coaching_requests FROM anon;
CREATE POLICY "Users read their own coaching requests" ON public.coaching_requests FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));
CREATE POLICY "Users create their own coaching requests" ON public.coaching_requests FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx ON public.contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS contact_submissions_user_id_idx ON public.contact_submissions(user_id);
CREATE INDEX IF NOT EXISTS coaching_requests_user_id_idx ON public.coaching_requests(user_id);
