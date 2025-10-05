import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { validateFollowUpData, sanitizeString } from "../_shared/validation.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FollowUpRequest {
  bookingId: string;
  emailType: 'review_request' | 'service_upsell' | 'newsletter_invite';
  recipientEmail: string;
  recipientName: string;
  serviceName?: string;
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getEmailContent = (emailType: string, name: string, serviceName?: string) => {
  switch (emailType) {
    case 'review_request':
      return {
        subject: 'How was your experience with Notary and Signings?',
        html: `
          <h1>Thank you for choosing Notary and Signings LLC!</h1>
          <p>Hi ${name},</p>
          <p>We hope your recent ${serviceName || 'notary service'} appointment went smoothly!</p>
          <p>Your feedback helps us improve our services. Would you take a moment to share your experience?</p>
          <p><a href="https://notaryandsignings.com/contact" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Leave a Review</a></p>
          <p>Thank you for your trust in our services!</p>
          <p>Best regards,<br>Notary and Signings LLC Team</p>
        `
      };
    case 'service_upsell':
      return {
        subject: 'Discover More Services from Notary and Signings',
        html: `
          <h1>More Ways We Can Help You</h1>
          <p>Hi ${name},</p>
          <p>Thank you for using our ${serviceName || 'notary service'}!</p>
          <p>Did you know we also offer:</p>
          <ul>
            <li><strong>Remote Online Notarization (RON)</strong> - Get documents notarized from anywhere</li>
            <li><strong>Tax Preparation Services</strong> - Professional tax filing assistance</li>
            <li><strong>Apostille Services</strong> - International document authentication</li>
            <li><strong>Fingerprinting</strong> - Quick and professional fingerprinting</li>
          </ul>
          <p><a href="https://notaryandsignings.com/services" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View All Services</a></p>
          <p>Best regards,<br>Notary and Signings LLC Team</p>
        `
      };
    case 'newsletter_invite':
      return {
        subject: 'Stay Connected with Notary and Signings',
        html: `
          <h1>Join Our Newsletter</h1>
          <p>Hi ${name},</p>
          <p>We're glad we could serve you with our ${serviceName || 'notary services'}!</p>
          <p>Stay informed about:</p>
          <ul>
            <li>New services and updates</li>
            <li>Special promotions and discounts</li>
            <li>Important legal document tips</li>
            <li>Notary industry news</li>
          </ul>
          <p><a href="https://notaryandsignings.com/" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Subscribe to Newsletter</a></p>
          <p>Best regards,<br>Notary and Signings LLC Team</p>
        `
      };
    default:
      return {
        subject: 'Follow up from Notary and Signings',
        html: `<p>Hi ${name},</p><p>Thank you for choosing our services!</p>`
      };
  }
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
    const followUpData: FollowUpRequest = await req.json();
    
    // Validate input data
    const validationErrors = validateFollowUpData(followUpData);
    if (validationErrors.length > 0) {
      return new Response(JSON.stringify({ 
        error: 'Validation failed',
        details: validationErrors
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Sanitize inputs
    const bookingId = followUpData.bookingId;
    const emailType = followUpData.emailType;
    const recipientEmail = sanitizeString(followUpData.recipientEmail.toLowerCase(), 255);
    const recipientName = sanitizeString(followUpData.recipientName, 100);
    const serviceName = followUpData.serviceName ? sanitizeString(followUpData.serviceName, 200) : undefined;

    console.log('Sending follow-up email:', { bookingId, emailType, recipientEmail });

    const emailContent = getEmailContent(emailType, recipientName, serviceName);

    const emailResponse = await resend.emails.send({
      from: "Notary and Signings <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("Follow-up email sent successfully:", emailResponse);

    // Track the email in the database
    const { error: trackError } = await supabaseClient
      .from('follow_up_emails')
      .insert({
        booking_id: bookingId,
        email_type: emailType,
        recipient_email: recipientEmail,
        status: 'sent'
      });

    if (trackError) {
      console.error('Failed to track follow-up email:', trackError);
    }

    return new Response(JSON.stringify({ 
      success: true,
      emailId: emailResponse.id 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-follow-up function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
