-- Fix remaining database performance issues
-- Remove unused service_id index and add user_id index

-- Remove the unused service_id index
DROP INDEX IF EXISTS public.idx_bookings_service_id;

-- Add index for the user_id foreign key to improve query performance
-- This will optimize queries where users fetch their own bookings
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);