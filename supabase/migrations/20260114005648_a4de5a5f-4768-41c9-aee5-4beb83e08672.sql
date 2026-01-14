-- Fix newsletter_subscriptions: Add admin-only SELECT policy
CREATE POLICY "Admins can view newsletter subscriptions"
ON public.newsletter_subscriptions
FOR SELECT
TO authenticated
USING (public.has_role((SELECT auth.uid()), 'admin'::app_role));

-- Fix business_hours: Add public SELECT policy for booking flow
-- (The get_public_business_hours() function already provides this, but direct table access is needed too)
CREATE POLICY "Anyone can view business hours"
ON public.business_hours
FOR SELECT
USING (true);