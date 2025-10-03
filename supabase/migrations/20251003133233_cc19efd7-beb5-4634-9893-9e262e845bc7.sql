-- Update Apostille service duration to 30 minutes
UPDATE public.services 
SET duration_minutes = 30,
    updated_at = now()
WHERE name LIKE '%Apostille%' OR name LIKE '%apostille%';