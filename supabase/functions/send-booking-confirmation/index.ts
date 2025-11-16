import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { isValidEmail, isValidUUID } from "../_shared/validation.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const FRONTEND_URL = Deno.env.get("FRONTEND_URL") || "https://notaryandsignings.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  servicePrice: number;
  paymentMethod: string;
  ipenAddon?: boolean;
  addonPrice?: number;
  totalAmount?: number;
}

const formatPrice = (cents: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(cents / 100);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? ""
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: BookingConfirmationRequest = await req.json();

    // Validate inputs
    if (!body.bookingId || !isValidUUID(body.bookingId)) {
      return new Response(JSON.stringify({ error: "Valid booking ID is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    if (!body.customerEmail || !isValidEmail(body.customerEmail)) {
      return new Response(JSON.stringify({ error: "Valid email is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const sanitizeData = (str: string, maxLength: number = 200): string => {
      return str.replace(/[<>]/g, '').substring(0, maxLength);
    };

    const isPaid = body.paymentMethod === 'online';
    const serviceAmount = (body.servicePrice / 100).toFixed(2);
    const addonAmount = body.ipenAddon ? ((body.addonPrice || 4000) / 100).toFixed(2) : '0.00';
    const total = ((body.totalAmount || body.servicePrice) / 100).toFixed(2);
    
    const formattedDate = formatDate(body.appointmentDate);
    const formattedTime = formatTime(body.appointmentTime);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1A2A3A; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #1A2A3A 0%, #2d4051 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #D7C29E; margin: 0; font-size: 28px; font-weight: 600;">Booking Confirmed!</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Notary and Signings</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <p style="font-size: 16px; margin-bottom: 20px;">Dear ${sanitizeData(body.customerName)},</p>
            
            <p style="font-size: 16px; margin-bottom: 25px;">Thank you for choosing our notary services! Your appointment has been successfully confirmed and payment received.</p>
            
            <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #D7C29E;">
              <h2 style="color: #1A2A3A; margin-top: 0; font-size: 20px; font-weight: 600;">Appointment Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Confirmation Number:</td>
                  <td style="padding: 8px 0; color: #1A2A3A; font-weight: 700; font-family: monospace;">${sanitizeData(body.bookingId)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Service:</td>
                  <td style="padding: 8px 0; color: #1A2A3A;">${sanitizeData(body.serviceName)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Date:</td>
                  <td style="padding: 8px 0; color: #1A2A3A;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Time:</td>
                  <td style="padding: 8px 0; color: #1A2A3A;">${formattedTime}</td>
                </tr>
              </table>
            </div>

            <div style="margin: 30px 0; padding: 25px; background: #f9fafb; border-radius: 8px; text-align: center;">
              <h3 style="color: #1A2A3A; margin: 0 0 15px 0; font-size: 18px;">Check Your Booking Anytime</h3>
              <p style="color: #4b5563; margin: 0 0 20px 0; font-size: 14px;">
                You can view your booking details and status at any time using your confirmation number.
              </p>
              <a href="${FRONTEND_URL}/booking-status?bookingId=${sanitizeData(body.bookingId)}&email=${encodeURIComponent(body.customerEmail)}" 
                 style="display: inline-block; padding: 14px 32px; background: #D7C29E; color: #1A2A3A; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                View Booking Status
              </a>
              <p style="color: #6b7280; font-size: 13px; margin: 15px 0 0 0;">
                Your confirmation number: <strong style="color: #1A2A3A; font-family: monospace;">${sanitizeData(body.bookingId)}</strong>
              </p>
            </div>

            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">Important Reminders</h3>
              <ul style="margin: 0; padding-left: 20px; color: #78350f;">
                <li style="margin-bottom: 8px;">Please bring a valid government-issued photo ID</li>
                <li style="margin-bottom: 8px;">Arrive 5 minutes early to ensure timely service</li>
                <li style="margin-bottom: 8px;">All documents must be ready for signing</li>
              </ul>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px;">
              <h3 style="color: #1A2A3A; margin: 0 0 15px 0; font-size: 16px;">Need to Reschedule or Cancel?</h3>
              <p style="margin: 0 0 10px 0; color: #4b5563; font-size: 14px;">
                If you need to make changes to your appointment, please contact us at least 24 hours in advance:
              </p>
              <p style="margin: 5px 0; color: #1A2A3A;">
                <strong>Email:</strong> <a href="mailto:info@notaryandsignings.com" style="color: #D7C29E; text-decoration: none;">info@notaryandsignings.com</a>
              </p>
              <p style="margin: 5px 0; color: #1A2A3A;">
                <strong>Phone:</strong> <a href="tel:+19085148180" style="color: #D7C29E; text-decoration: none;">(908) 514-8180</a>
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">We look forward to serving you!</p>
              <p style="margin: 10px 0 0 0; color: #1A2A3A; font-weight: 600;">Notary and Signings Team</p>
            </div>

            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0; text-align: center;">
                This is an automated confirmation email. Please do not reply to this message.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log("Attempting to send email to:", sanitizeData(body.customerEmail));

    const emailResponse = await resend.emails.send({
      from: "Notary and Signings <info@notaryandsignings.com>",
      to: [sanitizeData(body.customerEmail)],
      subject: `Booking Confirmation - ${sanitizeData(body.serviceName)}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in send-booking-confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
