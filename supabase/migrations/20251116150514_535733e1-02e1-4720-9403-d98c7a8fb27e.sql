-- Add new columns to bookings table for add-on tracking and pricing
ALTER TABLE bookings 
  ADD COLUMN IF NOT EXISTS addon_ipen BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS addon_ipen_price INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS service_price INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_amount INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN bookings.addon_ipen IS 'Whether iPEN add-on was selected';
COMMENT ON COLUMN bookings.addon_ipen_price IS 'iPEN add-on price in cents (4000 if selected)';
COMMENT ON COLUMN bookings.service_price IS 'Base service price in cents at time of booking';
COMMENT ON COLUMN bookings.total_amount IS 'Total amount in cents (service_price + addon_ipen_price)';

-- Add category column to services table
ALTER TABLE services 
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'notary';

COMMENT ON COLUMN services.category IS 'Service category: notary, tax, or addon';

-- Update existing services with categories
UPDATE services SET category = 'notary' 
  WHERE name IN ('Mobile Notary Service', 'Loan Signing Service') AND is_active = true;

UPDATE services SET category = 'tax' 
  WHERE name IN ('Individual Tax Preparation', 'Business Tax Preparation', 'Corporate Tax Returns', 'Tax Amendment Filing') AND is_active = true;

-- Deactivate services that should be removed
UPDATE services SET is_active = false 
WHERE name IN ('Fingerprinting Services', 'Corporate Tax Returns') AND is_active = true;

-- Update existing services to correct names and prices
UPDATE services SET 
  name = 'Mobile Notary',
  description = 'Professional mobile notary service at your location',
  price_cents = 7500,
  duration_minutes = 45,
  category = 'notary'
WHERE name = 'Mobile Notary Service' AND is_active = true;

UPDATE services SET 
  name = 'Loan Signing',
  description = 'Expert loan document signing and notarization services',
  price_cents = 10000,
  duration_minutes = 60,
  category = 'notary'
WHERE name = 'Loan Signing Service' AND is_active = true;

UPDATE services SET 
  name = 'Individual Taxes',
  description = 'Complete individual tax preparation including all forms and schedules',
  price_cents = 7500,
  duration_minutes = 60,
  category = 'tax'
WHERE name = 'Individual Tax Preparation' AND is_active = true;

UPDATE services SET 
  name = 'Business/Corporation Taxes',
  description = 'Comprehensive tax preparation for businesses, corporations, and LLCs',
  price_cents = 12500,
  duration_minutes = 90,
  category = 'tax'
WHERE name = 'Business Tax Preparation' AND is_active = true;

UPDATE services SET 
  name = 'Amendments/Revision',
  description = 'Professional tax amendment and revision services (Form 1040-X)',
  price_cents = 7500,
  duration_minutes = 45,
  category = 'tax'
WHERE name = 'Tax Amendment Filing' AND is_active = true;

-- Insert new services (only if they don't exist)
INSERT INTO services (name, description, price_cents, duration_minutes, category, is_active)
SELECT 'Remote Online Notarization (RON)', 'Secure remote online notarization from anywhere', 2500, 30, 'notary', true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Remote Online Notarization (RON)');

INSERT INTO services (name, description, price_cents, duration_minutes, category, is_active)
SELECT 'Apostille Services', 'Document apostille certification for international use', 5000, 30, 'notary', true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'Apostille Services');

INSERT INTO services (name, description, price_cents, duration_minutes, category, is_active)
SELECT 'iPEN Add-on', 'In-Person Electronic Notarization with digital certificate', 4000, 0, 'addon', true
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = 'iPEN Add-on');

-- Drop and recreate the get_booking_by_id_and_email function with new fields
DROP FUNCTION IF EXISTS public.get_booking_by_id_and_email(uuid, text);

CREATE FUNCTION public.get_booking_by_id_and_email(
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
  created_at timestamptz,
  service_price integer,
  addon_ipen boolean,
  addon_ipen_price integer,
  total_amount integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;