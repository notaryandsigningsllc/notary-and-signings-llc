-- SELECT: users can read only their own bookings
CREATE POLICY "read_own_bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- INSERT: users can insert only if they set user_id = auth.uid()
CREATE POLICY "insert_own_bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- UPDATE: users can update only their own rows
CREATE POLICY "update_own_bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- DELETE: users can delete only their own rows
CREATE POLICY "delete_own_bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (user_id = auth.uid());