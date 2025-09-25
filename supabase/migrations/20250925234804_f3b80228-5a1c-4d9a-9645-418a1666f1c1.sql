-- Fix security vulnerability: Implement stricter PII insertion validation
-- Replace the overly permissive policy with secure validation

-- Drop the current overly permissive policy
DROP POLICY IF EXISTS "Allow PII insertion for booking creation" ON public.bookings_pii;

-- Create a more secure policy that:
-- 1. For authenticated users: allows PII insertion for their own bookings
-- 2. For anonymous users: only allows PII insertion for very recent bookings (within 10 minutes)
--    and only if no PII already exists for that booking
CREATE POLICY "Secure PII insertion with validation" 
ON public.bookings_pii 
FOR INSERT 
WITH CHECK (
  -- Case 1: Authenticated user inserting PII for their own booking
  (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE id = booking_id AND user_id = auth.uid()
  ))
  OR
  -- Case 2: Anonymous user inserting PII for a recent booking without existing PII
  (auth.uid() IS NULL AND EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = booking_id 
    AND b.user_id IS NULL  -- Booking was created by anonymous user
    AND b.created_at > (now() - INTERVAL '10 minutes')  -- Recent booking (within 10 minutes)
    AND NOT EXISTS (  -- No PII already exists for this booking
      SELECT 1 FROM public.bookings_pii p 
      WHERE p.booking_id = b.id
    )
  ))
);

-- Add a policy to prevent anonymous users from reading PII
-- (they should only be able to access it via the get_booking_pii function with proper token)
CREATE POLICY "Prevent anonymous PII access" 
ON public.bookings_pii 
FOR SELECT 
USING (
  -- Only authenticated users who own the booking can read PII directly
  auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE id = booking_id AND user_id = auth.uid()
  )
);