import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Home, Laptop, DollarSign, Fingerprint, Globe, Clock, Shield, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ServicesSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingService, setLoadingService] = useState<string | null>(null);

  const handleDirectCheckout = async (serviceId: string, serviceName: string) => {
    setLoadingService(serviceId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('create-product-checkout', {
        body: { serviceId },
        headers: session?.access_token ? {
          Authorization: `Bearer ${session.access_token}`
        } : {}
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive"
      });
    } finally {
      setLoadingService(null);
    }
  };
  const services = [{
    serviceName: 'Mobile Notary',
    icon: FileText,
    title: t('services.mobile.title'),
    description: t('services.mobile.description'),
    features: [t('services.mobile.feature1'), t('services.mobile.feature2'), t('services.mobile.feature3'), t('services.mobile.feature4')],
    price: "$75",
    duration: "1 hr",
    popular: false
  }, {
    serviceName: 'Loan Signing',
    icon: Home,
    title: t('services.loan.title'),
    description: t('services.loan.description'),
    features: [t('services.loan.feature1'), t('services.loan.feature2'), t('services.loan.feature3'), t('services.loan.feature4')],
    price: "$100",
    duration: "1.5 hr",
    popular: true
  }, {
    serviceName: 'Remote Online Notarization',
    icon: Laptop,
    title: t('services.ron.title'),
    description: t('services.ron.description'),
    features: [t('services.ron.feature1'), t('services.ron.feature2'), t('services.ron.feature3'), t('services.ron.feature4')],
    price: "$35",
    duration: "30 min",
    popular: false
  }, {
    serviceName: 'Apostille Services',
    icon: Globe,
    title: t('services.apostille.title'),
    description: t('services.apostille.description'),
    features: [t('services.apostille.feature1'), t('services.apostille.feature2'), t('services.apostille.feature3'), t('services.apostille.feature4')],
    price: "$50",
    duration: "45 min",
    popular: false
  }, {
    serviceName: 'Fingerprinting Services',
    icon: Fingerprint,
    title: t('services.fingerprint.title'),
    description: t('services.fingerprint.description'),
    features: [t('services.fingerprint.feature1'), t('services.fingerprint.feature2'), t('services.fingerprint.feature3'), t('services.fingerprint.feature4')],
    price: "$20",
    duration: "30 min",
    popular: false,
    comingSoon: false
  }];
  const [dbServices, setDbServices] = useState<any[]>([]);

  useState(() => {
    const fetchServices = async () => {
      const { data } = await supabase.rpc('get_booking_services');
      if (data) setDbServices(data);
    };
    fetchServices();
  });
  return <section id="services" className="bg-background py-[40px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="bg-accent-muted text-accent-foreground border-accent">
            <Shield className="w-4 h-4 mr-2" />
            {t('services.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t('services.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => <Card key={index} className={`relative transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 ${service.popular ? 'border-accent shadow-card' : ''} ${service.comingSoon ? 'opacity-75' : ''}`}>
              {service.popular && <Badge variant="outline" className="absolute -top-3 left-4 bg-accent text-accent-foreground border-accent">
                  {t('services.popular')}
                </Badge>}
              
              {service.comingSoon && <Badge variant="outline" className="absolute -top-3 right-4 bg-muted text-muted-foreground border-muted-foreground">
                  {t('services.coming_soon')}
                </Badge>}
              
              <CardHeader className="space-y-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${service.popular ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>
                  <service.icon className="w-6 h-6" />
                </div>
                
                <div>
                  <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
                  <CardDescription className="text-muted-foreground mt-2">
                    {service.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features List */}
                <div className="space-y-3">
                  {service.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>)}
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-primary">{service.price}</span>
                    <span className="text-sm text-muted-foreground">{service.duration}</span>
                  </div>
                  <Button 
                    variant={service.popular ? "accent" : "outline"} 
                    size="sm" 
                    disabled={service.comingSoon || loadingService === service.serviceName}
                    onClick={() => {
                      if (service.comingSoon) return;
                      const dbService = dbServices.find(s => s.name === service.serviceName);
                      if (dbService) {
                        handleDirectCheckout(dbService.id, service.title);
                      }
                    }}
                  >
                    {loadingService === service.serviceName ? t('services.loading') || 'Loading...' : 
                     service.comingSoon ? t('services.coming_soon') : t('services.buy_now') || 'Buy Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>)}
        </div>


        {/* iPEN Add-on Service */}
        <div className="mt-16 bg-card border border-border rounded-lg p-6 shadow-card">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-accent text-accent-foreground rounded-lg flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground">{t('services.ipen.title')}</h4>
                <p className="text-sm text-muted-foreground">{t('services.ipen.description')}</p>
              </div>
            </div>
              <div className="flex items-center justify-center space-x-4">
                <span className="text-lg font-semibold text-primary">{t('services.ipen.price')}</span>
                <Badge variant="outline" className="bg-accent-muted text-accent-foreground border-accent">
                  {t('services.ipen.addon')}
                </Badge>
              </div>
          </div>
        </div>

        {/* Service Areas */}
        <div className="mt-16 text-center space-y-6">
          <h3 className="text-2xl font-semibold text-foreground">{t('services.areas.title')}</h3>
          <p className="text-muted-foreground">
            {t('services.areas.description')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[t('services.areas.scotch_plains'), t('services.areas.perth_amboy'), t('services.areas.new_brunswick'), t('services.areas.piscataway'), t('services.areas.plainfield'), t('services.areas.south_amboy')].map((area, index) => <Badge key={index} variant="secondary" className="px-4 py-2">
                {area}
              </Badge>)}
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mt-6">
            <Clock className="w-4 h-4" />
            <span>{t('services.areas.availability')} • {t('services.areas.same_day')}</span>
          </div>
        </div>
      </div>
    </section>;
}