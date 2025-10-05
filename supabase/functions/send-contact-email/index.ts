import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { validateContactData, sanitizeString } from "../_shared/validation.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

  try {
    const contactData: ContactEmailRequest = await req.json();
    
    // Validate input data
    const validationErrors = validateContactData(contactData);
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
    const name = sanitizeString(contactData.name, 100);
    const email = sanitizeString(contactData.email.toLowerCase(), 255);
    const phone = contactData.phone ? sanitizeString(contactData.phone, 20) : undefined;
    const message = sanitizeString(contactData.message, 2000);

    console.log('Sending contact form email:', { name, email });

    const businessEmailResponse = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: ["info@notaryandsignings.com"], // Updated to match your domain
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact Form Submission</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; }
              .contact-info { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #667eea; }
              .message-box { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>📧 New Contact Form Submission</h1>
            </div>
            
            <div class="content">
              <div class="contact-info">
                <h3>Contact Information:</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
              </div>
              
              <div class="message-box">
                <h3>Message:</h3>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
              
              <p><em>Please respond to this inquiry as soon as possible.</em></p>
            </div>
          </body>
        </html>
      `,
    });

    const confirmationEmailResponse = await resend.emails.send({
      from: "Notary & Signings <onboarding@resend.dev>",
      to: [email],
      subject: "We received your message!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Message Received</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
              .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>✅ Message Received!</h1>
              <p>Thank you for contacting us</p>
            </div>
            
            <div class="content">
              <p>Dear ${name},</p>
              
              <p>Thank you for reaching out to us! We have successfully received your message and will get back to you as soon as possible, typically within 24 hours during business days.</p>
              
              <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h4>📝 Your Message:</h4>
                <p style="font-style: italic;">"${message}"</p>
              </div>
              
              <p>If you have any urgent questions or need immediate assistance, please don't hesitate to call us.</p>
              
              <p>Best regards,<br>
              The Notary & Signings Team</p>
            </div>
            
            <div class="footer">
              <p>© 2024 Notary & Signings. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Contact emails sent successfully:", { 
      business: businessEmailResponse.data?.id, 
      confirmation: confirmationEmailResponse.data?.id 
    });

    return new Response(JSON.stringify({ 
      success: true, 
      businessEmailId: businessEmailResponse.data?.id,
      confirmationEmailId: confirmationEmailResponse.data?.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Error sending contact emails:", error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to send emails' 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});