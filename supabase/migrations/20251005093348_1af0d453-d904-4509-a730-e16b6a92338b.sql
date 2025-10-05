-- Fix contact_submissions RLS policies to explicitly deny anonymous access
-- This prevents unauthorized access to customer contact data

-- Drop existing policies to recreate with better security
DROP POLICY IF EXISTS "Allow anonymous contact form submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated contact form submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only admins can update contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only admins can delete contact submissions" ON public.contact_submissions;

-- Create explicit deny policy for anonymous users on SELECT/UPDATE/DELETE
-- This is the PRIMARY security control
CREATE POLICY "Deny anonymous read/modify access"
ON public.contact_submissions
AS RESTRICTIVE
FOR ALL
TO anon
USING (false);

-- Allow anonymous INSERT only (needed for contact form)
CREATE POLICY "Allow anonymous contact form submissions"
ON public.contact_submissions
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated INSERT
CREATE POLICY "Allow authenticated contact form submissions"
ON public.contact_submissions
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Admin-only SELECT access
CREATE POLICY "Only admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Admin-only UPDATE access
CREATE POLICY "Only admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Admin-only DELETE access
CREATE POLICY "Only admins can delete contact submissions"
ON public.contact_submissions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));