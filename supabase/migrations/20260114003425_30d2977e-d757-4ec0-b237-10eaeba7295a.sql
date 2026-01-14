-- =============================================
-- FIX RLS PERFORMANCE: Use (select auth.uid()) pattern
-- =============================================

-- blocked_dates: Fix admin policy
DROP POLICY IF EXISTS "Admins can manage blocked dates" ON public.blocked_dates;
CREATE POLICY "Admins can manage blocked dates" ON public.blocked_dates
FOR ALL TO authenticated
USING (public.has_role((select auth.uid()), 'admin'::app_role))
WITH CHECK (public.has_role((select auth.uid()), 'admin'::app_role));

-- booking_messages: Fix all policies
DROP POLICY IF EXISTS "Users can view their own booking messages" ON public.booking_messages;
CREATE POLICY "Users can view their own booking messages" ON public.booking_messages
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM bookings
  WHERE bookings.id = booking_messages.booking_id 
  AND (bookings.user_id = (select auth.uid()) OR public.has_role((select auth.uid()), 'admin'::app_role))
));

DROP POLICY IF EXISTS "Users can create messages for their bookings" ON public.booking_messages;
DROP POLICY IF EXISTS "Admins can create messages for any booking" ON public.booking_messages;
-- Consolidate INSERT policies into one
CREATE POLICY "Authenticated users can create booking messages" ON public.booking_messages
FOR INSERT TO authenticated
WITH CHECK (
  public.has_role((select auth.uid()), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = booking_messages.booking_id 
    AND bookings.user_id = (select auth.uid())
  )
);

-- bookings: Consolidate SELECT policies
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
CREATE POLICY "Authenticated users can view relevant bookings" ON public.bookings
FOR SELECT TO authenticated
USING (
  user_id = (select auth.uid()) 
  OR public.has_role((select auth.uid()), 'admin'::app_role)
);

-- bookings_pii: Consolidate and fix policies
DROP POLICY IF EXISTS "Admins can view all booking PII" ON public.bookings_pii;
DROP POLICY IF EXISTS "Users can view their own booking PII" ON public.bookings_pii;
CREATE POLICY "Authenticated users can view relevant booking PII" ON public.bookings_pii
FOR SELECT TO authenticated
USING (
  public.has_role((select auth.uid()), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = bookings_pii.booking_id 
    AND bookings.user_id = (select auth.uid())
  )
);

DROP POLICY IF EXISTS "Admins can update booking PII" ON public.bookings_pii;
CREATE POLICY "Admins can update booking PII" ON public.bookings_pii
FOR UPDATE TO authenticated
USING (public.has_role((select auth.uid()), 'admin'::app_role))
WITH CHECK (public.has_role((select auth.uid()), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete booking PII" ON public.bookings_pii;
CREATE POLICY "Admins can delete booking PII" ON public.bookings_pii
FOR DELETE TO authenticated
USING (public.has_role((select auth.uid()), 'admin'::app_role));

-- business_hours: Consolidate SELECT policies (remove redundant one)
DROP POLICY IF EXISTS "Admins can manage business hours" ON public.business_hours;
DROP POLICY IF EXISTS "Admins can view all business hours" ON public.business_hours;
CREATE POLICY "Admins can manage business hours" ON public.business_hours
FOR ALL TO authenticated
USING (public.has_role((select auth.uid()), 'admin'::app_role))
WITH CHECK (public.has_role((select auth.uid()), 'admin'::app_role));

-- follow_up_emails: Fix admin policy
DROP POLICY IF EXISTS "Admins can view follow-up emails" ON public.follow_up_emails;
CREATE POLICY "Admins can view follow-up emails" ON public.follow_up_emails
FOR SELECT TO authenticated
USING (public.has_role((select auth.uid()), 'admin'::app_role));

-- news_feed: Consolidate policies
DROP POLICY IF EXISTS "Admins can manage news feed" ON public.news_feed;
DROP POLICY IF EXISTS "Anyone can view news feed" ON public.news_feed;
CREATE POLICY "Anyone can view news feed" ON public.news_feed
FOR SELECT USING (true);
CREATE POLICY "Admins can manage news feed" ON public.news_feed
FOR ALL TO authenticated
USING (public.has_role((select auth.uid()), 'admin'::app_role))
WITH CHECK (public.has_role((select auth.uid()), 'admin'::app_role));

-- services: Fix policies
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
DROP POLICY IF EXISTS "Anyone can view active add-on services" ON public.services;
CREATE POLICY "Anyone can view active add-on services" ON public.services
FOR SELECT USING (is_active = true AND category = 'addon');
CREATE POLICY "Admins can manage services" ON public.services
FOR ALL TO authenticated
USING (public.has_role((select auth.uid()), 'admin'::app_role))
WITH CHECK (public.has_role((select auth.uid()), 'admin'::app_role));

-- user_roles: Consolidate SELECT policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Authenticated users can view relevant roles" ON public.user_roles
FOR SELECT TO authenticated
USING (
  user_id = (select auth.uid()) 
  OR public.has_role((select auth.uid()), 'admin'::app_role)
);
CREATE POLICY "Admins can manage all roles" ON public.user_roles
FOR ALL TO authenticated
USING (public.has_role((select auth.uid()), 'admin'::app_role))
WITH CHECK (public.has_role((select auth.uid()), 'admin'::app_role));