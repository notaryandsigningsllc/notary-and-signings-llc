-- Fix database performance issues
-- Remove unused index and add proper foreign key index

-- Drop the unused index on service_id (not being used)
DROP INDEX IF EXISTS public.idx_bookings_service_id;

-- Create index for the user_id foreign key to improve query performance
-- This will optimize queries where users fetch their own bookings
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);

-- Also create a composite index for common query patterns
-- This will help with queries filtering by user and date/status
CREATE INDEX IF NOT EXISTS idx_bookings_user_date ON public.bookings(user_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON public.bookings(user_id, status);