-- Fix critical PII security issue: Add missing INSERT and UPDATE policies
-- This prevents unauthorized access to sensitive customer data

-- Add INSERT policy for bookings_pii
-- Users can only insert PII for their own bookings
CREATE POLICY "Authenticated users can insert their own PII" 
ON public.bookings_pii 
FOR INSERT 
WITH CHECK (
  (SELECT auth.uid()) IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_id 
    AND bookings.user_id = (SELECT auth.uid())
  )
);

-- Add UPDATE policy for bookings_pii
-- Users can only update PII for their own bookings
CREATE POLICY "Authenticated users can update their own PII" 
ON public.bookings_pii 
FOR UPDATE 
USING (
  (SELECT auth.uid()) IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_id 
    AND bookings.user_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  (SELECT auth.uid()) IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_id 
    AND bookings.user_id = (SELECT auth.uid())
  )
);