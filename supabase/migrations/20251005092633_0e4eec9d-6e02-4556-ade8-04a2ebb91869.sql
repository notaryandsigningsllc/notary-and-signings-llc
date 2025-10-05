-- Fix follow_up_emails RLS policies for security
-- Remove the confusing policy and replace with explicit, secure policies

-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Deny anonymous follow_up_emails access" ON public.follow_up_emails;
DROP POLICY IF EXISTS "Only admins can view follow up emails" ON public.follow_up_emails;

-- Create clear, secure policies
-- Only admins can SELECT follow-up email logs
CREATE POLICY "Only admins can view follow up emails"
ON public.follow_up_emails
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can UPDATE follow-up email logs
CREATE POLICY "Only admins can update follow up emails"
ON public.follow_up_emails
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can DELETE follow-up email logs
CREATE POLICY "Only admins can delete follow up emails"
ON public.follow_up_emails
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Note: No INSERT policy needed - edge functions use service role which bypasses RLS