import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Home, 
  Laptop, 
  DollarSign, 
  Fingerprint, 
  Globe,
  Clock,
  Shield,
  CheckCircle
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ServicesSection() {
  const { t } = useLanguage();
  
  const services = [
    {
      icon: FileText,
      title: t('services.mobile.title'),
      description: t('services.mobile.description'),
      features: [t('services.mobile.feature1'), t('services.mobile.feature2'), t('services.mobile.feature3'), t('services.mobile.feature4')],
      price: t('services.mobile.price'),
      popular: false
    },
    {
      icon: Home,
      title: t('services.loan.title'), 
      description: t('services.loan.description'),
      features: [t('services.loan.feature1'), t('services.loan.feature2'), t('services.loan.feature3'), t('services.loan.feature4')],
      price: t('services.loan.price'),
      popular: true
    },
    {
      icon: Laptop,
      title: t('services.ron.title'),
      description: t('services.ron.description'),
      features: [t('services.ron.feature1'), t('services.ron.feature2'), t('services.ron.feature3'), t('services.ron.feature4')],
      price: t('services.ron.price'),
      popular: false
    },
    {
      icon: Globe,
      title: t('services.apostille.title'),
      description: t('services.apostille.description'),
      features: [t('services.apostille.feature1'), t('services.apostille.feature2'), t('services.apostille.feature3'), t('services.apostille.feature4')],
      price: t('services.apostille.price'),
      popular: false
    },
    {
      icon: Fingerprint,
      title: t('services.fingerprint.title'),
      description: t('services.fingerprint.description'),
      features: [t('services.fingerprint.feature1'), t('services.fingerprint.feature2'), t('services.fingerprint.feature3'), t('services.fingerprint.feature4')],
      price: t('services.fingerprint.price'),
      popular: false
    },
    {
      icon: DollarSign,
      title: t('services.tax.title'),
      description: t('services.tax.description'),
      features: [t('services.tax.feature1'), t('services.tax.feature2'), t('services.tax.feature3'), t('services.tax.feature4')],
      price: t('services.tax.price'),
      popular: false
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
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
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={`relative transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 ${
                service.popular ? 'border-accent shadow-card' : ''
              }`}
            >
              {service.popular && (
                <Badge 
                  variant="outline" 
                  className="absolute -top-3 left-4 bg-accent text-accent-foreground border-accent"
                >
                  {t('services.popular')}
                </Badge>
              )}
              
              <CardHeader className="space-y-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  service.popular ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'
                }`}>
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
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-lg font-semibold text-primary">{service.price}</span>
                  <Button 
                    variant={service.popular ? "accent" : "outline"} 
                    size="sm"
                  >
                    {t('services.learn')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service Areas */}
        <div className="mt-16 text-center space-y-6">
          <h3 className="text-2xl font-semibold text-foreground">{t('services.areas.title')}</h3>
          <p className="text-muted-foreground">
            {t('services.areas.description')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[t('services.areas.scotch_plains'), t('services.areas.perth_amboy'), t('services.areas.new_brunswick'), t('services.areas.piscataway'), t('services.areas.plainfield'), t('services.areas.south_amboy')].map((area, index) => (
              <Badge key={index} variant="secondary" className="px-4 py-2">
                {area}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mt-6">
            <Clock className="w-4 h-4" />
            <span>{t('services.areas.availability')} • {t('services.areas.same_day')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}