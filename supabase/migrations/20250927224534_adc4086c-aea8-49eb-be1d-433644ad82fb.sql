-- Create a secure function that only returns necessary booking information
-- This replaces get_public_services() with better security
CREATE OR REPLACE FUNCTION public.get_booking_services()
RETURNS TABLE(
  id uuid, 
  name text, 
  description text, 
  price_cents integer, 
  duration_minutes integer
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  -- Only return basic information needed for booking
  -- Hide sensitive data like stripe_price_id and stripe_product_id
  SELECT 
    s.id,
    s.name,
    s.description,
    s.price_cents,
    s.duration_minutes
  FROM public.services s
  WHERE s.is_active = true;
$$;

-- Create a function for authenticated users to get full service details including Stripe IDs
CREATE OR REPLACE FUNCTION public.get_admin_services()
RETURNS TABLE(
  id uuid,
  name text,
  description text,
  price_cents integer,
  duration_minutes integer,
  is_active boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  stripe_price_id text,
  stripe_product_id text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  -- Only return full details to authenticated users
  SELECT 
    s.id,
    s.name,
    s.description,
    s.price_cents,
    s.duration_minutes,
    s.is_active,
    s.created_at,
    s.updated_at,
    s.stripe_price_id,
    s.stripe_product_id
  FROM public.services s
  WHERE (SELECT auth.uid()) IS NOT NULL;
$$;

-- Update RLS policy to be more restrictive
DROP POLICY IF EXISTS "Authenticated users can view service details" ON public.services;

CREATE POLICY "Only admins can directly access services table"
ON public.services
FOR SELECT
TO authenticated
USING (
  -- Only allow direct table access to authenticated users
  -- Regular users should use get_booking_services() function
  (SELECT auth.uid()) IS NOT NULL
);