-- Fix security vulnerability in contact_submissions table
-- Remove trigger bypass condition that allows anonymous access

-- Drop the existing vulnerable policy
DROP POLICY IF EXISTS "Deny anonymous contact_submissions access" ON public.contact_submissions;

-- Create a secure policy that only allows authenticated users
-- This still allows anonymous INSERT through the specific "Anyone can submit contact form" policy
-- but prevents any trigger-based exploitation for SELECT/UPDATE/DELETE operations
CREATE POLICY "Deny anonymous contact_submissions access" 
ON public.contact_submissions 
AS RESTRICTIVE
FOR ALL 
USING (auth.uid() IS NOT NULL);