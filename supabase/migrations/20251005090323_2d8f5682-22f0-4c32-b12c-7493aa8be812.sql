-- Update Loan Signings with price ID
UPDATE public.services 
SET stripe_price_id = 'price_1SBJw1RrvNwFzubMTbtyixas'
WHERE stripe_product_id = 'prod_T7Z4dPx53hr3PG';

-- Update Remote Online Notarization with Stripe IDs
UPDATE public.services 
SET stripe_product_id = 'prod_T7Z3WOxcdaDsWA',
    stripe_price_id = 'price_1SBJvpRrvNwFzubMla6IdQzf'
WHERE name = 'Remote Online Notarization';

-- Update Apostille Services with Stripe IDs
UPDATE public.services 
SET stripe_product_id = 'prod_T7Z4LDOJhLbwiw',
    stripe_price_id = 'price_1SBJwPRrvNwFzubMxF0tyxY1'
WHERE name = 'Apostille Services';

-- Update Fingerprinting Services with Stripe IDs
UPDATE public.services 
SET stripe_product_id = 'prod_T7Z4Dpjp8sIX0M',
    stripe_price_id = 'price_1SBJwjRrvNwFzubMEjbfdjM4'
WHERE name = 'Fingerprinting Services';