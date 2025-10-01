-- Create terms_agreements table to track user consent
CREATE TABLE IF NOT EXISTS public.terms_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  terms_version TEXT NOT NULL,
  agreed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  UNIQUE(user_id, terms_version)
);

-- Enable RLS
ALTER TABLE public.terms_agreements ENABLE ROW LEVEL SECURITY;

-- Users can view their own agreements
CREATE POLICY "Users can view their own terms agreements"
  ON public.terms_agreements
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own agreements
CREATE POLICY "Users can insert their own terms agreements"
  ON public.terms_agreements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan_type TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own subscription
CREATE POLICY "Users can update their own subscription"
  ON public.subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update tournament_participants to include terms agreement
ALTER TABLE public.tournament_participants
  ADD COLUMN IF NOT EXISTS terms_agreed BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS terms_version TEXT,
  ADD COLUMN IF NOT EXISTS terms_agreed_at TIMESTAMP WITH TIME ZONE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_terms_agreements_user_id ON public.terms_agreements(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_team_id ON public.tournament_participants(team_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_user_id ON public.tournament_participants(user_id);