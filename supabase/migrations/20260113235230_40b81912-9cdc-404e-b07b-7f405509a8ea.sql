-- Fix 1: Add SELECT policies to bookings table
-- Allow authenticated users to view their own bookings
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow admins to view all bookings
CREATE POLICY "Admins can view all bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Deny anonymous users from viewing bookings directly
-- (They can still use get_booking_by_token function for their specific booking)
CREATE POLICY "Deny anonymous booking access"
ON public.bookings
FOR SELECT
TO anon
USING (false);

-- Fix 2: Add restrictive policy for anonymous access to bookings_pii
-- The existing policies are permissive but we need explicit anon denial
CREATE POLICY "Deny anonymous PII access"
ON public.bookings_pii
FOR SELECT
TO anon
USING (false);

-- Fix 3: Add restrictive policy for anonymous access to follow_up_emails  
CREATE POLICY "Deny anonymous follow-up emails access"
ON public.follow_up_emails
FOR SELECT
TO anon
USING (false);