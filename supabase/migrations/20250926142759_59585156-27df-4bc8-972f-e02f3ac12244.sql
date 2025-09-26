-- Drop existing policies
DROP POLICY IF EXISTS "Users can view messages for their own bookings" ON public.booking_messages;
DROP POLICY IF EXISTS "Users can insert messages for their own bookings" ON public.booking_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.booking_messages;

-- Create optimized policies with (select auth.uid()) for better performance
CREATE POLICY "Users can view messages for their own bookings" 
ON public.booking_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1
    FROM bookings
    WHERE bookings.id = booking_messages.booking_id 
    AND (bookings.user_id = (select auth.uid()) OR booking_messages.sender_id = (select auth.uid()))
  )
);

CREATE POLICY "Users can insert messages for their own bookings" 
ON public.booking_messages 
FOR INSERT 
WITH CHECK (
  (select auth.uid()) = sender_id 
  AND EXISTS (
    SELECT 1
    FROM bookings
    WHERE bookings.id = booking_messages.booking_id 
    AND bookings.user_id = (select auth.uid())
  )
);

CREATE POLICY "Users can update their own messages" 
ON public.booking_messages 
FOR UPDATE 
USING (sender_id = (select auth.uid()))
WITH CHECK (sender_id = (select auth.uid()));