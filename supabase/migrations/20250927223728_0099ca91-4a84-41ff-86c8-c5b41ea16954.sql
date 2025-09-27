-- Update Remote Online Notarization price to $50
UPDATE public.services 
SET price_cents = 5000 
WHERE name = 'Remote Online Notarization (RON)';

-- Update Fingerprinting service to be inactive (not available yet)
UPDATE public.services 
SET is_active = false 
WHERE name = 'Fingerprinting Service';