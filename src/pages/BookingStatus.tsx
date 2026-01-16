import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, Clock, XCircle, Search } from "lucide-react";
import { format } from "date-fns";

const formSchema = z.object({
  bookingId: z.string().uuid({ message: "Please enter a valid booking ID" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormData = z.infer<typeof formSchema>;

interface BookingData {
  booking_id: string;
  service_name: string;
  service_description: string;
  appointment_date: string;
  appointment_time: string;
  appointment_end_time: string;
  status: string;
  payment_status: string;
  payment_method: string;
  full_name: string;
  email: string;
  phone: string;
  notes: string | null;
  created_at: string;
}

const StatusBadge = ({ status, paymentStatus }: { status: string; paymentStatus: string }) => {
  if (status === "cancelled") {
    return (
      <Badge variant="destructive" className="gap-2">
        <XCircle className="h-4 w-4" />
        Cancelled
      </Badge>
    );
  }
  
  if (paymentStatus === "paid" && status === "confirmed") {
    return (
      <Badge className="gap-2 bg-green-600 hover:bg-green-700">
        <CheckCircle2 className="h-4 w-4" />
        Confirmed
      </Badge>
    );
  }
  
  return (
    <Badge variant="secondary" className="gap-2">
      <Clock className="h-4 w-4" />
      Pending Payment
    </Badge>
  );
};

export default function BookingStatus() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const bookingId = searchParams.get("bookingId");
    const email = searchParams.get("email");

    if (bookingId) {
      setValue("bookingId", bookingId);
    }
    if (email) {
      setValue("email", email);
    }

    // Auto-submit if both params are present
    if (bookingId && email) {
      handleSubmit(onSubmit)();
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setBookingData(null);

    // Consistent error message to prevent email enumeration
    const genericNotFoundError = "We couldn't find a booking with the provided details. Please check your confirmation number and email address and try again.";

    try {
      const { data: result, error: rpcError } = await supabase.rpc(
        "get_booking_by_id_and_email",
        {
          p_booking_id: data.bookingId,
          p_email: data.email.toLowerCase(),
        }
      );

      if (rpcError) {
        // Log the actual error for debugging, but show generic message to user
        console.error("Error fetching booking:", rpcError);
        // Use same error message regardless of error type to prevent information leakage
        setError(genericNotFoundError);
        return;
      }

      if (!result || result.length === 0) {
        // Same error message whether booking doesn't exist or email doesn't match
        setError(genericNotFoundError);
        return;
      }

      setBookingData(result[0]);
    } catch (err) {
      // Log the actual error for debugging
      console.error("Exception fetching booking:", err);
      // Use consistent error message to prevent timing attacks
      setError(genericNotFoundError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">Check Booking Status</h1>
          <p className="text-muted-foreground">
            Enter your confirmation number and email to view your booking details
          </p>
        </div>

        <Card className="shadow-xl border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Booking Lookup
            </CardTitle>
            <CardDescription>
              You can find your confirmation number in the email we sent you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bookingId">Booking Confirmation Number</Label>
                <Input
                  id="bookingId"
                  type="text"
                  placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
                  {...register("bookingId")}
                  disabled={isLoading}
                />
                {errors.bookingId && (
                  <p className="text-sm text-destructive">{errors.bookingId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register("email")}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Check Status"
                )}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {bookingData && (
              <div className="mt-6 space-y-4">
                <div className="p-6 bg-muted/50 rounded-lg border-2 border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-1">
                        {bookingData.service_name}
                      </h3>
                      <p className="text-muted-foreground">{bookingData.service_description}</p>
                    </div>
                    <StatusBadge
                      status={bookingData.status}
                      paymentStatus={bookingData.payment_status}
                    />
                  </div>

                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground font-medium">Customer Name:</span>
                      <span className="font-semibold text-foreground">{bookingData.full_name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground font-medium">Email:</span>
                      <span className="font-semibold text-foreground">{bookingData.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground font-medium">Phone:</span>
                      <span className="font-semibold text-foreground">{bookingData.phone}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground font-medium">Appointment Date:</span>
                      <span className="font-semibold text-foreground">
                        {format(new Date(bookingData.appointment_date), "MMMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground font-medium">Time:</span>
                      <span className="font-semibold text-foreground">
                        {bookingData.appointment_time} - {bookingData.appointment_end_time}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground font-medium">Payment Method:</span>
                      <span className="font-semibold text-foreground capitalize">
                        {bookingData.payment_method.replace("_", " ")}
                      </span>
                    </div>
                    {bookingData.notes && (
                      <div className="py-2">
                        <span className="text-muted-foreground font-medium block mb-1">Notes:</span>
                        <p className="text-foreground bg-background p-3 rounded border border-border">
                          {bookingData.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {bookingData.status === "confirmed" && bookingData.payment_status === "paid" && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                        ✓ Your appointment is confirmed! We look forward to seeing you.
                      </p>
                    </div>
                  )}

                  {bookingData.payment_status === "pending" && (
                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                        ⏳ Awaiting payment confirmation. This may take a few minutes.
                      </p>
                    </div>
                  )}

                  {bookingData.status === "cancelled" && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                        ✕ This booking has been cancelled.
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <h4 className="font-semibold text-foreground mb-2">Need to Reschedule?</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Please contact us at least 24 hours in advance:
                  </p>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      <a
                        href="mailto:info@notaryandsignings.com"
                        className="text-primary hover:underline"
                      >
                        info@notaryandsignings.com
                      </a>
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      <a href="tel:+1234567890" className="text-primary hover:underline">
                        (123) 456-7890
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
