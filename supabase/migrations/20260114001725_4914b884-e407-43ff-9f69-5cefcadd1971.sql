-- Add SELECT policy for admins on business_hours table
CREATE POLICY "Admins can view all business hours"
ON public.business_hours
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));