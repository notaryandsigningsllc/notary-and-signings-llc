-- Fix contact_submissions: The SELECT policy was already added in previous migration
-- But scanner still shows it, let's verify it exists and add if not
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'contact_submissions' 
    AND policyname = 'Admins can view contact submissions'
  ) THEN
    CREATE POLICY "Admins can view contact submissions"
    ON public.contact_submissions
    FOR SELECT
    TO authenticated
    USING (public.has_role((SELECT auth.uid()), 'admin'::app_role));
  END IF;
END $$;

-- Fix bookings: Add UPDATE and DELETE policies for admins only
-- Bookings should only be modified by admins, not by regular users
CREATE POLICY "Admins can update bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (public.has_role((SELECT auth.uid()), 'admin'::app_role))
WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE POLICY "Admins can delete bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (public.has_role((SELECT auth.uid()), 'admin'::app_role));