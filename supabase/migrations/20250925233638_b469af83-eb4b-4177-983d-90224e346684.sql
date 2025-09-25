-- Fix multiple permissive policies issue on public.bookings table
-- Remove the duplicate UPDATE policy to improve performance

-- Drop the redundant "Users can update their own bookings" policy
-- Keep "update_own_bookings" as it has both USING and WITH CHECK expressions
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;