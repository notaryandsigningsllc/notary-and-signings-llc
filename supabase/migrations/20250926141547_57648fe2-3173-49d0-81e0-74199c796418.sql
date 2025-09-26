-- Create table for booking messages
CREATE TABLE public.booking_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'admin')),
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.booking_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for booking messages
CREATE POLICY "Users can view messages for their own bookings" 
ON public.booking_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_id 
    AND (
      bookings.user_id = auth.uid() OR 
      sender_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can insert messages for their own bookings" 
ON public.booking_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_id 
    AND bookings.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own messages" 
ON public.booking_messages 
FOR UPDATE 
USING (sender_id = auth.uid())
WITH CHECK (sender_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_booking_messages_updated_at
BEFORE UPDATE ON public.booking_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_booking_messages_booking_id ON public.booking_messages(booking_id);
CREATE INDEX idx_booking_messages_created_at ON public.booking_messages(created_at);