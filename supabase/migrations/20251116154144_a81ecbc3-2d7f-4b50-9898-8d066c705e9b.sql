-- Update get_booking_services to exclude addon services from the dropdown
CREATE OR REPLACE FUNCTION public.get_booking_services()
RETURNS TABLE(id uuid, name text, description text, price_cents integer, duration_minutes integer)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT id, name, description, price_cents, duration_minutes
  FROM public.services
  WHERE is_active = true 
    AND (category IS NULL OR category != 'addon');
$function$;