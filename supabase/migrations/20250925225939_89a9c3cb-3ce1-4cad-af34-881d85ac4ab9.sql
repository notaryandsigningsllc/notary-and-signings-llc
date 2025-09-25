-- Optional: let anonymous users create a booking (no reads!)
CREATE POLICY "anon_can_create_booking"
ON public.bookings
FOR INSERT
TO anon
WITH CHECK (true);   -- but do NOT grant SELECT to anon