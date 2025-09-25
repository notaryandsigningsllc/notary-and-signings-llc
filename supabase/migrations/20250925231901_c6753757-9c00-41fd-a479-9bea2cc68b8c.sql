-- Fix RLS policies for bookings_pii table and secure bookings_safe view

-- Enable RLS on bookings_pii table (ensure it's properly enabled)
ALTER TABLE public.bookings_pii ENABLE ROW LEVEL SECURITY;

-- Add proper RLS policies to bookings_pii table
-- Users can only access their own PII through the booking relationship
CREATE POLICY "Users can access their own booking PII" 
ON public.bookings_pii 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.bookings b 
    WHERE b.id = booking_id 
    AND b.user_id = auth.uid()
  )
);

-- Recreate bookings_safe view with proper security
-- Drop the existing view
DROP VIEW IF EXISTS public.bookings_safe;

-- Create a security definer view that properly restricts access
CREATE VIEW public.bookings_safe 
WITH (security_barrier=true) AS
SELECT 
  b.id, 
  b.user_id, 
  b.service_id, 
  b.appointment_date,
  b.appointment_time,
  b.appointment_end_time,
  b.status,
  b.payment_status,
  b.payment_method,
  b.created_at,
  b.updated_at
FROM public.bookings b
WHERE (auth.uid() = b.user_id OR auth.uid() IS NULL);

-- Grant proper permissions
REVOKE ALL ON TABLE public.bookings_safe FROM PUBLIC;
GRANT SELECT ON public.bookings_safe TO authenticated;

-- Ensure no public access to bookings_pii
REVOKE ALL ON TABLE public.bookings_pii FROM PUBLIC;
REVOKE ALL ON TABLE public.bookings_pii FROM anon;