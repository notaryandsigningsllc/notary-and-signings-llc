-- CRITICAL SECURITY FIX: Fix PII exposure for anonymous bookings
-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Authenticated users can view their own PII" ON public.bookings_pii;
DROP POLICY IF EXISTS "Authenticated users can insert their own PII" ON public.bookings_pii;
DROP POLICY IF EXISTS "Authenticated users can update their own PII" ON public.bookings_pii;
DROP POLICY IF EXISTS "Restrict PII access to authorized functions only" ON public.bookings_pii;
DROP POLICY IF EXISTS "Secure PII insertion" ON public.bookings_pii;
DROP POLICY IF EXISTS "Secure PII updates" ON public.bookings_pii;
DROP POLICY IF EXISTS "Only admins can delete PII" ON public.bookings_pii;

-- Create completely new secure policies
-- Policy 1: SELECT - Only admins can directly access PII table
CREATE POLICY "Admin only PII access"
ON public.bookings_pii
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy 2: INSERT - Only admins can insert PII (edge functions use service role)
CREATE POLICY "Admin only PII insertion"
ON public.bookings_pii
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policy 3: UPDATE - Only admins can update PII
CREATE POLICY "Admin only PII updates"
ON public.bookings_pii
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policy 4: DELETE - Only admins can delete PII
CREATE POLICY "Admin only PII deletion"
ON public.bookings_pii
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));