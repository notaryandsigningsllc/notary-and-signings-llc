import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar,
  Send,
  MessageSquare
} from "lucide-react";

export default function ContactSection() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      content: "(908) 514-8180",
      description: "Call us for immediate assistance"
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@notaryandsignings.com",
      description: "Send us your questions anytime"
    },
    {
      icon: MapPin,
      title: "Service Area",
      content: "Edison, NJ & Surrounding Areas",
      description: "Mobile services within 25 miles"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Sun: 8AM-8PM",
      description: "Emergency services available 24/7"
    }
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "8:00 AM - 8:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 5:00 PM" },
    { day: "Sunday", hours: "By Appointment Only" },
    { day: "Emergency Services", hours: "Available 24/7" }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="bg-accent-muted text-accent-foreground border-accent">
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact Us
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Get In Touch Today
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to schedule your appointment? Contact us today for professional notary 
            services, tax preparation, or any questions about our offerings.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-foreground flex items-center">
                  <Calendar className="w-6 h-6 mr-3 text-accent" />
                  Schedule Your Appointment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">First Name</label>
                    <Input placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Last Name</label>
                    <Input placeholder="Enter your last name" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input type="email" placeholder="your.email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Phone</label>
                    <Input type="tel" placeholder="(555) 123-4567" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Service Needed</label>
                  <select className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm">
                    <option value="">Select a service</option>
                    <option value="mobile-notary">Mobile Notary</option>
                    <option value="loan-signing">Loan Signing</option>
                    <option value="ron">Remote Online Notarization</option>
                    <option value="apostille">Apostille Services</option>
                    <option value="fingerprinting">Fingerprinting</option>
                    <option value="tax-prep">Tax Preparation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Preferred Date</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Preferred Time</label>
                    <select className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm">
                      <option value="">Select time</option>
                      <option value="morning">Morning (8AM-12PM)</option>
                      <option value="afternoon">Afternoon (12PM-5PM)</option>
                      <option value="evening">Evening (5PM-8PM)</option>
                      <option value="emergency">Emergency/After Hours</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Message</label>
                  <Textarea 
                    placeholder="Please provide details about your notary needs, number of documents, location preferences, or any special requirements..."
                    rows={4}
                  />
                </div>

                <Button variant="hero" size="lg" className="w-full">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message & Schedule Appointment
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  We'll respond within 2 hours during business hours. Emergency services available 24/7.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <Card key={index} className="transition-all duration-300 hover:shadow-card">
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
                </Card>
              ))}
            </div>

            {/* Business Hours */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-accent" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {businessHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <span className="text-sm font-medium text-foreground">{schedule.day}</span>
                    <span className="text-sm text-muted-foreground">{schedule.hours}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-4">
              <Button variant="outline" size="lg" className="w-full">
                <Phone className="w-5 h-5 mr-2" />
                Call Now: (908) 514-8180
              </Button>
              <Button variant="accent" size="lg" className="w-full">
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </Button>
            </div>

            {/* Emergency Notice */}
            <Card className="bg-accent-muted border-accent">
              <CardContent className="p-6 text-center space-y-2">
                <h4 className="font-semibold text-accent-foreground">Emergency Services</h4>
                <p className="text-sm text-accent-foreground">
                  Need urgent notary services? We offer 24/7 emergency appointments 
                  for time-sensitive documents.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}