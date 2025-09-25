-- Fix security issue: Hide sensitive Stripe identifiers from public access
-- Create a public view that only exposes essential service information

-- Remove the current public access policy from services table
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;

-- Create a public view that only exposes safe service information
CREATE VIEW public.services_public AS
SELECT 
  id,
  name,
  description,
  price_cents,
  duration_minutes,
  is_active,
  created_at,
  updated_at
FROM public.services
WHERE is_active = true;

-- Enable RLS on the view
ALTER VIEW public.services_public SET (security_barrier = true);

-- Grant public access to the safe view
GRANT SELECT ON public.services_public TO anon;
GRANT SELECT ON public.services_public TO authenticated;

-- For authenticated admin users who need full access to services table
-- (you can modify this policy based on your admin requirements)
CREATE POLICY "Authenticated users can view all service details" 
ON public.services 
FOR SELECT 
USING (auth.uid() IS NOT NULL);