import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, User, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  booking_id: string;
  sender_type: 'customer' | 'admin';
  message: string;
  created_at: string;
  is_read: boolean;
}

interface Booking {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  services: {
    name: string;
  };
}

interface BookingMessagingProps {
  bookingId: string;
  isAdmin?: boolean;
}

const BookingMessaging = ({ bookingId, isAdmin = false }: BookingMessagingProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
      fetchMessages();
      
      // Set up real-time subscription for new messages
      const channel = supabase
        .channel('booking-messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'booking_messages',
            filter: `booking_id=eq.${bookingId}`,
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          appointment_date,
          appointment_time,
          status,
          services (
            name
          )
        `)
        .eq('id', bookingId)
        .single();

      if (error) throw error;
      setBooking(data);
    } catch (error) {
      console.error('Error fetching booking:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_messages')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []).map(msg => ({
        ...msg,
        sender_type: msg.sender_type as 'customer' | 'admin'
      })));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    try {
      // Use server-side function for secure sender_type determination
      const { error } = await supabase.rpc('insert_booking_message', {
        p_booking_id: bookingId,
        p_message: newMessage.trim()
      });

      if (error) throw error;

      setNewMessage('');
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('booking_messages')
        .update({ is_read: true })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Please log in to view messages.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Booking Messages
        </CardTitle>
        {booking && (
          <div className="text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {booking.services.name} - {new Date(booking.appointment_date).toLocaleDateString()} at {booking.appointment_time}
            </p>
            <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
              {booking.status}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No messages yet. Start a conversation!
            </p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  (isAdmin && message.sender_type === 'admin') || 
                  (!isAdmin && message.sender_type === 'customer')
                    ? 'justify-end' 
                    : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    (isAdmin && message.sender_type === 'admin') || 
                    (!isAdmin && message.sender_type === 'customer')
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                  onClick={() => !message.is_read && markAsRead(message.id)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-3 w-3" />
                    <span className="text-xs font-medium">
                      {message.sender_type === 'admin' ? 'Admin' : 'Customer'}
                    </span>
                    {!message.is_read && (
                      <Badge variant="destructive" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatTime(message.created_at)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || loading}
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingMessaging;