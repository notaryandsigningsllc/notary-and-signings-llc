-- Fix SECURITY DEFINER functions with proper search_path and fully qualified table names

-- 1. has_role - Critical authorization function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$function$;

-- 2. assign_user_role - Role assignment function
CREATE OR REPLACE FUNCTION public.assign_user_role(_role app_role, _user_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = _user_email;
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id, _role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$function$;

-- 3. get_public_business_hours - Public business hours lookup
CREATE OR REPLACE FUNCTION public.get_public_business_hours()
 RETURNS TABLE(day_of_week integer, start_time time without time zone, end_time time without time zone)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT day_of_week, start_time, end_time
  FROM public.business_hours
  WHERE is_available = true;
$function$;

-- 4. get_public_blocked_dates - Public blocked dates lookup
CREATE OR REPLACE FUNCTION public.get_public_blocked_dates()
 RETURNS TABLE(blocked_date date)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT blocked_date FROM public.blocked_dates;
$function$;

-- 5. get_booked_times - Booked times lookup for scheduling
CREATE OR REPLACE FUNCTION public.get_booked_times(p_date date)
 RETURNS TABLE(appointment_time time without time zone, appointment_end_time time without time zone)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT appointment_time, appointment_end_time
  FROM public.bookings
  WHERE appointment_date = p_date AND status = 'confirmed';
$function$;

-- 6. get_booking_by_token - Token-based booking lookup
CREATE OR REPLACE FUNCTION public.get_booking_by_token(p_token uuid)
 RETURNS SETOF public.bookings
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT * FROM public.bookings WHERE booking_token = p_token LIMIT 1;
$function$;

-- 7. check_booking_conflict - Booking conflict detection
CREATE OR REPLACE FUNCTION public.check_booking_conflict(p_appointment_date date, p_appointment_time time without time zone, p_duration_minutes integer, p_booking_id uuid DEFAULT NULL::uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.bookings
    WHERE appointment_date = p_appointment_date
      AND (
        (appointment_time, appointment_end_time) OVERLAPS
        (p_appointment_time, p_appointment_time + (p_duration_minutes || ' minutes')::interval)
      )
      AND (id <> p_booking_id OR p_booking_id IS NULL)
      AND status = 'confirmed'
  );
$function$;

-- 8. get_booking_services - Public services lookup
CREATE OR REPLACE FUNCTION public.get_booking_services()
 RETURNS TABLE(id uuid, name text, description text, price_cents integer, duration_minutes integer)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT id, name, description, price_cents, duration_minutes
  FROM public.services
  WHERE is_active = true 
    AND (category IS NULL OR category != 'addon');
$function$;

-- 9. get_admin_services - Admin services lookup (requires admin role)
CREATE OR REPLACE FUNCTION public.get_admin_services()
 RETURNS TABLE(id uuid, name text, description text, price_cents integer, duration_minutes integer, is_active boolean, created_at timestamp with time zone, updated_at timestamp with time zone, stripe_price_id text, stripe_product_id text)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT s.id, s.name, s.description, s.price_cents,
         s.duration_minutes, s.is_active, s.created_at,
         s.updated_at, s.stripe_price_id, s.stripe_product_id
  FROM public.services s
  WHERE public.has_role((SELECT auth.uid()), 'admin'::public.app_role);
$function$;

-- 10. get_booking_by_id_and_email - Booking lookup by ID and email
CREATE OR REPLACE FUNCTION public.get_booking_by_id_and_email(p_booking_id uuid, p_email text)
 RETURNS TABLE(booking_id uuid, service_name text, service_description text, appointment_date date, appointment_time time without time zone, appointment_end_time time without time zone, status text, payment_status text, payment_method text, full_name text, email text, phone text, notes text, created_at timestamp with time zone, service_price integer, addon_ipen boolean, addon_ipen_price integer, total_amount integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
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
    b.created_at,
    b.service_price,
    b.addon_ipen,
    b.addon_ipen_price,
    b.total_amount
  FROM public.bookings b
  INNER JOIN public.services s ON b.service_id = s.id
  INNER JOIN public.bookings_pii bp ON b.id = bp.booking_id
  WHERE b.id = p_booking_id 
    AND bp.email = p_email;
END;
$function$;

-- 11. get_booking_pii - PII lookup with authorization
CREATE OR REPLACE FUNCTION public.get_booking_pii(p_booking_id uuid, p_token uuid DEFAULT NULL::uuid)
 RETURNS TABLE(pii_email text, pii_phone text, pii_full_name text, pii_notes text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  booking_user_id uuid;
  current_user_id uuid := auth.uid();
BEGIN
  SELECT user_id INTO booking_user_id 
  FROM public.bookings 
  WHERE id = p_booking_id;
  
  IF (current_user_id IS NOT NULL AND public.has_role(current_user_id, 'admin'::public.app_role)) OR
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
$function$;

-- 12. insert_booking_message - Secure message insertion
CREATE OR REPLACE FUNCTION public.insert_booking_message(p_booking_id uuid, p_message text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
  
  IF v_booking_owner IS NULL AND NOT public.has_role(v_user_id, 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Booking not found or access denied';
  END IF;
  
  -- Verify user can access this booking (owner or admin)
  IF v_user_id != v_booking_owner AND NOT public.has_role(v_user_id, 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Access denied to this booking';
  END IF;
  
  -- Determine sender_type based on actual role (server-side verification)
  IF public.has_role(v_user_id, 'admin'::public.app_role) THEN
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
$function$;

-- 13. check_rate_limit - Rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(p_key text, p_max_requests integer DEFAULT 5, p_window_seconds integer DEFAULT 3600)
 RETURNS TABLE(is_limited boolean, remaining integer, reset_in_seconds integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  v_window_start TIMESTAMPTZ;
  v_count INTEGER;
  v_now TIMESTAMPTZ := now();
  v_window_duration INTERVAL := (p_window_seconds || ' seconds')::INTERVAL;
BEGIN
  -- Try to get existing record
  SELECT rl.count, rl.window_start INTO v_count, v_window_start
  FROM public.rate_limits rl
  WHERE rl.key = p_key
  FOR UPDATE;
  
  IF FOUND THEN
    -- Check if window has expired
    IF v_window_start + v_window_duration < v_now THEN
      -- Reset the window
      UPDATE public.rate_limits rl
      SET count = 1, window_start = v_now, updated_at = v_now
      WHERE rl.key = p_key;
      
      RETURN QUERY SELECT 
        FALSE::BOOLEAN AS is_limited, 
        (p_max_requests - 1)::INTEGER AS remaining,
        p_window_seconds AS reset_in_seconds;
    ELSE
      -- Window still active
      IF v_count >= p_max_requests THEN
        -- Rate limited
        RETURN QUERY SELECT 
          TRUE::BOOLEAN AS is_limited, 
          0::INTEGER AS remaining,
          EXTRACT(EPOCH FROM (v_window_start + v_window_duration - v_now))::INTEGER AS reset_in_seconds;
      ELSE
        -- Increment counter
        UPDATE public.rate_limits rl
        SET count = count + 1, updated_at = v_now
        WHERE rl.key = p_key;
        
        RETURN QUERY SELECT 
          FALSE::BOOLEAN AS is_limited, 
          (p_max_requests - v_count - 1)::INTEGER AS remaining,
          EXTRACT(EPOCH FROM (v_window_start + v_window_duration - v_now))::INTEGER AS reset_in_seconds;
      END IF;
    END IF;
  ELSE
    -- Create new record
    INSERT INTO public.rate_limits (key, count, window_start, updated_at)
    VALUES (p_key, 1, v_now, v_now);
    
    RETURN QUERY SELECT 
      FALSE::BOOLEAN AS is_limited, 
      (p_max_requests - 1)::INTEGER AS remaining,
      p_window_seconds AS reset_in_seconds;
  END IF;
END;
$function$;

-- 14. cleanup_old_rate_limits - Cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.rate_limits
  WHERE updated_at < now() - INTERVAL '24 hours';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$function$;

-- 15. update_updated_at_column - Trigger function (non-SECURITY DEFINER, but fix for consistency)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 16. calculate_appointment_end_time - Trigger function
CREATE OR REPLACE FUNCTION public.calculate_appointment_end_time()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
DECLARE
  duration integer;
BEGIN
  SELECT duration_minutes INTO duration FROM public.services WHERE id = NEW.service_id;
  IF duration IS NOT NULL THEN
    NEW.appointment_end_time := NEW.appointment_time + (duration || ' minutes')::interval;
  END IF;
  RETURN NEW;
END;
$function$;