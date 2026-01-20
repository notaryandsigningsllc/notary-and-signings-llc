import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { isValidUUID } from "../_shared/validation.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { sessionId, bookingId, bookingToken } = await req.json();
    
    if (!sessionId || !bookingId || !isValidUUID(bookingId)) {
      return new Response(JSON.stringify({ error: "Valid session ID and booking ID are required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Require booking token for verification (security measure)
    if (!bookingToken || !isValidUUID(bookingToken)) {
      return new Response(JSON.stringify({ error: "Valid booking token is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log('Verifying payment for session:', sessionId, 'booking:', bookingId);

    // First verify the booking token matches
    const { data: booking, error: bookingCheckError } = await supabaseClient
      .from('bookings')
      .select('id, booking_token')
      .eq('id', bookingId)
      .eq('booking_token', bookingToken)
      .maybeSingle();

    if (bookingCheckError || !booking) {
      console.error('Booking not found or token mismatch for:', bookingId);
      return new Response(JSON.stringify({ error: "Booking not found or unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Session payment status:', session.payment_status);

    // Update booking based on payment status
    let updateData: any = {
      stripe_session_id: sessionId,
    };

    if (session.payment_status === 'paid') {
      updateData.payment_status = 'paid';
      updateData.stripe_payment_intent_id = session.payment_intent;
    } else {
      updateData.payment_status = 'failed';
    }

    const { error: updateError } = await supabaseClient
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId);

    if (updateError) {
      throw new Error(`Failed to update booking: ${updateError.message}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      paymentStatus: session.payment_status,
      bookingId: bookingId
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Unknown error' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});