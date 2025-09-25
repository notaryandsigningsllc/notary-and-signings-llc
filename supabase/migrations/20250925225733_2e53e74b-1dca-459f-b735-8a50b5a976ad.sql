-- Deny implicit access to bookings table
REVOKE ALL ON TABLE public.bookings FROM PUBLIC;
REVOKE ALL ON TABLE public.bookings FROM anon, authenticated;

-- Ensure RLS is enabled and enforced
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings FORCE ROW LEVEL SECURITY;