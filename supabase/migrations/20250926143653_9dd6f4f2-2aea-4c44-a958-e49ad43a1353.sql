-- Public-safe helpers for availability
CREATE OR REPLACE FUNCTION public.get_public_business_hours()
RETURNS TABLE(day_of_week integer, start_time time without time zone, end_time time without time zone)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT day_of_week, start_time, end_time
  FROM public.business_hours
  WHERE is_available = true
$function$;

CREATE OR REPLACE FUNCTION public.get_public_blocked_dates()
RETURNS TABLE(blocked_date date)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT blocked_date
  FROM public.blocked_dates
$function$;

-- Ensure appointment_end_time is automatically calculated
DROP TRIGGER IF EXISTS set_booking_end_time ON public.bookings;
CREATE TRIGGER set_booking_end_time
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.calculate_appointment_end_time();