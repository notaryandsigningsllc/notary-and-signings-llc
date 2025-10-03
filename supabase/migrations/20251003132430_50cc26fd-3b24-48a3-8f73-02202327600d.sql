-- Update RON service price to $25
UPDATE public.services 
SET price_cents = 2500,
    updated_at = now()
WHERE name = 'Remote Online Notarization (RON)';