-- Deactivate duplicate Loan Signing entries (keep the newest one)
UPDATE services 
SET is_active = false 
WHERE name = 'Loan Signing' 
AND id IN (
  '33be59d1-1c0b-414c-b221-dd11073c3ebe',
  '0d992e69-cc42-40df-90eb-778d6edbbea3'
);

-- Deactivate duplicate Amendments/Revision entries (keep the newest one)
UPDATE services 
SET is_active = false 
WHERE name = 'Amendments/Revision' 
AND id IN (
  '55555555-5555-5555-5555-555555555555',
  '44b45298-d04a-4924-bb59-ffbca7f8d569',
  '5abffd11-c202-48a9-ae17-84d62335ee29'
);

-- Deactivate standalone iPEN service (should only be available as add-on)
UPDATE services 
SET is_active = false 
WHERE id = 'a5e3ccae-ebb0-4474-a27a-39ca33f725e5';

-- Fix Apostille Services price from $10 to $50
UPDATE services 
SET price_cents = 5000 
WHERE name = 'Apostille Services' 
AND is_active = true;