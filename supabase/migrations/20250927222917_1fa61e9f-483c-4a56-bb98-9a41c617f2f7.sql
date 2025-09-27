-- Insert booking with defaults, create PII row, return IDs
WITH new_booking AS (
  INSERT INTO public.bookings (service_id, appointment_date, appointment_time, payment_method, payment_status, booking_token)
  VALUES (
    (SELECT id FROM public.services WHERE is_active = true LIMIT 1), -- Use actual service
    CURRENT_DATE,
    date_trunc('minute', now())::time,
    'online',
    'pending',
    gen_random_uuid()
  )
  RETURNING id, service_id, user_id, appointment_date, appointment_time, appointment_end_time, booking_token
), pii AS (
  INSERT INTO public.bookings_pii (booking_id, email, phone, full_name, notes)
  SELECT id, 'test@example.com'::text AS email, '555-0123'::text AS phone, 'Test User'::text AS full_name, 'Test booking'::text AS notes
  FROM new_booking
  RETURNING booking_id
)
SELECT json_build_object('booking', to_jsonb(new_booking.*), 'pii_booking_id', pii.booking_id)
FROM new_booking CROSS JOIN pii;