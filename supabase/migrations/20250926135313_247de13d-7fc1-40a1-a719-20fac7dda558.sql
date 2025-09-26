-- Optimize RLS policies to prevent re-evaluation of auth functions for each row
-- This improves query performance at scale by using (SELECT auth.uid()) instead of auth.uid()

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can delete their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can view their own PII" ON public.bookings_pii;
DROP POLICY IF EXISTS "Business hours are viewable by authenticated users only" ON public.business_hours;
DROP POLICY IF EXISTS "Blocked dates require authentication" ON public.blocked_dates;
DROP POLICY IF EXISTS "Authenticated users can view service details" ON public.services;

-- Recreate policies with optimized auth function calls

-- Bookings policies
CREATE POLICY "Authenticated users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));

CREATE POLICY "Authenticated users can update their own bookings" 
ON public.bookings 
FOR UPDATE 
USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()))
WITH CHECK ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));

CREATE POLICY "Authenticated users can delete their own bookings" 
ON public.bookings 
FOR DELETE 
USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));

-- Bookings PII policy
CREATE POLICY "Authenticated users can view their own PII" 
ON public.bookings_pii 
FOR SELECT 
USING ((SELECT auth.uid()) IS NOT NULL AND EXISTS (
  SELECT 1 FROM bookings 
  WHERE bookings.id = bookings_pii.booking_id 
  AND bookings.user_id = (SELECT auth.uid())
));

-- Business hours policy
CREATE POLICY "Business hours are viewable by authenticated users only" 
ON public.business_hours 
FOR SELECT 
USING ((SELECT auth.uid()) IS NOT NULL AND is_available = true);

-- Blocked dates policy
CREATE POLICY "Blocked dates require authentication" 
ON public.blocked_dates 
FOR SELECT 
USING ((SELECT auth.uid()) IS NOT NULL);

-- Services policy
CREATE POLICY "Authenticated users can view service details" 
ON public.services 
FOR SELECT 
USING ((SELECT auth.uid()) IS NOT NULL AND is_active = true);