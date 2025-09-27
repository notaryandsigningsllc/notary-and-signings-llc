-- Update the get_booking_pii function to work with the new security model
CREATE OR REPLACE FUNCTION public.get_booking_pii(p_booking_id uuid, p_token uuid DEFAULT NULL::uuid)
RETURNS TABLE(email text, phone text, full_name text, notes text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  booking_user_id uuid;
  current_user_id uuid := auth.uid();
BEGIN
  -- Get the user_id for this booking
  SELECT user_id INTO booking_user_id 
  FROM public.bookings 
  WHERE id = p_booking_id;
  
  -- Security check: Allow access if:
  -- 1. User is admin
  -- 2. User owns the booking (for authenticated bookings)
  -- 3. Valid token provided (for anonymous bookings)
  IF (current_user_id IS NOT NULL AND public.has_role(current_user_id, 'admin')) OR
     (current_user_id IS NOT NULL AND current_user_id = booking_user_id) OR 
     (p_token IS NOT NULL AND EXISTS (
       SELECT 1 FROM public.bookings 
       WHERE id = p_booking_id AND booking_token = p_token
     )) THEN
    
    RETURN QUERY
    SELECT pii.email, pii.phone, pii.full_name, pii.notes
    FROM public.bookings_pii pii
    WHERE pii.booking_id = p_booking_id;
  END IF;
  
  -- If no access, return nothing (no error to avoid information leakage)
  RETURN;
END;
$$;