-- Step 1: Create a separate PII table with maximum security
CREATE TABLE public.bookings_pii (
  booking_id uuid PRIMARY KEY REFERENCES public.bookings(id) ON DELETE CASCADE,
  email text NOT NULL,
  phone text NOT NULL,
  full_name text NOT NULL,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS with no policies - only accessible via SECURITY DEFINER functions
ALTER TABLE public.bookings_pii ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings_pii FORCE ROW LEVEL SECURITY;

-- Revoke all access to PII table
REVOKE ALL ON TABLE public.bookings_pii FROM PUBLIC;
REVOKE ALL ON TABLE public.bookings_pii FROM anon, authenticated;

-- Step 2: Create a SECURITY DEFINER function to safely access PII
CREATE OR REPLACE FUNCTION public.get_booking_pii(p_booking_id uuid, p_token uuid DEFAULT NULL)
RETURNS TABLE(
  email text,
  phone text,
  full_name text,
  notes text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  booking_user_id uuid;
  current_user_id uuid := auth.uid();
BEGIN
  -- Get the user_id for this booking
  SELECT user_id INTO booking_user_id 
  FROM public.bookings 
  WHERE id = p_booking_id;
  
  -- Check access: either user owns the booking OR valid token provided
  IF (current_user_id IS NOT NULL AND current_user_id = booking_user_id) OR 
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

-- Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION public.get_booking_pii(uuid, uuid) TO authenticated;

-- Step 3: Migrate existing PII data
INSERT INTO public.bookings_pii (booking_id, email, phone, full_name, notes)
SELECT id, email, phone, full_name, COALESCE(notes, '') 
FROM public.bookings
WHERE email IS NOT NULL AND phone IS NOT NULL AND full_name IS NOT NULL;

-- Step 4: Remove PII columns from main bookings table
ALTER TABLE public.bookings 
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS phone,
DROP COLUMN IF EXISTS full_name,
DROP COLUMN IF EXISTS notes;

-- Step 5: Update the safe view to exclude any remaining sensitive data
DROP VIEW IF EXISTS public.bookings_safe;
CREATE VIEW public.bookings_safe AS
SELECT 
  id, 
  user_id, 
  service_id, 
  appointment_date,
  appointment_time,
  appointment_end_time,
  status,
  payment_status,
  payment_method,
  created_at,
  updated_at
FROM public.bookings;

-- Grant permissions to the safe view
REVOKE ALL ON TABLE public.bookings_safe FROM PUBLIC;
GRANT SELECT ON public.bookings_safe TO authenticated;