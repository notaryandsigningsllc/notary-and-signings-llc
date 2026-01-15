-- Update existing weekday hours to 9AM-9PM (21:00)
UPDATE public.business_hours 
SET start_time = '09:00:00', end_time = '21:00:00'
WHERE day_of_week IN (1, 2, 3, 4, 5);

-- Add Saturday (day 6) if not exists
INSERT INTO public.business_hours (day_of_week, start_time, end_time, is_available)
VALUES (6, '09:00:00', '21:00:00', true)
ON CONFLICT DO NOTHING;

-- Add Sunday (day 0) if not exists  
INSERT INTO public.business_hours (day_of_week, start_time, end_time, is_available)
VALUES (0, '09:00:00', '21:00:00', true)
ON CONFLICT DO NOTHING;