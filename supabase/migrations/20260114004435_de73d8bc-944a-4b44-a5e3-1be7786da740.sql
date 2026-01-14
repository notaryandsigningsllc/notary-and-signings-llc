-- Fix 1: Update get_admin_services to require admin role
CREATE OR REPLACE FUNCTION public.get_admin_services()
RETURNS TABLE(
  id uuid, 
  name text, 
  description text, 
  price_cents integer, 
  duration_minutes integer, 
  is_active boolean, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone, 
  stripe_price_id text, 
  stripe_product_id text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT s.id, s.name, s.description, s.price_cents,
         s.duration_minutes, s.is_active, s.created_at,
         s.updated_at, s.stripe_price_id, s.stripe_product_id
  FROM public.services s
  WHERE public.has_role((SELECT auth.uid()), 'admin'::app_role);
$$;

-- Fix 2: Create server-side function for inserting booking messages with verified sender_type
CREATE OR REPLACE FUNCTION public.insert_booking_message(
  p_booking_id uuid,
  p_message text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_sender_type text;
  v_message_id uuid;
  v_user_id uuid := auth.uid();
  v_booking_owner uuid;
BEGIN
  -- Check user is authenticated
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Validate message
  IF p_message IS NULL OR trim(p_message) = '' THEN
    RAISE EXCEPTION 'Message cannot be empty';
  END IF;
  
  -- Get booking owner
  SELECT user_id INTO v_booking_owner
  FROM public.bookings
  WHERE id = p_booking_id;
  
  IF v_booking_owner IS NULL AND NOT public.has_role(v_user_id, 'admin'::app_role) THEN
    RAISE EXCEPTION 'Booking not found or access denied';
  END IF;
  
  -- Verify user can access this booking (owner or admin)
  IF v_user_id != v_booking_owner AND NOT public.has_role(v_user_id, 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied to this booking';
  END IF;
  
  -- Determine sender_type based on actual role (server-side verification)
  IF public.has_role(v_user_id, 'admin'::app_role) THEN
    v_sender_type := 'admin';
  ELSE
    v_sender_type := 'customer';
  END IF;
  
  -- Insert with verified sender_type
  INSERT INTO public.booking_messages (booking_id, sender_id, sender_type, message)
  VALUES (p_booking_id, v_user_id, v_sender_type, trim(p_message))
  RETURNING id INTO v_message_id;
  
  RETURN v_message_id;
END;
$$;