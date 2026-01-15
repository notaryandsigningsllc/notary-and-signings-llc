-- Update Individual Taxes service price to $85 (8500 cents)
UPDATE public.services 
SET price_cents = 8500, updated_at = now()
WHERE name ILIKE '%individual%tax%';