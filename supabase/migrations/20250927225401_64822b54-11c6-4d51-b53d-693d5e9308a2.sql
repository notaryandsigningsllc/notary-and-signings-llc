-- CRITICAL SECURITY FIX: Fix PII exposure for anonymous bookings
-- The current policies only protect authenticated users' PII
-- Anonymous bookings (user_id = NULL) have NO protection!

-- Drop existing vulnerable policies
DROP POLICY IF EXISTS "Authenticated users can view their own PII" ON public.bookings_pii;
DROP POLICY IF EXISTS "Authenticated users can insert their own PII" ON public.bookings_pii;
DROP POLICY IF EXISTS "Authenticated users can update their own PII" ON public.bookings_pii;

-- Create secure policies that protect ALL customer PII
-- Policy 1: SELECT - Only admins can directly access PII table
CREATE POLICY "Restrict PII access to authorized functions only"
ON public.bookings_pii
FOR SELECT
TO authenticated
USING (
  -- Only admins can directly access PII table
  public.has_role(auth.uid(), 'admin')
);

-- Policy 2: INSERT - Only authorized users can insert PII
CREATE POLICY "Secure PII insertion"
ON public.bookings_pii
FOR INSERT
TO authenticated
WITH CHECK (
  -- Admins can insert any PII
  public.has_role(auth.uid(), 'admin') OR
  -- Users can only insert PII for their own bookings
  (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE bookings.id = booking_id 
      AND bookings.user_id = auth.uid()
    )
  )
);

-- Policy 3: UPDATE - Only admins or booking owners can update PII
CREATE POLICY "Secure PII updates"
ON public.bookings_pii
FOR UPDATE
TO authenticated
USING (
  -- Admins can update any PII
  public.has_role(auth.uid(), 'admin') OR
  -- Users can only update PII for their own bookings
  (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE bookings.id = booking_id 
      AND bookings.user_id = auth.uid()
    )
  )
)
WITH CHECK (
  -- Same conditions for check
  public.has_role(auth.uid(), 'admin') OR
  (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE bookings.id = booking_id 
      AND bookings.user_id = auth.uid()
    )
  )
);

-- Policy 4: DELETE - Only admins can delete PII
CREATE POLICY "Only admins can delete PII"
ON public.bookings_pii
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));