-- Update Mobile Notary service with Stripe IDs
UPDATE public.services 
SET stripe_product_id = 'prod_T7Z3a8wFxNPS5p',
    stripe_price_id = 'price_1SBJvdRrvNwFzubMgSXnSLXU'
WHERE name = 'Mobile Notary';

-- Update Loan Signings service with Stripe product ID
UPDATE public.services 
SET stripe_product_id = 'prod_T7Z4dPx53hr3PG'
WHERE name = 'Loan Signing';