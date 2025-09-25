import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Phone, Calendar, Shield } from "lucide-react";
import heroImage from "@/assets/hero-notary.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
export default function HeroSection() {
  const {
    t
  } = useLanguage();
  const features = [t('hero.feature1'), t('hero.feature2'), t('hero.feature3'), t('hero.feature4')];
  return <section id="home" className="relative min-h-screen flex items-center bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[40px]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <Badge variant="outline" className="bg-accent-muted text-accent-foreground border-accent">
                <Shield className="w-4 h-4 mr-2" />
                {t('hero.badge')}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                {t('hero.title')}{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  {t('hero.title.highlight')}
                </span>{" "}
                {t('hero.title.end')}
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl">
                {t('hero.description')}
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-foreground font-medium">{feature}</span>
                </div>)}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="group">
                <Calendar className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                {t('hero.cta.book')}
              </Button>
              <Button variant="outline" size="xl">
                <Phone className="w-5 h-5 mr-2" />
                {t('hero.cta.phone')}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">{t('hero.stats.documents')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">{t('hero.stats.loans')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">{t('hero.stats.satisfaction')}</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden shadow-elegant">
              <img src={heroImage} alt={t('hero.image_alt') || "Professional notary services - official documents and seals"} className="w-full h-[600px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating Service Cards */}
            <div className="absolute -top-4 -right-4 bg-card border border-border rounded-lg p-4 shadow-card animate-scale-in">
              <div className="text-sm font-semibold text-primary">{t('hero.badge.licensed')}</div>
              <div className="text-xs text-muted-foreground">{t('hero.badge.licensed_desc')}</div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-lg p-4 shadow-card animate-slide-in-right">
              <div className="text-sm font-semibold text-accent">{t('hero.badge.ron')}</div>
              <div className="text-xs text-muted-foreground">{t('hero.badge.ron_desc')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}