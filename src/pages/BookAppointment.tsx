import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays, parseISO, isAfter, isBefore, startOfDay } from "date-fns";
import { CalendarIcon, Clock, DollarSign, Phone, Mail, User, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const createBookingSchema = (t: (key: string) => string) => z.object({
  serviceId: z.string().min(1, t('validation.service_required')),
  fullName: z.string().min(2, t('validation.name_min')),
  email: z.string().email(t('validation.email_invalid')),
  phone: z.string().min(10, t('validation.phone_min')),
  appointmentDate: z.date({
    required_error: t('validation.date_required'),
  }),
  appointmentTime: z.string().min(1, t('validation.time_required')),
  paymentMethod: z.enum(["online", "at_appointment"]),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<ReturnType<typeof createBookingSchema>>;

interface Service {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  duration_minutes: number;
}

interface BusinessHours {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

const BookAppointment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(createBookingSchema(t)),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      notes: "",
      paymentMethod: "online"
    }
  });

  const selectedDate = form.watch("appointmentDate");
  const selectedServiceId = form.watch("serviceId");

  // Load services and business hours
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading booking data...');
        const [servicesResult, hoursResult, blockedResult] = await Promise.all([
          supabase.rpc('get_booking_services'),
          supabase.rpc('get_public_business_hours'),
          supabase.rpc('get_public_blocked_dates')
        ]);

        console.log('Services result:', servicesResult);
        console.log('Hours result:', hoursResult);
        console.log('Blocked dates result:', blockedResult);

        // All services now come from the database through get_booking_services()
        const allServices = servicesResult.data || [];
        console.log('All services:', allServices);
        setServices(allServices);
        
        if (hoursResult.data) {
          console.log('Setting business hours:', hoursResult.data);
          setBusinessHours(hoursResult.data);
        }
        
        if (blockedResult.data) {
          const blocked = blockedResult.data.map(d => parseISO(d.blocked_date));
          console.log('Setting blocked dates:', blocked);
          setBlockedDates(blocked);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: t('booking.error.failed'),
          variant: "destructive"
        });
      }
    };

    loadData();
  }, [toast, t]);

  // Update selected service when service ID changes
  useEffect(() => {
    if (selectedServiceId) {
      const service = services.find(s => s.id === selectedServiceId);
      setSelectedService(service || null);
    }
  }, [selectedServiceId, services]);

  // Generate available time slots when date changes
  useEffect(() => {
    if (selectedDate && selectedService && businessHours.length > 0) {
      generateAvailableSlots(selectedDate, selectedService);
    }
  }, [selectedDate, selectedService, businessHours]);

  const generateAvailableSlots = async (date: Date, service: Service) => {
    try {
      console.log('Generating slots for date:', format(date, 'yyyy-MM-dd'), 'service:', service.name);
      const dayOfWeek = date.getDay();
      console.log('Day of week:', dayOfWeek);
      
      const businessHour = businessHours.find(bh => bh.day_of_week === dayOfWeek);
      console.log('Business hour found:', businessHour);
      
      if (!businessHour) {
        console.log('No business hours for this day');
        setAvailableSlots([]);
        return;
      }

      // Get existing bookings for the selected date (using secure RPC)
      const { data: existingBookings, error: bookingsError } = await supabase
        .rpc('get_booked_times', {
          p_date: format(date, 'yyyy-MM-dd')
        });

      if (bookingsError) {
        console.error('Error fetching booked times:', bookingsError);
        setAvailableSlots([]);
        return;
      }

      console.log('Existing bookings:', existingBookings);

      const slots: string[] = [];
      const startTime = parseTimeString(businessHour.start_time);
      const endTime = parseTimeString(businessHour.end_time);
      const serviceDuration = service.duration_minutes;
      const bufferMinutes = 45; // 45-minute buffer between appointments
      
      console.log('Time range:', startTime, 'to', endTime, 'duration:', serviceDuration);
      
      // For today, filter out past times
      const now = new Date();
      const isToday = format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
      const currentMinutes = isToday ? now.getHours() * 60 + now.getMinutes() : 0;
      
      console.log('Is today?', isToday, 'Current minutes:', currentMinutes);
      
      // Generate 30-minute intervals
      for (let time = startTime; time < endTime; time += 30) {
        const slotStart = time;
        const slotEnd = time + serviceDuration;
        
        console.log('Checking slot:', formatTimeFromMinutes(slotStart), 'to', formatTimeFromMinutes(slotEnd));
        
        // Skip past times for today (add 1 hour buffer for current time)
        if (isToday && slotStart <= currentMinutes + 60) {
          console.log('Skipping past time');
          continue;
        }
        
        // Check if slot fits within business hours
        if (slotEnd > endTime) {
          console.log('Slot extends beyond business hours');
          break;
        }
        
        // Check for conflicts with existing bookings (with buffer)
        const hasConflict = existingBookings?.some(booking => {
          const bookingStart = parseTimeString(booking.appointment_time);
          const bookingEnd = parseTimeString(booking.appointment_end_time);
          const bufferStart = bookingStart - bufferMinutes;
          const bufferEnd = bookingEnd + bufferMinutes;
          
          const conflict = (slotStart < bufferEnd && slotEnd > bufferStart);
          if (conflict) {
            console.log('Conflict with booking:', booking.appointment_time, 'to', booking.appointment_end_time);
          }
          return conflict;
        });
        
        if (!hasConflict) {
          const timeSlot = formatTimeFromMinutes(slotStart);
          console.log('Adding available slot:', timeSlot);
          slots.push(timeSlot);
        }
      }
      
      console.log('Final available slots:', slots);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error generating slots:', error);
      setAvailableSlots([]);
    }
  };

  const parseTimeString = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTimeFromMinutes = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedService) return;
    
    setIsLoading(true);
    try {
      // Use secure edge function for booking creation
      const { data: bookingResult, error: bookingError } = await supabase.functions
        .invoke('create-booking', {
          body: {
            serviceId: data.serviceId,
            appointmentDate: format(data.appointmentDate, 'yyyy-MM-dd'),
            appointmentTime: convertTo24Hour(data.appointmentTime),
            paymentMethod: data.paymentMethod,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            notes: data.notes || null
          }
        });

      if (bookingError) {
        throw new Error(bookingError.message || 'Failed to create booking');
      }

      if (!bookingResult?.success) {
        throw new Error(bookingResult?.error || 'Failed to create booking');
      }

      const { bookingId, bookingToken } = bookingResult;

      // Send confirmation email
      try {
        await supabase.functions.invoke('send-booking-confirmation', {
          body: {
            bookingId,
            customerEmail: data.email,
            customerName: data.fullName,
            serviceName: selectedService.name,
            appointmentDate: format(data.appointmentDate, 'yyyy-MM-dd'),
            appointmentTime: convertTo24Hour(data.appointmentTime),
            servicePrice: selectedService.price_cents,
            paymentMethod: data.paymentMethod
          }
        });
        console.log('Confirmation email sent successfully');
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the booking if email fails
      }

      toast({
        title: t('booking.success.title'),
        description: data.paymentMethod === 'online' ? t('booking.success.payment') : t('booking.success.confirmed'),
      });

      // If online payment, redirect to Stripe
      if (data.paymentMethod === 'online') {
        const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-payment', {
          body: { bookingId }
        });

        console.log('Payment response:', { paymentData, paymentError });

        if (paymentError) {
          throw new Error(paymentError.message || t('booking.error.payment'));
        }

        if (!paymentData?.url) {
          throw new Error('No payment URL received');
        }

        console.log('Redirecting to:', paymentData.url);
        // Open Stripe Checkout in a new tab to avoid iframe restrictions
        const newWindow = window.open(paymentData.url, '_blank', 'noopener,noreferrer');
        if (!newWindow) {
          // Fallback: navigate current window
          window.location.href = paymentData.url;
        }
      } else {
        // Redirect to success page for "pay at appointment" using secure token
        navigate(`/booking-success?token=${bookingToken}`);
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || t('booking.error.failed'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const convertTo24Hour = (time12h: string): string => {
    const [time, period] = time12h.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hour24 = hours;
    
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;
    
    return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    const isBlocked = blockedDates.some(blocked => 
      format(blocked, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    const dayOfWeek = date.getDay();
    const hasBusinessHours = businessHours.some(bh => bh.day_of_week === dayOfWeek);
    
    return isBefore(date, today) || isBlocked || !hasBusinessHours;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">{t('booking.title')}</h1>
            <p className="text-muted-foreground">
              {t('booking.subtitle')}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Service Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {t('booking.service_selection')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="serviceId"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('booking.service_label')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('booking.service_placeholder')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {services.map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                  <div className="flex items-center justify-between w-full">
                                    <span>{service.name}</span>
                                    <span className="ml-2 text-muted-foreground">
                                      ${(service.price_cents / 100).toFixed(2)}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedService && (
                      <div className="p-4 bg-muted rounded-lg space-y-2">
                        <h4 className="font-semibold">{selectedService.name}</h4>
                        <p className="text-sm text-muted-foreground">{selectedService.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>${(selectedService.price_cents / 100).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{selectedService.duration_minutes} min</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {t('booking.contact_info')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('booking.full_name')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('booking.full_name_placeholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('booking.email')}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder={t('booking.email_placeholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('booking.phone')}</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder={t('booking.phone_placeholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Date and Time Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {t('booking.date_time')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Date Selection */}
                    <FormField
                      control={form.control}
                      name="appointmentDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t('booking.appointment_date')}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>{t('booking.pick_date')}</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={isDateDisabled}
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Time Selection */}
                    <FormField
                      control={form.control}
                      name="appointmentTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('booking.appointment_time')}</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={!selectedDate || availableSlots.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue 
                                  placeholder={
                                    !selectedDate 
                                      ? "Select date first" 
                                      : availableSlots.length === 0 
                                        ? "No slots available" 
                                        : "Choose time"
                                  } 
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {selectedDate && availableSlots.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No available time slots for this date. Please select another date.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                <CardTitle>{t('booking.payment_method')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid gap-4"
                          >
                            <div className="flex items-center space-x-2 p-4 border rounded-lg">
                              <RadioGroupItem value="online" id="online" />
                              <Label htmlFor="online" className="flex-1 cursor-pointer">
                                <div>
                                  <div className="font-medium">Pay Online Now</div>
                                  <div className="text-sm text-muted-foreground">
                                    Secure payment with credit/debit card
                                  </div>
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-4 border rounded-lg">
                              <RadioGroupItem value="at_appointment" id="at_appointment" />
                              <Label htmlFor="at_appointment" className="flex-1 cursor-pointer">
                                <div>
                                  <div className="font-medium">Pay at Appointment</div>
                                  <div className="text-sm text-muted-foreground">
                                    Card, Zelle, Apple Pay, or Cash accepted
                                  </div>
                                </div>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Any special instructions or notes..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isLoading}
                  className="w-full md:w-auto"
                >
                  {isLoading ? t('booking.loading') : t('booking.book_now')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookAppointment;