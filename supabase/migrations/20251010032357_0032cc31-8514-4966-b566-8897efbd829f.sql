-- Add RLS policies for bookings_pii table to protect sensitive customer data

-- Policy 1: Admins can view all PII
CREATE POLICY "Admins can view all booking PII"
ON public.bookings_pii
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy 2: Users can view PII for their own bookings
CREATE POLICY "Users can view their own booking PII"
ON public.bookings_pii
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.id = bookings_pii.booking_id
    AND bookings.user_id = auth.uid()
  )
);

-- Policy 3: Allow system to insert PII (for booking creation via edge functions)
-- This uses service role key in edge functions, so we allow INSERT for service role
CREATE POLICY "System can insert booking PII"
ON public.bookings_pii
FOR INSERT
WITH CHECK (true);

-- Policy 4: Admins can update booking PII if needed
CREATE POLICY "Admins can update booking PII"
ON public.bookings_pii
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policy 5: Admins can delete booking PII if needed
CREATE POLICY "Admins can delete booking PII"
ON public.bookings_pii
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));