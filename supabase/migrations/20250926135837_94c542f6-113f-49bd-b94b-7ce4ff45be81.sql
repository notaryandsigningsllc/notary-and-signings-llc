-- Fix critical security issue: Add missing INSERT policy for bookings
-- This allows authenticated users to create new bookings

CREATE POLICY "Authenticated users can create their own bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  (SELECT auth.uid()) IS NOT NULL AND 
  user_id = (SELECT auth.uid())
);