-- Fix unindexed foreign key performance issue
-- Add index on service_id column in bookings table for better query performance

CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON public.bookings (service_id);