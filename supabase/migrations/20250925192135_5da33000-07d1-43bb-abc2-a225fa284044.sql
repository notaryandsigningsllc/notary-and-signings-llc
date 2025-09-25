-- 1) Add a booking_token column for token-based anonymous access
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS booking_token uuid NOT NULL DEFAULT gen_random_uuid();

-- Ensure uniqueness for direct lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_booking_token ON public.bookings (booking_token);

-- 2) Harden RLS: remove public access to anonymous bookings
-- Drop existing insecure SELECT policy if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'bookings' 
      AND policyname = 'Users can view their own bookings'
  ) THEN
    DROP POLICY "Users can view their own bookings" ON public.bookings;
  END IF;
END $$;

-- Recreate strict SELECT policy: only owners can view their bookings
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
USING (auth.uid() = user_id);

-- Keep existing INSERT and UPDATE policies as-is (INSERT: true; UPDATE: owner-only)

-- 3) RPC to fetch a booking safely by token (bypasses RLS via SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_booking_by_token(p_token uuid)
RETURNS SETOF public.bookings
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.*
  FROM public.bookings b
  WHERE b.booking_token = p_token
  LIMIT 1;
$$;

-- Allow public (anon and authenticated) to call the function
GRANT EXECUTE ON FUNCTION public.get_booking_by_token(uuid) TO anon, authenticated;

-- 4) RPC to return only booked time ranges for a given date (no PII)
CREATE OR REPLACE FUNCTION public.get_booked_times(p_date date)
RETURNS TABLE(appointment_time time without time zone, appointment_end_time time without time zone)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT appointment_time, appointment_end_time
  FROM public.bookings
  WHERE appointment_date = p_date AND status = 'confirmed';
$$;

GRANT EXECUTE ON FUNCTION public.get_booked_times(date) TO anon, authenticated;