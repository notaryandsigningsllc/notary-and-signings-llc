-- Update Tax Preparation service with Stripe product ID
UPDATE public.services 
SET stripe_product_id = 'prod_TB9SmrrfrzEYKL'
WHERE name LIKE '%Tax Preparation%' OR name LIKE '%Tax%';