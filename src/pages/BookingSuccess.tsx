import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Calendar, Clock, DollarSign, Mail, Phone, User } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";

interface Booking {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  appointment_date: string;
  appointment_time: string;
  payment_method: string;
  payment_status: string;
  notes: string;
  services: {
    name: string;
    price_cents: number;
    duration_minutes: number;
  };
}

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationComplete, setVerificationComplete] = useState(false);

  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    const loadBookingAndVerifyPayment = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }

      try {
        // Load booking details
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select(`
            *,
            services (
              name,
              price_cents,
              duration_minutes
            )
          `)
          .eq('id', bookingId)
          .single();

        if (bookingError) {
          console.error('Error loading booking:', bookingError);
          setLoading(false);
          return;
        }

        setBooking(bookingData);

        // If there's a session ID, verify the payment
        if (sessionId && !verificationComplete) {
          console.log('Verifying payment for session:', sessionId);
          
          const { data: verificationData, error: verificationError } = await supabase.functions.invoke('verify-payment', {
            body: { sessionId, bookingId }
          });

          if (verificationError) {
            console.error('Error verifying payment:', verificationError);
          } else {
            console.log('Payment verification result:', verificationData);
            // Update local booking state with payment status
            if (verificationData?.paymentStatus === 'paid') {
              setBooking(prev => prev ? { ...prev, payment_status: 'paid' } : null);
            }
          }
          
          setVerificationComplete(true);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookingAndVerifyPayment();
  }, [bookingId, sessionId, verificationComplete]);

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Booking Not Found</h1>
            <p className="text-muted-foreground">We couldn't find your booking. Please check your confirmation email or contact us.</p>
            <Link to="/book-appointment">
              <Button>Book New Appointment</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Booking Confirmed!</h1>
            <p className="text-xl text-muted-foreground">
              Your appointment has been successfully scheduled
            </p>
          </div>

          {/* Booking Details */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Appointment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">{booking.services.name}</h4>
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(parseISO(booking.appointment_date), 'EEEE, MMMM do, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatTime(booking.appointment_time)} ({booking.services.duration_minutes} minutes)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>${(booking.services.price_cents / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Status */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                booking.payment_status === 'paid' 
                  ? 'bg-green-100 text-green-800' 
                  : booking.payment_status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {booking.payment_status === 'paid' && 'Payment Completed'}
                {booking.payment_status === 'pending' && booking.payment_method === 'online' && 'Payment Processing'}
                {booking.payment_status === 'pending' && booking.payment_method === 'at_appointment' && 'Payment Due at Appointment'}
                {booking.payment_status === 'failed' && 'Payment Failed'}
              </div>
              
              {booking.payment_method === 'at_appointment' && (
                <p className="text-sm text-muted-foreground mt-2">
                  Payment will be collected at the time of your appointment. We accept cash, check, and card payments.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {booking.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{booking.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Before Your Appointment:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>Prepare all documents that need to be notarized</li>
                  <li>Bring a valid government-issued photo ID</li>
                  <li>Do not sign the documents before the appointment</li>
                  {booking.payment_method === 'at_appointment' && (
                    <li>Prepare payment for the service</li>
                  )}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Need to Make Changes?</h4>
                <p className="text-sm text-muted-foreground">
                  If you need to reschedule or cancel your appointment, please contact us at least 2 hours in advance.
                </p>
              </div>

              <div className="pt-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/contact">
                    <Button variant="outline">Contact Us</Button>
                  </Link>
                  <Link to="/book-appointment">
                    <Button>Book Another Appointment</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confirmation Number */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Confirmation Number: <span className="font-mono font-semibold">{booking.id.slice(-8).toUpperCase()}</span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingSuccess;