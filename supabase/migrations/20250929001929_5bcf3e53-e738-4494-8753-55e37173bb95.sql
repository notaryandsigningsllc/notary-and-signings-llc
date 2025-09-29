-- Security fixes: Performance optimization and policy consolidation

-- First, drop conflicting and redundant policies on bookings_pii
DROP POLICY IF EXISTS "Admin only PII insertion" ON public.bookings_pii;
DROP POLICY IF EXISTS "Admin only PII updates" ON public.bookings_pii;
DROP POLICY IF EXISTS "Admin only PII deletion" ON public.bookings_pii;
DROP POLICY IF EXISTS "Admin only PII access" ON public.bookings_pii;
DROP POLICY IF EXISTS "Restrict PII access to authorized functions only" ON public.bookings_pii;
DROP POLICY IF EXISTS "Secure PII insertion" ON public.bookings_pii;
DROP POLICY IF EXISTS "Secure PII updates" ON public.bookings_pii;
DROP POLICY IF EXISTS "Only admins can delete PII" ON public.bookings_pii;

-- Create consolidated and optimized PII policies with proper auth function usage
CREATE POLICY "Consolidated PII access policy"
ON public.bookings_pii FOR SELECT
TO authenticated
USING (
  has_role((SELECT auth.uid()), 'admin'::app_role) OR
  ((SELECT auth.uid()) IS NOT NULL AND EXISTS (
    SELECT 1 FROM bookings 
    WHERE bookings.id = bookings_pii.booking_id 
    AND bookings.user_id = (SELECT auth.uid())
  ))
);

CREATE POLICY "Consolidated PII insertion policy"
ON public.bookings_pii FOR INSERT
TO authenticated
WITH CHECK (
  has_role((SELECT auth.uid()), 'admin'::app_role) OR
  ((SELECT auth.uid()) IS NOT NULL AND EXISTS (
    SELECT 1 FROM bookings 
    WHERE bookings.id = bookings_pii.booking_id 
    AND bookings.user_id = (SELECT auth.uid())
  ))
);

CREATE POLICY "Consolidated PII update policy"
ON public.bookings_pii FOR UPDATE
TO authenticated
USING (
  has_role((SELECT auth.uid()), 'admin'::app_role) OR
  ((SELECT auth.uid()) IS NOT NULL AND EXISTS (
    SELECT 1 FROM bookings 
    WHERE bookings.id = bookings_pii.booking_id 
    AND bookings.user_id = (SELECT auth.uid())
  ))
)
WITH CHECK (
  has_role((SELECT auth.uid()), 'admin'::app_role) OR
  ((SELECT auth.uid()) IS NOT NULL AND EXISTS (
    SELECT 1 FROM bookings 
    WHERE bookings.id = bookings_pii.booking_id 
    AND bookings.user_id = (SELECT auth.uid())
  ))
);

CREATE POLICY "Admin only PII deletion policy"
ON public.bookings_pii FOR DELETE
TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role));

-- Deny anonymous access to PII explicitly
CREATE POLICY "Deny anonymous PII access" ON public.bookings_pii
AS RESTRICTIVE FOR ALL TO anon
USING (false);

-- Fix user_roles policies - drop existing and recreate with optimized auth calls
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

-- Deny anonymous access to user_roles explicitly
CREATE POLICY "Deny anonymous user_roles access" ON public.user_roles
AS RESTRICTIVE FOR ALL TO anon
USING (false);

-- Fix other table policies to use optimized auth function calls
-- Services table
DROP POLICY IF EXISTS "Only admins can access services table" ON public.services;
CREATE POLICY "Only admins can access services table"
ON public.services FOR ALL
TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

-- Business hours table
DROP POLICY IF EXISTS "Only admins can access business hours table" ON public.business_hours;
CREATE POLICY "Only admins can access business hours table"
ON public.business_hours FOR ALL
TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

-- Blocked dates table
DROP POLICY IF EXISTS "Only admins can access blocked dates table" ON public.blocked_dates;
CREATE POLICY "Only admins can access blocked dates table"
ON public.blocked_dates FOR ALL
TO authenticated
USING (has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

-- Fix news_feed policy for performance
DROP POLICY IF EXISTS "Only permanent users can post to the news feed" ON public.news_feed;
CREATE POLICY "Only permanent users can post to the news feed"
ON public.news_feed AS RESTRICTIVE FOR INSERT
TO authenticated
WITH CHECK ((SELECT (auth.jwt()->>'is_anonymous')::boolean) IS FALSE);

-- Add explicit anonymous access denial policies for sensitive tables
CREATE POLICY "Deny anonymous bookings access" ON public.bookings
AS RESTRICTIVE FOR ALL TO anon
USING (false);

CREATE POLICY "Deny anonymous booking_messages access" ON public.booking_messages
AS RESTRICTIVE FOR ALL TO anon
USING (false);

CREATE POLICY "Deny anonymous services access" ON public.services
AS RESTRICTIVE FOR ALL TO anon
USING (false);

CREATE POLICY "Deny anonymous business_hours access" ON public.business_hours
AS RESTRICTIVE FOR ALL TO anon
USING (false);

CREATE POLICY "Deny anonymous blocked_dates access" ON public.blocked_dates
AS RESTRICTIVE FOR ALL TO anon
USING (false);