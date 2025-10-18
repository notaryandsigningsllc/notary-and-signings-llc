import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { isValidEmail, sanitizeString } from "../_shared/validation.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WIX_API_URL = "https://www.wixapis.com/contacts/v4/contacts";

interface WixSyncRequest {
  email: string;
  name?: string;
  source?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const requestData: WixSyncRequest = await req.json();

    // Validate inputs
    const errors: string[] = [];
    if (!requestData.email || !isValidEmail(requestData.email)) {
      errors.push('Invalid email address');
    }
    if (requestData.name && requestData.name.trim().length > 100) {
      errors.push('Name must be less than 100 characters');
    }
    if (requestData.source && requestData.source.trim().length > 50) {
      errors.push('Source must be less than 50 characters');
    }

    if (errors.length > 0) {
      return new Response(JSON.stringify({ 
        error: 'Validation failed', 
        details: errors 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Sanitize inputs
    const email = sanitizeString(requestData.email.toLowerCase().trim(), 255);
    const name = requestData.name ? sanitizeString(requestData.name.trim(), 100) : "";
    const source = requestData.source ? sanitizeString(requestData.source.trim(), 50) : "Website";

    console.log("Syncing to Wix:", { email, name, source });

    // Check if WIX_API_KEY is configured
    const wixApiKey = Deno.env.get("WIX_API_KEY");
    if (!wixApiKey) {
      console.error("WIX_API_KEY not configured");
      return new Response(JSON.stringify({ 
        error: 'Wix API key not configured. Please add WIX_API_KEY to Supabase secrets.' 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Prepare contact data for Wix
    const contactData: any = {
      contact: {
        emails: [{
          email: email,
          tag: "MAIN"
        }],
        labels: ["Newsletter Subscriber", source],
      }
    };

    // Add name if provided
    if (name) {
      contactData.contact.name = {
        first: name,
      };
    }

    // Sync to Wix Contacts API
    const wixResponse = await fetch(WIX_API_URL, {
      method: "POST",
      headers: {
        "Authorization": wixApiKey,
        "Content-Type": "application/json",
        "wix-site-id": Deno.env.get("WIX_SITE_ID") || "",
      },
      body: JSON.stringify(contactData),
    });

    const responseText = await wixResponse.text();
    
    if (!wixResponse.ok) {
      console.error("Wix API error:", {
        status: wixResponse.status,
        statusText: wixResponse.statusText,
        body: responseText
      });
      
      throw new Error(`Wix API error: ${wixResponse.status} - ${responseText}`);
    }

    let wixData;
    try {
      wixData = JSON.parse(responseText);
    } catch (e) {
      wixData = { rawResponse: responseText };
    }

    console.log("Successfully synced to Wix:", wixData);

    // Log successful sync to database (optional tracking)
    try {
      await supabaseClient
        .from('newsletter_subscriptions')
        .update({ 
          source: `${source} (Synced to Wix)` 
        })
        .eq('email', email)
        .is('source', null);
    } catch (dbError) {
      console.log("Note: Could not update newsletter source in database:", dbError);
      // Don't fail the request if this optional tracking fails
    }

    return new Response(JSON.stringify({ 
      success: true,
      wixContactId: wixData?.contact?.id || null,
      message: "Contact successfully synced to Wix"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Error syncing to Wix:", error);
    
    // Don't expose internal error details to client
    const userMessage = error.message?.includes("Wix API") 
      ? "Failed to sync with Wix. Please try again later."
      : "An error occurred while processing your request.";

    return new Response(JSON.stringify({ 
      error: userMessage,
      details: error.message // Include for debugging, remove in production if needed
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
