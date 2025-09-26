import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingReminderRequest {
  bookingId: string;
  customerEmail: string;
  customerName: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  hoursUntilAppointment?: number;
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

  try {
    const {
      bookingId,
      customerEmail,
      customerName,
      serviceName,
      appointmentDate,
      appointmentTime,
      hoursUntilAppointment = 24
    }: BookingReminderRequest = await req.json();

    console.log('Sending booking reminder email to:', customerEmail);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Appointment Reminder</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .reminder-box { background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f5576c; }
            .appointment-details { background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .countdown { background: #ff6b6b; color: white; padding: 15px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>⏰ Appointment Reminder</h1>
            <p>Don't forget about your upcoming appointment!</p>
          </div>
          
          <div class="content">
            <p>Hello ${customerName},</p>
            <p>This is a friendly reminder about your upcoming appointment with us.</p>
            
            <div class="countdown">
              ⏰ Your appointment is in ${hoursUntilAppointment} hours!
            </div>
            
            <div class="appointment-details">
              <h3>📅 Appointment Details:</h3>
              <p><strong>Service:</strong> ${serviceName}</p>
              <p><strong>Date:</strong> ${formatDate(appointmentDate)}</p>
              <p><strong>Time:</strong> ${formatTime(appointmentTime)}</p>
              <p><strong>Confirmation #:</strong> ${bookingId.slice(-8).toUpperCase()}</p>
            </div>
            
            <div class="reminder-box">
              <h4>📋 Please Remember:</h4>
              <ul>
                <li>Arrive 10 minutes early</li>
                <li>Bring a valid photo ID</li>
                <li>Have all required documents ready</li>
                <li>Contact us if you need to reschedule</li>
              </ul>
            </div>
            
            <p>We're looking forward to seeing you tomorrow! If you have any questions or need to make changes, please contact us as soon as possible.</p>
            
            <p>Thank you for choosing our services!</p>
          </div>
          
          <div class="footer">
            <p>Need to reschedule? Contact us immediately.</p>
            <p>© 2024 Notary Services. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Notary Services <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Reminder: ${serviceName} appointment tomorrow at ${formatTime(appointmentTime)}`,
      html: emailHtml,
    });

    console.log("Reminder email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Error sending reminder email:", error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to send reminder email' 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});