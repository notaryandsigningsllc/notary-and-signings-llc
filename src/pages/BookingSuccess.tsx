import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Calendar, Clock, DollarSign, Mail, Phone, User } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface Booking {
  id: string;
  appointment_date: string;
  appointment_time: string;
  payment_method: string;
  payment_status: string;
  services: {
    name: string;
    price_cents: number;
    duration_minutes: number;
  };
}

interface BookingPII {
  pii_full_name: string;
  pii_email: string;
  pii_phone: string;
  pii_notes: string;
}

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [bookingPII, setBookingPII] = useState<BookingPII | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationComplete, setVerificationComplete] = useState(false);

  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');
  const token = searchParams.get('token');

  useEffect(() => {
    const loadBookingAndVerifyPayment = async () => {
      if (!bookingId && !token) {
        setLoading(false);
        return;
      }

      try {
        let bookingData = null;
        let bookingError = null;

        // Load booking details using secure token or booking ID
        if (token) {
          // Use secure token-based access
          const { data, error } = await supabase
            .rpc('get_booking_by_token', { p_token: token });
          
          if (data && data.length > 0) {
            // Get service details for the booking using the secure function
            const { data: allServices, error: serviceError } = await supabase
              .rpc('get_booking_services');
            
            const serviceData = allServices?.find(service => service.id === data[0].service_id);
            
            if (serviceData && !serviceError) {
              bookingData = { ...data[0], services: serviceData };
              
              // Get PII data separately using the secure function
              const { data: piiData, error: piiError } = await supabase
                .rpc('get_booking_pii', { 
                  p_booking_id: data[0].id, 
                  p_token: token 
                });
              
              if (piiData && piiData.length > 0) {
                setBookingPII(piiData[0]);
              }
            } else {
              bookingError = serviceError;
            }
          } else {
            bookingError = error || { message: 'Booking not found' };
          }
        } else if (bookingId) {
          // Fallback to booking ID (for authenticated users)
          const { data, error } = await supabase
            .from('bookings')
            .select(`
              *,
              services (
                name,
                description,
                price_cents,
                duration_minutes
              )
            `)
            .eq('id', bookingId)
            .single();
          
          if (data && !error) {
            bookingData = data;
            
            // Get PII data separately for authenticated users
            const { data: piiData, error: piiError } = await supabase
              .rpc('get_booking_pii', { 
                p_booking_id: bookingId 
              });
            
            if (piiData && piiData.length > 0) {
              setBookingPII(piiData[0]);
            }
          } else {
            bookingError = error;
          }
        }

        if (bookingError) {
          console.error('Error loading booking:', bookingError);
          setLoading(false);
          return;
        }

        setBooking(bookingData);

        // If there's a session ID, verify the payment
        if (sessionId && !verificationComplete) {
          console.log('Verifying payment for session:', sessionId);
          
          // Use the token from URL or from booking data for secure verification
          const verificationToken = token || bookingData.booking_token;
          
          const { data: verificationData, error: verificationError } = await supabase.functions.invoke('verify-payment', {
            body: { sessionId, bookingId: bookingData.id, bookingToken: verificationToken }
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
  }, [bookingId, token, sessionId, verificationComplete]);

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
            <div className="animate-pulse">{t('success.loading')}</div>
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
            <h1 className="text-2xl font-bold text-foreground">{t('success.not_found')}</h1>
            <p className="text-muted-foreground">{t('success.not_found_desc')}</p>
            <Link to="/book-appointment">
              <Button>{t('success.book_new')}</Button>
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
            <h1 className="text-4xl font-bold text-foreground">{t('success.title')}</h1>
            <p className="text-xl text-muted-foreground">
              {t('success.subtitle')}
            </p>
          </div>

          {/* Booking Details */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Appointment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t('success.appointment_details')}
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
                  {t('success.contact_info')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{bookingPII?.pii_full_name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{bookingPII?.pii_email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{bookingPII?.pii_phone || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Status */}
          <Card>
            <CardHeader>
              <CardTitle>{t('success.payment_status')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                booking.payment_status === 'paid' 
                  ? 'bg-green-100 text-green-800' 
                  : booking.payment_status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {booking.payment_status === 'paid' && t('success.payment.completed')}
                {booking.payment_status === 'pending' && booking.payment_method === 'online' && t('success.payment.processing')}
                {booking.payment_status === 'pending' && booking.payment_method === 'at_appointment' && t('success.payment.due_appointment')}
                {booking.payment_status === 'failed' && t('success.payment.failed')}
              </div>
              
              {booking.payment_method === 'at_appointment' && (
                <p className="text-sm text-muted-foreground mt-2">
                  {t('success.payment.note')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {bookingPII?.pii_notes && (
            <Card>
              <CardHeader>
                <CardTitle>{t('success.notes')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{bookingPII.pii_notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>{t('success.next_steps')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">{t('success.before_appointment')}</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>{t('success.prepare_docs')}</li>
                  <li>{t('success.bring_id')}</li>
                  <li>{t('success.no_sign')}</li>
                  {booking.payment_method === 'at_appointment' && (
                    <li>{t('success.prepare_payment')}</li>
                  )}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">{t('success.changes')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('success.changes_note')}
                </p>
              </div>

              <div className="pt-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/contact">
                    <Button variant="outline">{t('success.contact_us')}</Button>
                  </Link>
                  <Link to="/book-appointment">
                    <Button>{t('success.book_another')}</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confirmation Number */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {t('success.confirmation')} <span className="font-mono font-semibold">{booking.id.slice(-8).toUpperCase()}</span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingSuccess;