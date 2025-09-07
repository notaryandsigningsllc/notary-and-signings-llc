import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Shield, 
  Users, 
  Clock, 
  Star,
  CheckCircle,
  BookOpen,
  Building
} from "lucide-react";

export default function AboutSection() {
  const credentials = [
    {
      icon: Award,
      title: "Licensed Notary Public",
      description: "State certified and commissioned notary with current credentials"
    },
    {
      icon: Shield,
      title: "Bonded & Insured",
      description: "$100,000 professional liability insurance for your protection"
    },
    {
      icon: BookOpen,
      title: "RON Certified",
      description: "Remote Online Notarization certified through approved platforms"
    },
    {
      icon: Building,
      title: "Loan Signing Agent",
      description: "NNA certified loan signing agent with extensive real estate experience"
    }
  ];

  const stats = [
    { value: "5+", label: "Years Experience", icon: Clock },
    { value: "500+", label: "Documents Notarized", icon: CheckCircle },
    { value: "50+", label: "Loan Signings", icon: Building },
    { value: "100%", label: "Client Satisfaction", icon: Star }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="bg-accent-muted text-accent-foreground border-accent">
                <Users className="w-4 h-4 mr-2" />
                About Us
              </Badge>
              
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Professional Excellence in{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Notary Services
                </span>
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Notary and Signings LLC, we bring over 5 years of dedicated experience 
                in providing professional notary and document services. Our commitment to 
                excellence, attention to detail, and client-focused approach has made us 
                a trusted partner for individuals and businesses alike.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                We understand that your time is valuable, which is why we offer flexible 
                scheduling, mobile services, and remote online notarization to meet your 
                needs wherever and whenever you need us.
              </p>
            </div>

            {/* Mission Statement */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-card">
              <h3 className="text-xl font-semibold text-foreground mb-3">Our Mission</h3>
              <p className="text-muted-foreground">
                To provide reliable, professional, and convenient notary services while 
                maintaining the highest standards of integrity and confidentiality. We 
                strive to make document notarization accessible and stress-free for every client.
              </p>
            </div>

            <Button variant="hero" size="lg">
              <Shield className="w-5 h-5 mr-2" />
              View Our Credentials
            </Button>
          </div>

          {/* Credentials & Stats */}
          <div className="space-y-8">
            {/* Credentials Grid */}
            <div className="grid gap-6">
              {credentials.map((credential, index) => (
                <Card key={index} className="transition-all duration-300 hover:shadow-card">
                  <CardContent className="flex items-start space-x-4 p-6">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3 flex-shrink-0">
                      <credential.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground">{credential.title}</h4>
                      <p className="text-sm text-muted-foreground">{credential.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center p-6 transition-all duration-300 hover:shadow-card">
                  <CardContent className="space-y-2 p-0">
                    <stat.icon className="w-8 h-8 text-accent mx-auto" />
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-20 text-center space-y-12">
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              Why Choose Notary and Signings LLC?
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our dedication to professional excellence and client satisfaction sets us apart.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Professional Excellence",
                description: "Licensed, bonded, and insured with continuous education and training",
                icon: Award
              },
              {
                title: "Convenient Service",
                description: "Mobile services, flexible scheduling, and remote notarization options",
                icon: Clock
              },
              {
                title: "Trusted Partnership",
                description: "Confidential, reliable service with a focus on building long-term relationships",
                icon: Shield
              }
            ].map((feature, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold text-foreground">{feature.title}</h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}