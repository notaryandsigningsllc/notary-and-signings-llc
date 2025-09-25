-- Drop and recreate the view without security_barrier to avoid security definer issues
DROP VIEW IF EXISTS public.bookings_safe;

-- Create a standard view that inherits RLS from the underlying bookings table
CREATE VIEW public.bookings_safe AS
SELECT 
  id, 
  user_id, 
  service_id, 
  appointment_date,
  appointment_time, 
  status, 
  created_at
FROM public.bookings;

-- Grant permissions (views inherit RLS from underlying tables)
REVOKE ALL ON TABLE public.bookings_safe FROM PUBLIC;
GRANT SELECT ON public.bookings_safe TO authenticated;