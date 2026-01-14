-- Fix contact_submissions: Add admin-only SELECT policy
CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (public.has_role((SELECT auth.uid()), 'admin'::app_role));

-- Fix blocked_dates: The get_public_blocked_dates() function provides safe access
-- Add a public SELECT policy since customers need to see blocked dates for booking
CREATE POLICY "Anyone can view blocked dates"
ON public.blocked_dates
FOR SELECT
USING (true);

-- Update get_admin_services to require admin role (fixing get_admin_services_weak)
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
  SELECT s.id, s.name, s.description, s.price_cents,
         s.duration_minutes, s.is_active, s.created_at,
         s.updated_at, s.stripe_price_id, s.stripe_product_id
  FROM public.services s
  WHERE public.has_role((SELECT auth.uid()), 'admin'::app_role);
$$;