-- Create function to securely lookup booking by ID and email
CREATE OR REPLACE FUNCTION public.get_booking_by_id_and_email(
  p_booking_id uuid,
  p_email text
)
RETURNS TABLE(
  booking_id uuid,
  service_name text,
  service_description text,
  appointment_date date,
  appointment_time time,
  appointment_end_time time,
  status text,
  payment_status text,
  payment_method text,
  full_name text,
  email text,
  phone text,
  notes text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only return data if the email matches (security check)
  RETURN QUERY
  SELECT 
    b.id as booking_id,
    s.name as service_name,
    s.description as service_description,
    b.appointment_date,
    b.appointment_time,
    b.appointment_end_time,
    b.status,
    b.payment_status,
    b.payment_method,
    bp.full_name,
    bp.email,
    bp.phone,
    bp.notes,
    b.created_at
  FROM public.bookings b
  INNER JOIN public.services s ON b.service_id = s.id
  INNER JOIN public.bookings_pii bp ON b.id = bp.booking_id
  WHERE b.id = p_booking_id 
    AND bp.email = p_email;
END;
$$;