-- Update Tax Preparation service with Stripe price ID
UPDATE public.services 
SET stripe_price_id = 'price_1SEn9pRrvNwFzubMVa4on1We'
WHERE stripe_product_id = 'prod_TB9SmrrfrzEYKL';