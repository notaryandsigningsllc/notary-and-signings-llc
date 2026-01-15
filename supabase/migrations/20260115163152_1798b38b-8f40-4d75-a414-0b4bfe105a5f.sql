-- Update Mobile Notary to General Notary with new in-office pricing
UPDATE public.services 
SET 
  name = 'General Notary',
  description = 'Professional in-office notary services at our Perth Amboy location.',
  price_cents = 2500,
  duration_minutes = 30,
  updated_at = now()
WHERE id = '97d0b2ca-aec2-462a-b299-a7774cd928d9';