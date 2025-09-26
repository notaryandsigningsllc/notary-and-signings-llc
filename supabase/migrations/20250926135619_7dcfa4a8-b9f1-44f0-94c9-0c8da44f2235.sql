-- Fix database performance issues
-- Add index for service_id foreign key and remove unused indexes

-- Remove the unused indexes that were just created
DROP INDEX IF EXISTS public.idx_bookings_user_id;
DROP INDEX IF EXISTS public.idx_bookings_user_date;
DROP INDEX IF EXISTS public.idx_bookings_user_status;

-- Add index for the service_id foreign key to improve query performance
-- This will optimize queries that join bookings with services
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON public.bookings(service_id);