-- Add RLS policy to allow anyone to view active add-on services
CREATE POLICY "Anyone can view active add-on services"
ON public.services
FOR SELECT
TO anon, authenticated
USING (is_active = true AND category = 'addon');