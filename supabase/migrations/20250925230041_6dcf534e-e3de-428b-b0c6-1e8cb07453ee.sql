-- Create a safe view with only non-sensitive columns
CREATE OR REPLACE VIEW public.bookings_safe AS
SELECT 
  id, 
  user_id, 
  service_id, 
  appointment_date,
  appointment_time, 
  status, 
  created_at
FROM public.bookings;

-- Enable security barrier to ensure RLS is respected
ALTER VIEW public.bookings_safe SET (security_barrier = true);

-- Revoke all default permissions and grant only to authenticated users
REVOKE ALL ON TABLE public.bookings_safe FROM PUBLIC;
GRANT SELECT ON public.bookings_safe TO authenticated;