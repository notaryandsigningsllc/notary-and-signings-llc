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

export default function ServicesSection() {
  const services = [
    {
      icon: FileText,
      title: "Mobile Notary Services",
      description: "We come to you! Professional notary services at your location for maximum convenience.",
      features: ["Document Notarization", "Acknowledgments", "Jurats", "Copy Certifications"],
      price: "Starting at $25",
      popular: false
    },
    {
      icon: Home,
      title: "Loan Signing Services", 
      description: "Experienced loan signing agent for real estate transactions and refinancing.",
      features: ["Purchase Closings", "Refinance Documents", "HELOC Signings", "Reverse Mortgages"],
      price: "Starting at $150",
      popular: true
    },
    {
      icon: Laptop,
      title: "Remote Online Notarization",
      description: "RON/iPEN certified for secure online notarizations from anywhere.",
      features: ["Video Conference", "Digital Signatures", "Identity Verification", "Secure Platform"],
      price: "Starting at $35",
      popular: false
    },
    {
      icon: Globe,
      title: "Apostille Services",
      description: "Document authentication for international use and foreign countries.",
      features: ["State Apostilles", "Document Preparation", "Authentication", "International Shipping"],
      price: "Starting at $75",
      popular: false
    },
    {
      icon: Fingerprint,
      title: "Fingerprinting Services",
      description: "Professional fingerprinting for background checks and licensing.",
      features: ["Live Scan", "INK Cards", "Background Checks", "License Applications"],
      price: "Starting at $20",
      popular: false
    },
    {
      icon: DollarSign,
      title: "Tax Preparation",
      description: "Professional tax preparation services for individuals and small businesses.",
      features: ["Individual Returns", "Business Taxes", "E-Filing", "Tax Planning"],
      price: "Starting at $50",
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
            Our Services
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Comprehensive Professional Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From notarization to tax preparation, we provide trusted services 
            with the highest standards of professionalism and security.
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
                  Most Popular
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
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service Areas */}
        <div className="mt-16 text-center space-y-6">
          <h3 className="text-2xl font-semibold text-foreground">Service Areas</h3>
          <p className="text-muted-foreground">
            We proudly serve the following areas with mobile services available:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Scotch Plains", "Perth Amboy", "New Brunswick", "Piscataway", "Plainfield", "South Amboy"].map((area, index) => (
              <Badge key={index} variant="secondary" className="px-4 py-2">
                {area}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mt-6">
            <Clock className="w-4 h-4" />
            <span>Mobile services available within 25 miles • Same-day appointments</span>
          </div>
        </div>
      </div>
    </section>
  );
}