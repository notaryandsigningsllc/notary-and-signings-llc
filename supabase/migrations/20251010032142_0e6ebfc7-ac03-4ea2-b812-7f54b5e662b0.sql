-- Add RLS policies for tables without them

-- 1. blocked_dates: Admin-only read/write, public read via RPC
CREATE POLICY "Admins can manage blocked dates"
ON public.blocked_dates
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. booking_messages: Users can read/write their own booking messages, admins can read all
CREATE POLICY "Users can view their own booking messages"
ON public.booking_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE id = booking_messages.booking_id
    AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);

CREATE POLICY "Users can create messages for their bookings"
ON public.booking_messages
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE id = booking_messages.booking_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Admins can create messages for any booking"
ON public.booking_messages
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. business_hours: Public read (via RPC already exists), admin write
CREATE POLICY "Admins can manage business hours"
ON public.business_hours
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. follow_up_emails: Admin-only
CREATE POLICY "Admins can view follow-up emails"
ON public.follow_up_emails
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can create follow-up emails"
ON public.follow_up_emails
FOR INSERT
WITH CHECK (true);

-- 5. news_feed: Public read, admin write
CREATE POLICY "Anyone can view news feed"
ON public.news_feed
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage news feed"
ON public.news_feed
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. services: Public read via RPC (already exists), admin write
CREATE POLICY "Admins can manage services"
ON public.services
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. user_roles: Users can read their own roles, admins can read all, admins can write
-- Remove the existing policies first
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Recreate with proper restrictions
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));