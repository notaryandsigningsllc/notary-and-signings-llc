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

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const { serviceId } = await req.json();
    
    if (!serviceId) {
      throw new Error("Service ID is required");
    }

    console.log('Creating product checkout for service:', serviceId);

    // Get service details using the public function
    const { data: services, error: serviceError } = await supabaseClient
      .rpc('get_booking_services');

    if (serviceError) {
      throw new Error('Failed to fetch services');
    }

    const service = services?.find((s: any) => s.id === serviceId);
    
    if (!service) {
      throw new Error('Service not found');
    }

    // Get admin service details (with Stripe IDs) using service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: adminServices, error: adminError } = await supabaseAdmin
      .rpc('get_admin_services');

    if (adminError) {
      throw new Error('Failed to fetch service details');
    }

    const adminService = adminServices?.find((s: any) => s.id === serviceId);
    
    if (!adminService || !adminService.stripe_price_id) {
      throw new Error('Service does not have a valid Stripe price configured');
    }

    console.log('Found service with Stripe price:', adminService.stripe_price_id);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Get authenticated user if available
    const authHeader = req.headers.get("Authorization");
    let userEmail = undefined;
    let customerId = undefined;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabaseClient.auth.getUser(token);
      
      if (userData?.user?.email) {
        userEmail = userData.user.email;
        
        // Check if customer exists
        const customers = await stripe.customers.list({ 
          email: userEmail, 
          limit: 1 
        });
        
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
          console.log('Found existing customer:', customerId);
        }
      }
    }

    // Create a one-time payment session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price: adminService.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/services`,
      metadata: {
        service_id: serviceId,
        service_name: service.name
      }
    });

    console.log('Created checkout session:', session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error('Error creating product checkout:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Unknown error' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
