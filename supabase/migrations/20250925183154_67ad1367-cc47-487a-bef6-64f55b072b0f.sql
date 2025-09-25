-- Create services table to store available services
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  stripe_price_id TEXT NOT NULL UNIQUE,
  stripe_product_id TEXT NOT NULL UNIQUE,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the services we created in Stripe
INSERT INTO public.services (name, description, price_cents, stripe_price_id, stripe_product_id, duration_minutes) VALUES
('Mobile Notary Service', 'Professional mobile notary service at your location', 7500, 'price_1SBJvdRrvNwFzubMgSXnSLXU', 'prod_T7Z3a8wFxNPS5p', 60),
('Remote Online Notarization (RON)', 'Secure online notarization from anywhere', 3500, 'price_1SBJvpRrvNwFzubMla6IdQzf', 'prod_T7Z3WOxcdaDsWA', 30),
('Loan Signing Service', 'Professional loan signing services for real estate transactions', 10000, 'price_1SBJw1RrvNwFzubMTbtyixas', 'prod_T7Z4dPx53hr3PG', 90),
('Apostille Service', 'Document authentication for international use', 5000, 'price_1SBJwPRrvNwFzubMxF0tyxY1', 'prod_T7Z4LDOJhLbwiw', 45),
('Fingerprinting Service', 'Professional fingerprinting for background checks and licensing', 2000, 'price_1SBJwjRrvNwFzubMEjbfdjM4', 'prod_T7Z4Dpjp8sIX0M', 30);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id),
  user_id UUID REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  appointment_end_time TIME NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('online', 'at_appointment')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create business hours table
CREATE TABLE public.business_hours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default business hours (Monday-Sunday, 8AM-8PM)
INSERT INTO public.business_hours (day_of_week, start_time, end_time) VALUES
(1, '08:00:00', '20:00:00'), -- Monday
(2, '08:00:00', '20:00:00'), -- Tuesday
(3, '08:00:00', '20:00:00'), -- Wednesday
(4, '08:00:00', '20:00:00'), -- Thursday
(5, '08:00:00', '20:00:00'), -- Friday
(6, '08:00:00', '20:00:00'), -- Saturday
(0, '08:00:00', '20:00:00'); -- Sunday

-- Create blocked dates table for holidays or unavailable dates
CREATE TABLE public.blocked_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blocked_date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services (public read access)
CREATE POLICY "Services are viewable by everyone" 
ON public.services 
FOR SELECT 
USING (is_active = true);

-- RLS Policies for bookings (users can view/manage their own bookings)
CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for business hours (public read access)
CREATE POLICY "Business hours are viewable by everyone" 
ON public.business_hours 
FOR SELECT 
USING (is_available = true);

-- RLS Policies for blocked dates (public read access)
CREATE POLICY "Blocked dates are viewable by everyone" 
ON public.blocked_dates 
FOR SELECT 
USING (true);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check for booking conflicts with 30-minute buffer
CREATE OR REPLACE FUNCTION public.check_booking_conflict(
  p_appointment_date DATE,
  p_appointment_time TIME,
  p_duration_minutes INTEGER,
  p_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  start_time TIME := p_appointment_time;
  end_time TIME := p_appointment_time + (p_duration_minutes || ' minutes')::INTERVAL;
  buffer_start TIME := start_time - INTERVAL '30 minutes';
  buffer_end TIME := end_time + INTERVAL '30 minutes';
  conflict_count INTEGER;
BEGIN
  -- Check for overlapping appointments with buffer
  SELECT COUNT(*)
  INTO conflict_count
  FROM public.bookings b
  JOIN public.services s ON b.service_id = s.id
  WHERE b.appointment_date = p_appointment_date
    AND b.status = 'confirmed'
    AND (p_booking_id IS NULL OR b.id != p_booking_id)
    AND (
      -- Existing appointment overlaps with new appointment + buffer
      (b.appointment_time < buffer_end AND b.appointment_end_time > buffer_start)
    );
  
  RETURN conflict_count > 0;
END;
$$;

-- Function to calculate end time based on service duration
CREATE OR REPLACE FUNCTION public.calculate_appointment_end_time()
RETURNS TRIGGER AS $$
DECLARE
  service_duration INTEGER;
BEGIN
  -- Get service duration
  SELECT duration_minutes 
  INTO service_duration 
  FROM public.services 
  WHERE id = NEW.service_id;
  
  -- Calculate end time
  NEW.appointment_end_time := NEW.appointment_time + (service_duration || ' minutes')::INTERVAL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to auto-calculate end time
CREATE TRIGGER calculate_booking_end_time
  BEFORE INSERT OR UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_appointment_end_time();