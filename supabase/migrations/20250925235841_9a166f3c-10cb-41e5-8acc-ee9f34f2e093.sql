-- Fix security vulnerability: Make database policies consistent with edge function approach
-- The create-booking edge function already exists and uses service role for secure PII insertion

-- Drop the existing conflicting policies and create clean, secure ones
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all existing policies on bookings table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'bookings' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.bookings';
    END LOOP;
    
    -- Drop all existing policies on bookings_pii table  
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'bookings_pii' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.bookings_pii';
    END LOOP;
END $$;

-- Create secure policies that work with the edge function approach

-- Bookings table policies: Only allow authenticated users to manage their own bookings
-- Edge functions use service role key to bypass these policies for secure operations
CREATE POLICY "Authenticated users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Authenticated users can update their own bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Authenticated users can delete their own bookings" 
ON public.bookings 
FOR DELETE 
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- No INSERT policy for bookings - all creation must go through edge functions
-- This forces secure booking creation through the create-booking edge function

-- PII table policies: Very restrictive - only allow authenticated users to access their own PII
CREATE POLICY "Authenticated users can view their own PII" 
ON public.bookings_pii 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE id = booking_id AND user_id = auth.uid()
  )
);

-- No INSERT, UPDATE, or DELETE policies for PII - all operations must go through edge functions
-- This ensures PII is only handled by secure edge functions with proper validation

-- Note: The existing get_booking_pii function provides secure token-based access for anonymous users
-- and the create-booking edge function handles all secure booking and PII creation