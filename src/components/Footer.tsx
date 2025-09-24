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
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  
  const quickLinks = [
    { name: t('nav.home'), href: "/" },
    { name: t('nav.about'), href: "/#about" },
    { name: t('nav.services'), href: "/#services" },
    { name: t('nav.testimonials'), href: "/#testimonials" },
    { name: t('nav.faqs'), href: "/faqs" },
    { name: t('nav.contact'), href: "/#contact" }
  ];

  const services = [
    { name: t('services.mobile.title'), href: "#services" },
    { name: t('services.loan.title'), href: "#services" },
    { name: t('services.ron.title'), href: "#services" },
    { name: t('services.apostille.title'), href: "#services" },
    { name: t('services.fingerprint.title'), href: "#services" },
    { name: t('services.tax.individual.title'), href: "#services" }
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
              <h3 className="text-2xl font-bold mb-2">{t('footer.company')}</h3>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                {t('footer.description')}
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
            <h4 className="text-lg font-semibold">{t('footer.quick_links')}</h4>
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
            <h4 className="text-lg font-semibold">{t('footer.services')}</h4>
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
            <h4 className="text-lg font-semibold">{t('footer.credentials')}</h4>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-accent" />
                <div>
                  <div className="text-sm font-medium">{t('footer.licensed')}</div>
                  <div className="text-xs text-primary-foreground/60">{t('footer.licensed_desc')}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-accent" />
                <div>
                  <div className="text-sm font-medium">{t('footer.bonded')}</div>
                  <div className="text-xs text-primary-foreground/60">{t('footer.bonded_desc')}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-accent" />
                <div>
                  <div className="text-sm font-medium">{t('footer.ron_certified')}</div>
                  <div className="text-xs text-primary-foreground/60">{t('footer.ron_desc')}</div>
                </div>
              </div>
            </div>

            {/* Professional Services */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 space-y-3">
              <h5 className="font-semibold text-accent">{t('footer.professional_services')}</h5>
              <p className="text-xs text-primary-foreground/80">
                {t('footer.professional_desc')}
              </p>
              <Button variant="accent" size="sm" className="w-full">
                {t('footer.schedule')}
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
              {t('footer.copyright')}
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                {t('footer.privacy')}
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                {t('footer.terms')}
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                {t('footer.cookies')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}