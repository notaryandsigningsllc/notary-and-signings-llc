-- Fix security issues: Restrict blocked_dates and services access

-- 1. Fix blocked_dates - require authentication to prevent competitors from seeing downtime
DROP POLICY IF EXISTS "Blocked dates are viewable by everyone" ON public.blocked_dates;

CREATE POLICY "Blocked dates require authentication" 
ON public.blocked_dates 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 2. Fix services access - restrict full service details to admin users only
-- Drop the current policy that allows any authenticated user full access
DROP POLICY IF EXISTS "Authenticated users can view all service details" ON public.services;

-- Create admin-only policy for full service access (you can modify this based on your admin identification method)
-- For now, this restricts to users with specific email domains or you can add a role column later
CREATE POLICY "Admin users can view all service details" 
ON public.services 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    -- Add your admin email or implement role-based access
    -- Example: auth.email() = 'admin@yourdomain.com'
    -- For now, let's use a more restrictive approach - only service creators
    -- You should replace this with proper admin role checking
    false  -- Temporarily disable until proper admin roles are implemented
  )
);

-- Note: Regular users should use the get_public_services() function for safe access to service information
-- Edge functions can access services table directly with service role key when needed for payments