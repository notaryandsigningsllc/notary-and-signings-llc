import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  FileText,
  Shield,
  Award
} from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" }
  ];

  const services = [
    { name: "Mobile Notary", href: "#services" },
    { name: "Loan Signings", href: "#services" },
    { name: "Remote Notarization", href: "#services" },
    { name: "Apostille Services", href: "#services" },
    { name: "Fingerprinting", href: "#services" },
    { name: "Tax Preparation", href: "#services" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Notary & Signings LLC</h3>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                Professional notary services you can trust. Licensed, bonded, and insured 
                for your peace of mind. Serving the community with integrity and excellence.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-accent" />
                <span className="text-sm">(908) 514-8180</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-accent" />
                <span className="text-sm">info@notaryandsignings.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-sm">180 Talmadge Road, Unit 1380</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-sm">Edison, NJ 08817</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-sm">Mon-Fri: 8AM-8PM</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-8 h-8 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <nav className="space-y-3">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Our Services</h4>
            <nav className="space-y-3">
              {services.map((service, index) => (
                <a
                  key={index}
                  href={service.href}
                  className="block text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  {service.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Professional Info & CTA */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Professional Credentials</h4>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-accent" />
                <div>
                  <div className="text-sm font-medium">Licensed Notary</div>
                  <div className="text-xs text-primary-foreground/60">State Certified</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-accent" />
                <div>
                  <div className="text-sm font-medium">Bonded & Insured</div>
                  <div className="text-xs text-primary-foreground/60">$100K Coverage</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-accent" />
                <div>
                  <div className="text-sm font-medium">RON Certified</div>
                  <div className="text-xs text-primary-foreground/60">Remote Notarization</div>
                </div>
              </div>
            </div>

            {/* Professional Services */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 space-y-3">
              <h5 className="font-semibold text-accent">Professional Services</h5>
              <p className="text-xs text-primary-foreground/80">
                Licensed, bonded, and insured notary services with flexible scheduling.
              </p>
              <Button variant="accent" size="sm" className="w-full">
                Schedule Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-primary-foreground/60">
              © 2024 Notary and Signings LLC. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}