-- Fix security issue: Restrict business hours access to authenticated users only
-- Prevent competitors from accessing complete operating schedule

-- Drop the current public access policy
DROP POLICY IF EXISTS "Business hours are viewable by everyone" ON public.business_hours;

-- Create a new policy that requires authentication
CREATE POLICY "Business hours are viewable by authenticated users only" 
ON public.business_hours 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND is_available = true);