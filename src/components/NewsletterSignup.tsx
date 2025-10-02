import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Save newsletter subscription to database
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({
          email: email.trim().toLowerCase(),
          name: name.trim() || null,
          source: 'website',
          is_active: true,
          double_opt_in_confirmed: false
        });

      if (error) {
        // Check if it's a duplicate email error
        if (error.code === '23505') {
          toast({
            title: "Already Subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "default",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Successfully Subscribed!",
          description: "Thank you for subscribing to our newsletter.",
        });
        
        setEmail('');
        setName('');
      }
    } catch (error: any) {
      console.error('Newsletter signup error:', error);
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-background/50"
            maxLength={100}
          />
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50"
              maxLength={255}
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                'Subscribing...'
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Subscribe
                </>
              )}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Subscribe to receive updates about our services and special offers.
        </p>
      </form>
    </div>
  );
};
