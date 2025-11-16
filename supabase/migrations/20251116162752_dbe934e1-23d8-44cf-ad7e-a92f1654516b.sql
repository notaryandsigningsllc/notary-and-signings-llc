-- Grant execute permission to both anonymous and authenticated users
-- The function already has security checks to verify the token
GRANT EXECUTE ON FUNCTION public.get_booking_pii(uuid, uuid) TO anon, authenticated;