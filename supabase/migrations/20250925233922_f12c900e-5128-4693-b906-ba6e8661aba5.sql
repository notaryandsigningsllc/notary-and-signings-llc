-- Fix security issue: Add INSERT policy for bookings_pii table
-- This allows both anonymous users and authenticated users to insert PII data when creating bookings

-- Create INSERT policy for bookings_pii that allows:
-- 1. Anonymous users to insert PII for any booking (they just created it)
-- 2. Authenticated users to insert PII for their own bookings
CREATE POLICY "Allow PII insertion for booking creation" 
ON public.bookings_pii 
FOR INSERT 
WITH CHECK (
  -- Allow if user is anonymous (no auth.uid()) - they can insert PII for any booking
  auth.uid() IS NULL
  OR
  -- Allow if user is authenticated and the booking belongs to them
  (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE id = booking_id AND user_id = auth.uid()
  ))
);