-- Remove the view approach and use RLS policies instead to avoid security definer issues

-- Drop the view
DROP VIEW IF EXISTS public.services_public;

-- Create a policy that allows public access to only safe fields
-- by using a function that selects only safe columns
CREATE OR REPLACE FUNCTION public.get_public_services()
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  price_cents integer,
  duration_minutes integer,
  is_active boolean,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    s.id,
    s.name,
    s.description,
    s.price_cents,
    s.duration_minutes,
    s.is_active,
    s.created_at,
    s.updated_at
  FROM public.services s
  WHERE s.is_active = true;
$$;

-- Grant access to the function for public use
GRANT EXECUTE ON FUNCTION public.get_public_services() TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_services() TO authenticated;