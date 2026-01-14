import { useState, useEffect } from "react";
import { format, parseISO, isBefore, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Clock, Calendar, Send, MessageSquare, CalendarIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface BusinessHours {
  day_of_week: number;
}

export default function ContactSection() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    preferredDate: undefined as Date | undefined,
    timing: '',
    message: ''
  });

  // Load blocked dates and business hours
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const [blockedResult, hoursResult] = await Promise.all([
          supabase.rpc('get_public_blocked_dates'),
          supabase.rpc('get_public_business_hours')
        ]);

        if (blockedResult.data) {
          const blocked = blockedResult.data.map((d: { blocked_date: string }) => parseISO(d.blocked_date));
          setBlockedDates(blocked);
        }

        if (hoursResult.data) {
          setBusinessHours(hoursResult.data);
        }
      } catch (error) {
        console.error('Error loading availability:', error);
      }
    };

    loadAvailability();
  }, []);

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    const isBlocked = blockedDates.some(blocked => 
      format(blocked, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    const dayOfWeek = date.getDay();
    const hasBusinessHours = businessHours.some(bh => bh.day_of_week === dayOfWeek);
    
    return isBefore(date, today) || isBlocked || !hasBusinessHours;
  };

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Email, Message).",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const preferredDateStr = formData.preferredDate ? format(formData.preferredDate, 'PPP') : 'Not specified';
      const fullMessage = `Service: ${formData.service || 'Not specified'}
Preferred Date: ${preferredDateStr}
Timing: ${formData.timing || 'Not specified'}

Message:
${formData.message}`;

      // 1. Save to database
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert({
          name: fullName,
          email: formData.email,
          phone: formData.phone || null,
          message: fullMessage,
          status: 'new'
        });

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      // 2. Send email notification (non-blocking)
      supabase.functions.invoke('send-contact-email', {
        body: {
          name: fullName,
          email: formData.email,
          phone: formData.phone,
          message: fullMessage
        }
      }).catch(err => console.error('Email notification failed:', err));

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        service: '',
        preferredDate: undefined,
        timing: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const contactInfo = [{
    icon: Phone,
    title: t('contact.info.phone'),
    content: "(908) 514-8180",
    description: t('contact.info.phone.description')
  }, {
    icon: Mail,
    title: t('contact.info.email'),
    content: "info@notaryandsignings.com",
    description: t('contact.info.email.description')
  }, {
    icon: MapPin,
    title: t('contact.info.location'),
    content: t('contact.info.location.address'),
    description: t('contact.info.location.description')
  }, {
    icon: Clock,
    title: t('contact.info.hours'),
    content: t('contact.info.hours.schedule'),
    description: t('contact.info.hours.description')
  }];
  const businessHoursDisplay = [{
    day: t('contact.hours.monday'),
    hours: t('contact.hours.appointment')
  }, {
    day: t('contact.hours.saturday'),
    hours: t('contact.hours.appointment_only')
  }, {
    day: t('contact.hours.sunday'),
    hours: t('contact.hours.appointment_only')
  }];
  return <section id="contact" className="bg-gradient-subtle py-[40px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="bg-accent-muted text-accent-foreground border-accent">
            <MessageSquare className="w-4 h-4 mr-2" />
            {t('contact.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-foreground flex items-center">
                  <Calendar className="w-6 h-6 mr-3 text-accent" />
                  {t('contact.form.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">{t('contact.form.first_name')} *</label>
                      <Input 
                        placeholder={t('contact.form.first_name')} 
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">{t('contact.form.last_name')}</label>
                      <Input 
                        placeholder={t('contact.form.last_name')} 
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">{t('contact.form.email')} *</label>
                      <Input 
                        type="email" 
                        placeholder={t('contact.form.email')} 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">{t('contact.form.phone')}</label>
                      <Input 
                        type="tel" 
                        placeholder={t('contact.form.phone')} 
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">{t('contact.form.service')}</label>
                    <select 
                      className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                      value={formData.service}
                      onChange={(e) => handleInputChange('service', e.target.value)}
                    >
                      <option value="">{t('contact.form.service')}</option>
                      <option value="mobile-notary">{t('contact.form.service.mobile')}</option>
                      <option value="loan-signing">{t('contact.form.service.loan')}</option>
                      <option value="ron">{t('contact.form.service.ron')}</option>
                      <option value="apostille">{t('contact.form.service.apostille')}</option>
                      <option value="fingerprinting">{t('services.fingerprint.title')}</option>
                      <option value="tax-prep">{t('services.tax.individual.title')}</option>
                      <option value="other">{t('contact.form.service.other')}</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">{t('contact.form.preferred_date')}</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.preferredDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.preferredDate ? format(formData.preferredDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={formData.preferredDate}
                            onSelect={(date) => handleInputChange('preferredDate', date)}
                            disabled={isDateDisabled}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">{t('contact.form.timing')}</label>
                      <select 
                        className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                        value={formData.timing}
                        onChange={(e) => handleInputChange('timing', e.target.value)}
                      >
                        <option value="">{t('contact.form.timing')}</option>
                        <option value="morning">{t('contact.form.timing.morning')}</option>
                        <option value="afternoon">{t('contact.form.timing.afternoon')}</option>
                        <option value="evening">{t('contact.form.timing.evening')}</option>
                        <option value="flexible">{t('contact.form.timing.flexible')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">{t('contact.form.message')} *</label>
                    <Textarea 
                      placeholder={t('contact.form.message_placeholder')} 
                      rows={4} 
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                    <Send className="w-5 h-5 mr-2" />
                    {loading ? 'Sending...' : t('contact.form.submit')}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    {t('contact.form.response')}
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => <Card key={index} className="transition-all duration-300 hover:shadow-card">
                  <CardContent className="flex items-start space-x-4 p-6">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3 flex-shrink-0">
                      <info.icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground">{info.title}</h4>
                      <p className="text-primary font-medium">{info.content}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </CardContent>
                </Card>)}
            </div>

            {/* Business Hours */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-accent" />
                  {t('contact.info.hours')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {businessHoursDisplay.map((schedule, index) => <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <span className="text-sm font-medium text-foreground">{schedule.day}</span>
                    <span className="text-sm text-muted-foreground">{schedule.hours}</span>
                  </div>)}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-4">
              <Button variant="outline" size="lg" className="w-full">
                <Phone className="w-5 h-5 mr-2" />
                {t('contact.call_now')}: (908) 514-8180
              </Button>
              <Button variant="accent" size="lg" className="w-full">
                <Mail className="w-5 h-5 mr-2" />
                {t('contact.email_us')}
              </Button>
            </div>

            {/* Professional Notice */}
            <Card className="bg-accent-muted border-accent">
              <CardContent className="p-6 text-center space-y-2">
                <h4 className="font-semibold text-accent-foreground">{t('contact.emergency.title')}</h4>
                <p className="text-sm text-accent-foreground">
                  {t('contact.emergency.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>;
}