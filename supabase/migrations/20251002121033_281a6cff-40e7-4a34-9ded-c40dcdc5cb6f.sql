-- Create contact_submissions table for dual submission
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT
);

-- Create index for faster queries
CREATE INDEX idx_contact_submissions_email ON public.contact_submissions(email);
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public contact form)
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- Only admins can view submissions
CREATE POLICY "Only admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
USING (has_role((SELECT auth.uid()), 'admin'::app_role));

-- Only admins can update submissions
CREATE POLICY "Only admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

-- Deny anonymous access to updates/deletes for security
CREATE POLICY "Deny anonymous contact_submissions access"
ON public.contact_submissions
AS RESTRICTIVE
FOR ALL
USING (auth.uid() IS NOT NULL OR pg_trigger_depth() > 0);

-- Create newsletter_subscriptions table
CREATE TABLE public.newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  double_opt_in_confirmed BOOLEAN NOT NULL DEFAULT false,
  confirmation_token UUID DEFAULT gen_random_uuid(),
  source TEXT DEFAULT 'website'
);

-- Create index for faster queries
CREATE INDEX idx_newsletter_email ON public.newsletter_subscriptions(email);
CREATE INDEX idx_newsletter_active ON public.newsletter_subscriptions(is_active);

-- Enable RLS
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public signup form)
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscriptions
FOR INSERT
WITH CHECK (true);

-- Only admins can view subscriptions
CREATE POLICY "Only admins can view newsletter subscriptions"
ON public.newsletter_subscriptions
FOR SELECT
USING (has_role((SELECT auth.uid()), 'admin'::app_role));

-- Only admins can update subscriptions
CREATE POLICY "Only admins can update newsletter subscriptions"
ON public.newsletter_subscriptions
FOR UPDATE
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

-- Deny anonymous access for security
CREATE POLICY "Deny anonymous newsletter_subscriptions access"
ON public.newsletter_subscriptions
AS RESTRICTIVE
FOR ALL
USING (auth.uid() IS NOT NULL OR pg_trigger_depth() > 0);

-- Create follow_up_emails table for tracking automated sequences
CREATE TABLE public.follow_up_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'sent',
  recipient_email TEXT NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_follow_up_booking_id ON public.follow_up_emails(booking_id);
CREATE INDEX idx_follow_up_sent_at ON public.follow_up_emails(sent_at DESC);

-- Enable RLS
ALTER TABLE public.follow_up_emails ENABLE ROW LEVEL SECURITY;

-- Only admins can view follow-up emails
CREATE POLICY "Only admins can view follow up emails"
ON public.follow_up_emails
FOR ALL
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

-- Deny anonymous access
CREATE POLICY "Deny anonymous follow_up_emails access"
ON public.follow_up_emails
AS RESTRICTIVE
FOR ALL
USING (auth.uid() IS NOT NULL OR pg_trigger_depth() > 0);