import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { isValidUUID, isValidEmail, isValidDate, isValidTime, sanitizeString } from "../_shared/validation.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  bookingId: string;
  customerEmail: string;
  customerName: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  servicePrice: number;
  paymentMethod: string;
}

const formatPrice = (cents: number): string => {
  return `$${(cents / 100).toFixed(2)}`;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(':');
  const time = new Date();
  time.setHours(parseInt(hours), parseInt(minutes));
  return time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
  
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const requestData: BookingConfirmationRequest = await req.json();
    
    // Validate inputs
    const errors: string[] = [];
    if (!requestData.bookingId || !isValidUUID(requestData.bookingId)) errors.push('Invalid booking ID');
    if (!requestData.customerEmail || !isValidEmail(requestData.customerEmail)) errors.push('Invalid email');
    if (!requestData.customerName || requestData.customerName.trim().length < 2) errors.push('Invalid name');
    if (!requestData.serviceName || requestData.serviceName.trim().length < 2) errors.push('Invalid service name');
    if (!requestData.appointmentDate || !isValidDate(requestData.appointmentDate)) errors.push('Invalid date');
    if (!requestData.appointmentTime || !isValidTime(requestData.appointmentTime)) errors.push('Invalid time');
    if (typeof requestData.servicePrice !== 'number' || requestData.servicePrice < 0) errors.push('Invalid price');
    if (!['online', 'at_appointment'].includes(requestData.paymentMethod)) errors.push('Invalid payment method');
    
    if (errors.length > 0) {
      return new Response(JSON.stringify({ error: 'Validation failed', details: errors }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Sanitize inputs
    const bookingId = requestData.bookingId;
    const customerEmail = sanitizeString(requestData.customerEmail.toLowerCase(), 255);
    const customerName = sanitizeString(requestData.customerName, 100);
    const serviceName = sanitizeString(requestData.serviceName, 200);
    const appointmentDate = requestData.appointmentDate;
    const appointmentTime = requestData.appointmentTime;
    const servicePrice = requestData.servicePrice;
    const paymentMethod = requestData.paymentMethod;

    console.log('Sending booking confirmation email to:', customerEmail);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #555; }
            .value { color: #333; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
            .confirmation-number { background: #e8f4fd; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✅ Booking Confirmed!</h1>
            <p>Your appointment has been successfully scheduled</p>
          </div>
          
          <div class="content">
            <p>Dear ${customerName},</p>
            <p>Thank you for booking with us! We're excited to confirm your appointment.</p>
            
            <div class="confirmation-number">
              <strong>Confirmation #: ${bookingId.slice(-8).toUpperCase()}</strong>
            </div>
            
            <div class="booking-details">
              <h3>📅 Appointment Details</h3>
              <div class="detail-row">
                <span class="label">Service:</span>
                <span class="value">${serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">${formatDate(appointmentDate)}</span>
              </div>
              <div class="detail-row">
                <span class="label">Time:</span>
                <span class="value">${formatTime(appointmentTime)}</span>
              </div>
              <div class="detail-row">
                <span class="label">Price:</span>
                <span class="value">${formatPrice(servicePrice)}</span>
              </div>
              <div class="detail-row">
                <span class="label">Payment Method:</span>
                <span class="value">${paymentMethod === 'online' ? 'Paid Online' : 'Pay at Appointment'}</span>
              </div>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4>📝 Important Reminders:</h4>
              <ul>
                <li>Please arrive 10 minutes early for your appointment</li>
                <li>Bring a valid ID for verification</li>
                <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
                ${paymentMethod === 'at_appointment' ? '<li>Payment will be collected at the time of service</li>' : ''}
              </ul>
            </div>
            
            <p>If you have any questions or need to make changes to your appointment, please don't hesitate to contact us.</p>
            <p>We look forward to seeing you!</p>
          </div>
          
          <div class="footer">
            <p>This is an automated confirmation email. Please save this for your records.</p>
            <p>© 2024 Notary Services. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Notary Services <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Booking Confirmed - ${serviceName} on ${formatDate(appointmentDate)}`,
      html: emailHtml,
    });

    console.log("Confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to send email' 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});