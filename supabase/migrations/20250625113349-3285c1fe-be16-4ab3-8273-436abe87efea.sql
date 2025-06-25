
-- Enable RLS on existing tables that will store user data
ALTER TABLE public.financial_health_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_health_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for financial_health_assessments
CREATE POLICY "Users can view their own health assessments" 
  ON public.financial_health_assessments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health assessments" 
  ON public.financial_health_assessments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health assessments" 
  ON public.financial_health_assessments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for financial_health_tips
CREATE POLICY "Users can view their own tips" 
  ON public.financial_health_tips 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tips" 
  ON public.financial_health_tips 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create a table for daily tips preferences
CREATE TABLE public.daily_tips_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  tip_categories TEXT[] DEFAULT ARRAY[]::TEXT[],
  notification_time TIME DEFAULT '09:00:00',
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for daily tips preferences
ALTER TABLE public.daily_tips_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tip preferences" 
  ON public.daily_tips_preferences 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Update the handle_new_user function to include tip preferences
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  );
  
  -- Create default daily tips preferences
  INSERT INTO public.daily_tips_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Create trigger for new users if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
