-- Phase 1 Security Fix: Remove dangerous RLS policy bypass for newsletter_subscriptions
-- Remove the policy that uses pg_trigger_depth() which creates a security bypass

DROP POLICY IF EXISTS "Deny anonymous newsletter_subscriptions access" ON public.newsletter_subscriptions;

-- Create proper secure policy - allow anonymous INSERT only (for newsletter signups)
CREATE POLICY "Allow anonymous newsletter subscription"
ON public.newsletter_subscriptions
FOR INSERT
TO anon
WITH CHECK (true);

-- Ensure authenticated users can also subscribe
CREATE POLICY "Allow authenticated newsletter subscription"
ON public.newsletter_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (true);