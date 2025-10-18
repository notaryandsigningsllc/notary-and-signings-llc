import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, Mail } from 'lucide-react';

const EmailTest = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [testBookingId] = useState('11111111-1111-1111-1111-111111111111'); // Mock UUID

  // Contact Email Test
  const [contactEmail, setContactEmail] = useState('test@example.com');
  const [contactName, setContactName] = useState('Test User');
  const [contactPhone, setContactPhone] = useState('555-1234');
  const [contactMessage, setContactMessage] = useState('This is a test message');

  // Booking Confirmation Test
  const [bookingEmail, setBookingEmail] = useState('test@example.com');
  const [bookingName, setBookingName] = useState('Test User');
  const [bookingService, setBookingService] = useState('Notarization');
  const [bookingDate, setBookingDate] = useState('2025-01-20');
  const [bookingTime, setBookingTime] = useState('10:00');

  const testContactEmail = async () => {
    setLoading('contact');
    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          message: contactMessage,
        },
      });

      if (error) throw error;
      toast.success('Contact email sent successfully!');
    } catch (error: any) {
      toast.error('Failed to send contact email: ' + error.message);
    } finally {
      setLoading(null);
    }
  };

  const testBookingConfirmation = async () => {
    setLoading('booking');
    try {
      const { error } = await supabase.functions.invoke('send-booking-confirmation', {
        body: {
          bookingId: testBookingId,
          customerEmail: bookingEmail,
          customerName: bookingName,
          serviceName: bookingService,
          appointmentDate: bookingDate,
          appointmentTime: bookingTime,
          servicePrice: 5000,
          paymentMethod: 'at_appointment',
        },
      });

      if (error) throw error;
      toast.success('Booking confirmation sent! Check your email inbox.');
    } catch (error: any) {
      toast.error('Failed: ' + error.message);
    } finally {
      setLoading(null);
    }
  };

  const testBookingReminder = async () => {
    setLoading('reminder');
    try {
      const { error } = await supabase.functions.invoke('send-booking-reminder', {
        body: {
          bookingId: testBookingId,
          customerEmail: bookingEmail,
          customerName: bookingName,
          serviceName: bookingService,
          appointmentDate: bookingDate,
          appointmentTime: bookingTime,
        },
      });

      if (error) throw error;
      toast.success('Booking reminder sent! Check your email inbox.');
    } catch (error: any) {
      toast.error('Failed: ' + error.message);
    } finally {
      setLoading(null);
    }
  };

  const testFollowUp = async () => {
    setLoading('followup');
    try {
      const { error } = await supabase.functions.invoke('send-follow-up', {
        body: {
          bookingId: testBookingId,
          emailType: 'review_request',
          recipientEmail: bookingEmail,
          recipientName: bookingName,
          serviceName: bookingService,
        },
      });

      if (error) throw error;
      toast.success('Follow-up email sent! Check your email inbox.');
    } catch (error: any) {
      toast.error('Failed: ' + error.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Resend Email Testing</h1>
        
        <Alert className="mb-6">
          <Mail className="h-4 w-4" />
          <AlertTitle>How to Verify Emails</AlertTitle>
          <AlertDescription className="space-y-2 mt-2">
            <p>✅ Check your email inbox after clicking each test button</p>
            <p>✅ Look for emails from "Notary Services &lt;onboarding@resend.dev&gt;"</p>
            <p>✅ Success toasts mean the function executed - check email for actual delivery</p>
            <p>⚠️ Emails may take 1-2 minutes to arrive</p>
            <p>📧 Make sure to use a real email address you can access</p>
          </AlertDescription>
        </Alert>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Contact Email Test */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Email Test</CardTitle>
              <CardDescription>Test the contact form email functionality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
              <Input
                placeholder="Phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
              <Textarea
                placeholder="Message"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
              />
              <Button
                onClick={testContactEmail}
                disabled={loading === 'contact'}
                className="w-full"
              >
                {loading === 'contact' ? 'Sending...' : 'Send Test Contact Email'}
              </Button>
            </CardContent>
          </Card>

          {/* Booking Confirmation Test */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Confirmation Test</CardTitle>
              <CardDescription>Test booking confirmation emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Customer Name"
                value={bookingName}
                onChange={(e) => setBookingName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Customer Email"
                value={bookingEmail}
                onChange={(e) => setBookingEmail(e.target.value)}
              />
              <Input
                placeholder="Service Name"
                value={bookingService}
                onChange={(e) => setBookingService(e.target.value)}
              />
              <Input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
              />
              <Input
                type="time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
              />
              <Button
                onClick={testBookingConfirmation}
                disabled={loading === 'booking'}
                className="w-full"
              >
                {loading === 'booking' ? 'Sending...' : 'Send Test Confirmation'}
              </Button>
            </CardContent>
          </Card>

          {/* Booking Reminder Test */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Reminder Test</CardTitle>
              <CardDescription>Test booking reminder emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Uses the same booking details above</p>
              <Button
                onClick={testBookingReminder}
                disabled={loading === 'reminder'}
                className="w-full"
              >
                {loading === 'reminder' ? 'Sending...' : 'Send Test Reminder'}
              </Button>
            </CardContent>
          </Card>

          {/* Follow-up Email Test */}
          <Card>
            <CardHeader>
              <CardTitle>Follow-up Email Test</CardTitle>
              <CardDescription>Test follow-up emails (review request)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Uses the same booking details above</p>
              <Button
                onClick={testFollowUp}
                disabled={loading === 'followup'}
                className="w-full"
              >
                {loading === 'followup' ? 'Sending...' : 'Send Test Follow-up'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmailTest;
