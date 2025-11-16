import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { sanitizeString } from "../_shared/validation.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const FRONTEND_URL = Deno.env.get("FRONTEND_URL") || "https://notaryandsignings.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingNotificationRequest {
  bookingId: string;
  bookingToken: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentEndTime: string;
  servicePrice: number;
  paymentMethod: string;
  paymentStatus: string;
  ipenAddon?: boolean;
  addonPrice?: number;
  totalAmount: number;
  notes?: string;
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: BookingNotificationRequest = await req.json();

    console.log('Sending business notification for booking:', body.bookingId);

    const formattedDate = formatDate(body.appointmentDate);
    const formattedTime = formatTime(body.appointmentTime);
    const formattedEndTime = formatTime(body.appointmentEndTime);
    
    const serviceAmount = formatPrice(body.servicePrice);
    const addonAmount = body.ipenAddon ? formatPrice(body.addonPrice || 0) : '$0.00';
    const totalAmount = formatPrice(body.totalAmount);

    const dashboardUrl = `${FRONTEND_URL}/dashboard`;
    const bookingStatusUrl = `${FRONTEND_URL}/booking-status?id=${body.bookingId}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Booking Received</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1A2A3A; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #1A2A3A 0%, #2d4051 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #D7C29E; margin: 0; font-size: 28px; font-weight: 600;">New Booking Received</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Notary and Signings</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #f0f7ff; border-left: 4px solid #D7C29E; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #1A2A3A;">
                <strong>Booking ID:</strong> ${sanitizeString(body.bookingId, 100)}<br>
                <strong>Confirmation Token:</strong> ${sanitizeString(body.bookingToken, 100)}
              </p>
            </div>

            <h2 style="color: #1A2A3A; font-size: 22px; margin: 30px 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #D7C29E;">Customer Information</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4B5563; width: 35%;">Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1A2A3A;">${sanitizeString(body.customerName, 100)}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4B5563;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1A2A3A;"><a href="mailto:${sanitizeString(body.customerEmail, 255)}" style="color: #D7C29E; text-decoration: none;">${sanitizeString(body.customerEmail, 255)}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4B5563;">Phone</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1A2A3A;"><a href="tel:${sanitizeString(body.customerPhone, 20)}" style="color: #D7C29E; text-decoration: none;">${sanitizeString(body.customerPhone, 20)}</a></td>
              </tr>
            </table>

            <h2 style="color: #1A2A3A; font-size: 22px; margin: 30px 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #D7C29E;">Appointment Details</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4B5563; width: 35%;">Service</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1A2A3A;">${sanitizeString(body.serviceName, 200)}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4B5563;">Date</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1A2A3A;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4B5563;">Time Slot</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1A2A3A;">${formattedTime} - ${formattedEndTime}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4B5563;">Service Price</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1A2A3A;">${serviceAmount}</td>
              </tr>
              ${body.ipenAddon ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4B5563;">iPEN Add-on</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1A2A3A;">${addonAmount}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4B5563;">Total Amount</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1A2A3A; font-size: 18px; font-weight: 600;">${totalAmount}</td>
              </tr>
            </table>

            <h2 style="color: #1A2A3A; font-size: 22px; margin: 30px 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #D7C29E;">Payment Information</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4B5563; width: 35%;">Payment Method</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #1A2A3A; text-transform: capitalize;">${body.paymentMethod.replace('_', ' ')}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4B5563;">Payment Status</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; ${body.paymentStatus === 'paid' ? 'background-color: #dcfce7; color: #166534;' : 'background-color: #fef3c7; color: #854d0e;'}">${body.paymentStatus.toUpperCase()}</span>
                </td>
              </tr>
            </table>

            ${body.notes ? `
            <h2 style="color: #1A2A3A; font-size: 22px; margin: 30px 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #D7C29E;">Customer Notes</h2>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
              <p style="margin: 0; color: #4B5563; white-space: pre-wrap;">${sanitizeString(body.notes, 1000)}</p>
            </div>
            ` : ''}

            <div style="margin-top: 35px; padding: 20px; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 8px; text-align: center;">
              <p style="margin: 0 0 15px 0; color: #4B5563; font-size: 14px;">Manage this booking in your dashboard</p>
              <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #1A2A3A 0%, #2d4051 100%); color: #D7C29E; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; margin-right: 10px;">View Dashboard</a>
              <a href="${bookingStatusUrl}" style="display: inline-block; background-color: #D7C29E; color: #1A2A3A; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">View Booking</a>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6B7280; font-size: 13px;">
              <p style="margin: 5px 0;">Notary and Signings</p>
              <p style="margin: 5px 0;">
                <a href="mailto:info@notaryandsignings.com" style="color: #D7C29E; text-decoration: none;">info@notaryandsignings.com</a>
              </p>
              <p style="margin: 5px 0;">This is an automated notification from your booking system.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "Notary Bookings <onboarding@resend.dev>",
      to: ["info@notaryandsignings.com"],
      subject: `New Booking: ${body.serviceName} - ${formattedDate}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending business notification:", error);
      throw error;
    }

    console.log("Business notification email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, emailId: data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
