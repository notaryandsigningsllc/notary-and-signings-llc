-- Update the check_booking_conflict function to use a 45-minute buffer
CREATE OR REPLACE FUNCTION public.check_booking_conflict(p_appointment_date date, p_appointment_time time without time zone, p_duration_minutes integer, p_booking_id uuid DEFAULT NULL::uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  start_time TIME := p_appointment_time;
  end_time TIME := p_appointment_time + (p_duration_minutes || ' minutes')::INTERVAL;
  buffer_start TIME := start_time - INTERVAL '45 minutes';
  buffer_end TIME := end_time + INTERVAL '45 minutes';
  conflict_count INTEGER;
BEGIN
  -- Check for overlapping appointments with 45-minute buffer
  SELECT COUNT(*)
  INTO conflict_count
  FROM public.bookings b
  JOIN public.services s ON b.service_id = s.id
  WHERE b.appointment_date = p_appointment_date
    AND b.status = 'confirmed'
    AND (p_booking_id IS NULL OR b.id != p_booking_id)
    AND (
      -- Existing appointment overlaps with new appointment + buffer
      (b.appointment_time < buffer_end AND b.appointment_end_time > buffer_start)
    );
  
  RETURN conflict_count > 0;
END;
$function$;