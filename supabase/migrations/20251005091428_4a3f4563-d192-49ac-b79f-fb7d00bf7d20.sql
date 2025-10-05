-- Fix contact_submissions RLS policies for security
-- Remove the confusing "Deny anonymous contact_submissions access" policy
-- and replace with explicit, secure policies

-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Deny anonymous contact_submissions access" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only admins can update contact submissions" ON public.contact_submissions;

-- Create clear, secure policies
-- 1. Allow anonymous INSERT only (for contact form submissions)
CREATE POLICY "Allow anonymous contact form submissions"
ON public.contact_submissions
FOR INSERT
TO anon
WITH CHECK (true);

-- 2. Allow authenticated users to INSERT (if logged in)
CREATE POLICY "Allow authenticated contact form submissions"
ON public.contact_submissions
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. Only admins can SELECT contact submissions
CREATE POLICY "Only admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. Only admins can UPDATE contact submissions
CREATE POLICY "Only admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 5. Only admins can DELETE contact submissions
CREATE POLICY "Only admins can delete contact submissions"
ON public.contact_submissions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));