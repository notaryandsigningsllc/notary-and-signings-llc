import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
export default function TestimonialsSection() {
  const {
    t
  } = useLanguage();
  const testimonials = [{
    name: t('testimonials.client1.name'),
    role: t('testimonials.client1.role'),
    content: t('testimonials.client1.content'),
    rating: 5,
    service: t('testimonials.client1.service')
  }, {
    name: t('testimonials.client2.name'),
    role: t('testimonials.client2.role'),
    content: t('testimonials.client2.content'),
    rating: 5,
    service: t('testimonials.client2.service')
  }, {
    name: t('testimonials.client3.name'),
    role: t('testimonials.client3.role'),
    content: t('testimonials.client3.content'),
    rating: 5,
    service: t('testimonials.client3.service')
  }, {
    name: t('testimonials.client4.name'),
    role: t('testimonials.client4.role'),
    content: t('testimonials.client4.content'),
    rating: 5,
    service: t('testimonials.client4.service')
  }, {
    name: t('testimonials.client6.name'),
    role: t('testimonials.client6.role'),
    content: t('testimonials.client6.content'),
    rating: 5,
    service: t('testimonials.client6.service')
  }];
  return <section id="testimonials" className="bg-background py-[40px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="bg-accent-muted text-accent-foreground border-accent">
            <User className="w-4 h-4 mr-2" />
            {t('testimonials.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t('testimonials.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => <Card key={index} className="relative transition-all duration-300 hover:shadow-elegant hover:-translate-y-1">
              <CardContent className="p-6 space-y-4">
                {/* Quote Icon */}
                <div className="flex justify-between items-start">
                  <Quote className="w-8 h-8 text-accent" />
                  <Badge variant="secondary" className="text-xs">
                    {testimonial.service}
                  </Badge>
                </div>

                {/* Rating */}
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
                </div>

                {/* Content */}
                <p className="text-muted-foreground leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="pt-4 border-t border-border">
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>)}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center space-y-8">
          <div className="bg-gradient-subtle rounded-2xl p-8 border border-border">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">{t('testimonials.stats.clients')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">5.0</div>
                <div className="text-sm text-muted-foreground">{t('testimonials.stats.rating')}</div>
                <div className="flex justify-center space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-accent text-accent" />)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">{t('testimonials.stats.professional')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">{t('testimonials.stats.satisfaction')}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-foreground">
              {t('testimonials.cta.title')}
            </h3>
            <p className="text-muted-foreground">
              {t('testimonials.cta.description')}
            </p>
          </div>
        </div>
      </div>
    </section>;
}