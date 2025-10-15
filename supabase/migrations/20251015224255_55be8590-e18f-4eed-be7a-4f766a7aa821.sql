-- Clean up services while preserving those referenced by bookings
-- Step 1: Delete services that are NOT referenced by bookings AND are not in our keep list
DELETE FROM services 
WHERE id NOT IN (
  SELECT DISTINCT service_id FROM bookings
)
AND name NOT IN (
  'Individual Tax Preparation',
  'Business Tax Preparation',
  'Corporate Tax Returns',
  'Tax Amendment Filing',
  'Fingerprinting Services',
  'Apostille Services',
  'Loan Signing Service',
  'Mobile Notary Service',
  'In-Person Electronic Notarization (iPEN)'
);

-- Step 2: For services we want to keep, delete duplicates that are NOT referenced by bookings
-- Individual Tax Preparation - keep id: 11111111-1111-1111-1111-111111111111
DELETE FROM services 
WHERE name = 'Individual Tax Preparation' 
AND id != '11111111-1111-1111-1111-111111111111'
AND id NOT IN (SELECT DISTINCT service_id FROM bookings);

-- Business Tax Preparation - keep id: 22222222-2222-2222-2222-222222222222
DELETE FROM services 
WHERE name = 'Business Tax Preparation' 
AND id != '22222222-2222-2222-2222-222222222222'
AND id NOT IN (SELECT DISTINCT service_id FROM bookings);

-- Corporate Tax Returns - keep id: 33333333-3333-3333-3333-333333333333
DELETE FROM services 
WHERE name = 'Corporate Tax Returns' 
AND id != '33333333-3333-3333-3333-333333333333'
AND id NOT IN (SELECT DISTINCT service_id FROM bookings);

-- Fingerprinting Services - keep id: fd7003e0-cb62-4324-8d1f-f0b90d0132db
DELETE FROM services 
WHERE name = 'Fingerprinting Services' 
AND id != 'fd7003e0-cb62-4324-8d1f-f0b90d0132db'
AND id NOT IN (SELECT DISTINCT service_id FROM bookings);

-- Apostille Services - keep id: 1827e9b8-bc87-46b1-bff6-7272e2e4f575
DELETE FROM services 
WHERE name = 'Apostille Services' 
AND id != '1827e9b8-bc87-46b1-bff6-7272e2e4f575'
AND id NOT IN (SELECT DISTINCT service_id FROM bookings);

-- Loan Signing Service - keep id: 0d992e69-cc42-40df-90eb-778d6edbbea3
DELETE FROM services 
WHERE name = 'Loan Signing Service' 
AND id != '0d992e69-cc42-40df-90eb-778d6edbbea3'
AND id NOT IN (SELECT DISTINCT service_id FROM bookings);

-- Mobile Notary Service - keep id: 97d0b2ca-aec2-462a-b299-a7774cd928d9
DELETE FROM services 
WHERE name = 'Mobile Notary Service' 
AND id != '97d0b2ca-aec2-462a-b299-a7774cd928d9'
AND id NOT IN (SELECT DISTINCT service_id FROM bookings);

-- Mark Remote Online Notarization services as inactive (since they're referenced by bookings)
UPDATE services 
SET is_active = false 
WHERE name = 'Remote Online Notarization';

-- Add Tax Amendment Filing if it doesn't exist
INSERT INTO services (name, description, price_cents, duration_minutes, is_active)
SELECT 
  'Tax Amendment Filing',
  'Professional assistance with filing tax amendments and corrections',
  10000,
  90,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'Tax Amendment Filing'
);

-- Add In-Person Electronic Notarization (iPEN) if it doesn't exist
INSERT INTO services (name, description, price_cents, duration_minutes, is_active)
SELECT 
  'In-Person Electronic Notarization (iPEN)',
  'Electronic notarization performed in person with advanced digital technology',
  2500,
  30,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM services WHERE name = 'In-Person Electronic Notarization (iPEN)'
);