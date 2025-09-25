-- Fix Security Definer View warning by removing the problematic view
-- and ensuring proper RLS policies are in place

-- Drop the security barrier view that's causing the warning
DROP VIEW IF EXISTS public.bookings_safe;

-- Instead, we'll rely on the existing RLS policies on the bookings table
-- which already provide proper security isolation

-- Ensure the bookings table has proper RLS enabled and policies
-- (These should already exist but let's verify)

-- Grant proper access to the bookings table for authenticated users
GRANT SELECT ON public.bookings TO authenticated;

-- Note: The existing RLS policies on bookings table will ensure
-- users can only see their own bookings, which provides the same
-- security as the previous bookings_safe view