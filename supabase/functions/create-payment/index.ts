import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { isValidUUID } from "../_shared/validation.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client using the service role key for admin access
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { bookingId } = await req.json();
    
    if (!bookingId || !isValidUUID(bookingId)) {
      return new Response(JSON.stringify({ error: "Valid booking ID is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log('Processing payment for booking:', bookingId);

    // Get booking details and service stripe info using admin access
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select(`
        *,
        services!inner (
          name,
          price_cents,
          stripe_price_id,
          stripe_product_id
        )
      `)
      .eq('id', bookingId)
      .maybeSingle();

    if (bookingError || !booking) {
      throw new Error('Booking not found');
    }

    // Get PII data directly using service role key
    const { data: piiData, error: piiError } = await supabaseClient
      .from('bookings_pii')
      .select('email, full_name, phone')
      .eq('booking_id', bookingId)
      .maybeSingle();

    if (piiError || !piiData) {
      throw new Error('Booking information not found');
    }

    console.log('Found booking and PII data');

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Ensure Stripe product/price exists for the service
    let priceId = booking.services.stripe_price_id as string | null;
    let productId = booking.services.stripe_product_id as string | null;

    if (!priceId) {
      console.log('No stripe_price_id found for service, creating product and price in Stripe');
      if (!productId) {
        const product = await stripe.products.create({
          name: booking.services.name,
          active: true,
        });
        productId = product.id;
        console.log('Created Stripe product:', productId);

        // Save product ID to service
        const { error: updateProductErr } = await supabaseClient
          .from('services')
          .update({ stripe_product_id: productId })
          .eq('id', booking.service_id);
        if (updateProductErr) {
          console.warn('Failed to persist stripe_product_id:', updateProductErr);
        }
      }

      const price = await stripe.prices.create({
        currency: 'usd',
        unit_amount: booking.services.price_cents,
        product: productId!,
      });
      priceId = price.id;
      console.log('Created Stripe price:', priceId);

      // Save price ID to service
      const { error: updatePriceErr } = await supabaseClient
        .from('services')
        .update({ stripe_price_id: priceId })
        .eq('id', booking.service_id);
      if (updatePriceErr) {
        console.warn('Failed to persist stripe_price_id:', updatePriceErr);
      }
    }

    // Check if a Stripe customer record exists for this email
    const customers = await stripe.customers.list({ 
      email: piiData.email, 
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log('Found existing customer:', customerId);
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: piiData.email,
        name: piiData.full_name,
        phone: piiData.phone,
      });
      customerId = customer.id;
      console.log('Created new customer:', customerId);
    }

    // Create a one-time payment session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId!,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/booking-success?session_id={CHECKOUT_SESSION_ID}&token=${booking.booking_token}`,
      cancel_url: `${req.headers.get("origin")}/book-appointment?booking_id=${bookingId}`,
      metadata: {
        booking_id: bookingId,
        service_name: booking.services.name
      }
    });

    console.log('Created checkout session:', session.id);

    // Update booking with session ID
    await supabaseClient
      .from('bookings')
      .update({
        stripe_session_id: session.id,
        payment_status: 'pending'
      })
      .eq('id', bookingId);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error('Error creating payment:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Unknown error' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});