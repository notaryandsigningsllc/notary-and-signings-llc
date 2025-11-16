-- Drop and recreate the get_booking_pii function with unambiguous column names
DROP FUNCTION IF EXISTS public.get_booking_pii(uuid, uuid);

CREATE OR REPLACE FUNCTION public.get_booking_pii(p_booking_id uuid, p_token uuid DEFAULT NULL::uuid)
RETURNS TABLE(
  pii_email text, 
  pii_phone text, 
  pii_full_name text, 
  pii_notes text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  booking_user_id uuid;
  current_user_id uuid := auth.uid();
BEGIN
  SELECT user_id INTO booking_user_id 
  FROM public.bookings 
  WHERE id = p_booking_id;
  
  IF (current_user_id IS NOT NULL AND public.has_role(current_user_id, 'admin')) OR
     (current_user_id IS NOT NULL AND current_user_id = booking_user_id) OR 
     (p_token IS NOT NULL AND EXISTS (
       SELECT 1 FROM public.bookings 
       WHERE id = p_booking_id AND booking_token = p_token
     )) THEN
    
    RETURN QUERY
    SELECT 
      pii.email::text, 
      pii.phone::text, 
      pii.full_name::text, 
      pii.notes::text
    FROM public.bookings_pii pii
    WHERE pii.booking_id = p_booking_id;
  END IF;
  
  RETURN;
END;
$$;