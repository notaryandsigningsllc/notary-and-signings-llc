-- Fix newsletter_subscriptions: Add explicit deny for anonymous SELECT
CREATE POLICY "Deny anonymous newsletter access"
ON public.newsletter_subscriptions
FOR SELECT
USING (false);

-- Fix contact_submissions: The INSERT policy is fine (allows form submissions)
-- But we need to ensure anonymous users can't read submissions
CREATE POLICY "Deny anonymous contact submissions access"
ON public.contact_submissions
FOR SELECT
USING (false);

-- Note: bookings_pii INSERT policy is needed for the booking system to work
-- The "Deny anonymous PII access" SELECT policy already exists with USING (false)
-- The INSERT policy with true is correct because bookings are created via edge functions
-- with service role, not by anonymous users directly