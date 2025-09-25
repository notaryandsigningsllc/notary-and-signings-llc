-- Fix the security definer view issue by removing security_barrier
-- and using a standard view instead

-- Drop the previous view
DROP VIEW IF EXISTS public.services_public;

-- Create a standard view without security_barrier (which was causing the security definer warning)
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

-- Grant public access to the view
GRANT SELECT ON public.services_public TO anon;
GRANT SELECT ON public.services_public TO authenticated;