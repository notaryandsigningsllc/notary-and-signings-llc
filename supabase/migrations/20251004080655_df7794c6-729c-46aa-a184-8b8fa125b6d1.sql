-- Update services with Stripe product and price IDs
-- Mobile Notary Service: $75.00
UPDATE public.services 
SET stripe_product_id = 'prod_T7Z3a8wFxNPS5p',
    stripe_price_id = 'price_1SBJvdRrvNwFzubMgSXnSLXU',
    price_cents = 7500,
    updated_at = now()
WHERE name LIKE '%Mobile%';

-- Remote Online Notarization (RON): $35.00
UPDATE public.services 
SET stripe_product_id = 'prod_T7Z3WOxcdaDsWA',
    stripe_price_id = 'price_1SBJvpRrvNwFzubMla6IdQzf',
    price_cents = 3500,
    updated_at = now()
WHERE name LIKE '%Remote%' OR name LIKE '%RON%';

-- Loan Signing Service: $100.00
UPDATE public.services 
SET stripe_product_id = 'prod_T7Z4dPx53hr3PG',
    stripe_price_id = 'price_1SBJw1RrvNwFzubMTbtyixas',
    price_cents = 10000,
    updated_at = now()
WHERE name LIKE '%Loan%';

-- Apostille Service: $50.00
UPDATE public.services 
SET stripe_product_id = 'prod_T7Z4LDOJhLbwiw',
    stripe_price_id = 'price_1SBJwPRrvNwFzubMxF0tyxY1',
    price_cents = 5000,
    updated_at = now()
WHERE name LIKE '%Apostille%';

-- Fingerprinting Service: $20.00
UPDATE public.services 
SET stripe_product_id = 'prod_T7Z4Dpjp8sIX0M',
    stripe_price_id = 'price_1SBJwjRrvNwFzubMEjbfdjM4',
    price_cents = 2000,
    updated_at = now()
WHERE name LIKE '%Fingerprint%';