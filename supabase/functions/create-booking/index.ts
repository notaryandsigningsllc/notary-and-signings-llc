import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingData {
  serviceId: string;
  appointmentDate: string;
  appointmentTime: string;
  paymentMethod: string;
  fullName: string;
  email: string;
  phone: string;
  notes?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bookingData: BookingData = await req.json();
    
    // Validate required fields
    if (!bookingData.serviceId || !bookingData.appointmentDate || 
        !bookingData.appointmentTime || !bookingData.fullName || 
        !bookingData.email || !bookingData.phone) {
      throw new Error("Missing required booking information");
    }

    // Create Supabase client with service role for secure operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if user is authenticated
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      userId = data.user?.id || null;
    }

    console.log('Creating booking for user:', userId ? 'authenticated' : 'anonymous');

    // Perform conflict check
    const { data: conflictData, error: conflictError } = await supabaseClient
      .rpc('check_booking_conflict', {
        p_appointment_date: bookingData.appointmentDate,
        p_appointment_time: bookingData.appointmentTime,
        p_duration_minutes: 60, // Default duration, should be fetched from service
        p_booking_id: null
      });

    if (conflictError) {
      throw new Error(`Conflict check failed: ${conflictError.message}`);
    }

    if (conflictData) {
      throw new Error('Time slot is no longer available. Please select a different time.');
    }

    // Create the booking
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .insert({
        service_id: bookingData.serviceId,
        user_id: userId,
        appointment_date: bookingData.appointmentDate,
        appointment_time: bookingData.appointmentTime,
        payment_method: bookingData.paymentMethod,
        status: 'confirmed',
        payment_status: 'pending'
      })
      .select()
      .single();

    if (bookingError) {
      throw new Error(`Failed to create booking: ${bookingError.message}`);
    }

    console.log('Booking created:', booking.id);

    // Insert PII data securely using service role
    const { error: piiError } = await supabaseClient
      .from('bookings_pii')
      .insert({
        booking_id: booking.id,
        full_name: bookingData.fullName.trim(),
        email: bookingData.email.trim().toLowerCase(),
        phone: bookingData.phone.trim(),
        notes: bookingData.notes?.trim() || null
      });

    if (piiError) {
      // If PII insertion fails, clean up the booking
      await supabaseClient.from('bookings').delete().eq('id', booking.id);
      throw new Error(`Failed to store booking information: ${piiError.message}`);
    }

    console.log('PII data stored for booking:', booking.id);

    return new Response(JSON.stringify({ 
      success: true,
      bookingId: booking.id,
      bookingToken: booking.booking_token
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error creating booking:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error occurred' 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});