import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Webhook received");
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Get webhook signature
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.error("No signature found in webhook request");
      return new Response(
        JSON.stringify({ error: "No signature" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Get raw body for signature verification
    const body = await req.text();
    
    // Verify webhook signature
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }),
        { status: 500, headers: corsHeaders }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log("Webhook signature verified:", event.type);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Processing checkout.session.completed for session:", session.id);

      // Extract booking details from metadata
      const bookingId = session.metadata?.booking_id;
      const customerName = session.metadata?.customer_name;
      const customerEmail = session.metadata?.customer_email;
      const serviceName = session.metadata?.service_name;
      const appointmentDate = session.metadata?.appointment_date;
      const appointmentTime = session.metadata?.appointment_time;

      if (!bookingId) {
        console.error("No booking_id in session metadata");
        return new Response(
          JSON.stringify({ error: "No booking_id in metadata" }),
          { status: 400, headers: corsHeaders }
        );
      }

      console.log("Booking ID from metadata:", bookingId);

      // Initialize Supabase client with service role key
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      // Update booking status to confirmed and payment status to paid
      const { data: bookingUpdate, error: updateError } = await supabaseAdmin
        .from("bookings")
        .update({
          status: "confirmed",
          payment_status: "paid",
          stripe_payment_intent_id: session.payment_intent as string,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating booking:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update booking", details: updateError }),
          { status: 500, headers: corsHeaders }
        );
      }

      console.log("Booking updated successfully:", bookingUpdate);

      // Fetch complete booking details for confirmation email
      const { data: bookingDetails, error: bookingDetailsError } = await supabaseAdmin
        .from('bookings')
        .select('service_price, payment_method, addon_ipen, addon_ipen_price, total_amount')
        .eq('id', bookingId)
        .single();

      if (bookingDetailsError) {
        console.error("Error fetching booking details:", bookingDetailsError);
      }

      // Trigger confirmation email
      try {
        console.log("Attempting to send confirmation email to:", customerEmail);
        
        const { data: emailData, error: emailError } = await supabaseAdmin.functions.invoke(
          "send-booking-confirmation",
          {
            body: {
              bookingId: bookingId,
              customerName: customerName,
              customerEmail: customerEmail,
              serviceName: serviceName,
              appointmentDate: appointmentDate,
              appointmentTime: appointmentTime,
              servicePrice: bookingDetails?.service_price || 0,
              paymentMethod: bookingDetails?.payment_method || 'online',
              ipenAddon: bookingDetails?.addon_ipen || false,
              addonPrice: bookingDetails?.addon_ipen_price || 0,
              totalAmount: bookingDetails?.total_amount || 0
            },
          }
        );

        if (emailError) {
          console.error("Error sending confirmation email:", emailError);
          // Don't fail the webhook if email fails - booking is already confirmed
        } else {
          console.log("Confirmation email sent successfully:", emailData);
        }
      } catch (emailErr) {
        console.error("Exception sending confirmation email:", emailErr);
        // Don't fail the webhook if email fails
      }

      return new Response(
        JSON.stringify({ 
          received: true, 
          bookingId: bookingId,
          status: "confirmed",
          emailSent: true 
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // For other event types, just acknowledge receipt
    console.log("Received webhook event:", event.type);
    return new Response(
      JSON.stringify({ received: true, type: event.type }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
