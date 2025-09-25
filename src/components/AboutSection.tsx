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
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutSection() {
  const { t } = useLanguage();
  
  const credentials = [
    {
      icon: Award,
      title: t('about.certification.title'),
      description: t('about.certification.description'),
      link: "https://www.findanotary.com/profile/161942176",
      linkText: t('about.verify_credentials')
    },
    {
      icon: Building,
      title: t('about.loan_signing.title'),
      description: t('about.loan_signing.description'),
      link: "https://www.signingagent.com/profile/161942176",
      linkText: t('about.verify_signing_agent')
    }
  ];

  const stats = [
    { value: "1+", label: t('about.stats.experience'), icon: Clock },
    { value: "500+", label: t('about.stats.documents'), icon: CheckCircle },
    { value: "50+", label: t('hero.stats.loans'), icon: Building },
    { value: "100%", label: t('about.stats.satisfaction'), icon: Star }
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
                {t('about.badge')}
              </Badge>
              
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {t('about.title')}
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('about.description')}
              </p>
            </div>

            {/* Mission Statement */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-card">
              <h3 className="text-xl font-semibold text-foreground mb-3">{t('about.mission.title')}</h3>
              <p className="text-muted-foreground">
                {t('about.mission.description')}
              </p>
            </div>

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
                    <div className="space-y-2 flex-1">
                      <h4 className="font-semibold text-foreground">{credential.title}</h4>
                      <p className="text-sm text-muted-foreground">{credential.description}</p>
                      {credential.link && (
                        <a 
                          href={credential.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-accent hover:text-accent-foreground transition-colors"
                        >
                          {credential.linkText}
                          <span className="ml-1">→</span>
                        </a>
                      )}
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
              {t('about.why_choose.title')}
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('about.why_choose.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t('about.why_choose.excellence.title'),
                description: t('about.why_choose.excellence.description'),
                icon: Award
              },
              {
                title: t('about.why_choose.convenience.title'),
                description: t('about.why_choose.convenience.description'),
                icon: Clock
              },
              {
                title: t('about.why_choose.trust.title'),
                description: t('about.why_choose.trust.description'),
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