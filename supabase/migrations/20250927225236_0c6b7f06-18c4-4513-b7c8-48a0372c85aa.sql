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

-- Update the get_booking_pii function to be more secure
-- This function should be the ONLY way to access PII for anonymous bookings
CREATE OR REPLACE FUNCTION public.get_booking_pii(p_booking_id uuid, p_token uuid DEFAULT NULL::uuid)
RETURNS TABLE(email text, phone text, full_name text, notes text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  booking_user_id uuid;
  current_user_id uuid := auth.uid();
BEGIN
  -- Get the user_id for this booking
  SELECT user_id INTO booking_user_id 
  FROM public.bookings 
  WHERE id = p_booking_id;
  
  -- Security check: Allow access if:
  -- 1. User is admin
  -- 2. User owns the booking (for authenticated bookings)
  -- 3. Valid token provided (for anonymous bookings)
  IF (current_user_id IS NOT NULL AND public.has_role(current_user_id, 'admin')) OR
     (current_user_id IS NOT NULL AND current_user_id = booking_user_id) OR 
     (p_token IS NOT NULL AND EXISTS (
       SELECT 1 FROM public.bookings 
       WHERE id = p_booking_id AND booking_token = p_token
     )) THEN
    
    RETURN QUERY
    SELECT pii.email, pii.phone, pii.full_name, pii.notes
    FROM public.bookings_pii pii
    WHERE pii.booking_id = p_booking_id;
  END IF;
  
  -- If no access, return nothing (no error to avoid information leakage)
  RETURN;
END;
$$;