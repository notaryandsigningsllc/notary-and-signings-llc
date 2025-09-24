import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  Plus, 
  Minus, 
  Phone, 
  Mail, 
  MessageSquare,
  Shield,
  Clock,
  FileText,
  Users
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function FAQs() {
  const { t } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqCategories = [
    {
      title: t('faqs.general.title'),
      icon: HelpCircle,
      faqs: [
        {
          question: t('faqs.general.q1.question'),
          answer: t('faqs.general.q1.answer')
        },
        {
          question: t('faqs.general.q2.question'),
          answer: t('faqs.general.q2.answer')
        },
        {
          question: t('faqs.general.q3.question'),
          answer: t('faqs.general.q3.answer')
        },
        {
          question: t('faqs.general.q4.question'),
          answer: t('faqs.general.q4.answer')
        }
      ]
    },
    {
      title: t('faqs.mobile.title'),
      icon: Users,
      faqs: [
        {
          question: t('faqs.mobile.q1.question'),
          answer: t('faqs.mobile.q1.answer')
        },
        {
          question: t('faqs.mobile.q2.question'),
          answer: t('faqs.mobile.q2.answer')
        },
        {
          question: t('faqs.mobile.q3.question'),
          answer: t('faqs.mobile.q3.answer')
        }
      ]
    },
    {
      title: t('faqs.ron.title'),
      icon: Shield,
      faqs: [
        {
          question: t('faqs.ron.q1.question'),
          answer: t('faqs.ron.q1.answer')
        },
        {
          question: t('faqs.ron.q2.question'),
          answer: t('faqs.ron.q2.answer')
        },
        {
          question: t('faqs.ron.q3.question'),
          answer: t('faqs.ron.q3.answer')
        }
      ]
    },
    {
      title: t('faqs.loan.title'),
      icon: FileText,
      faqs: [
        {
          question: t('faqs.loan.q1.question'),
          answer: t('faqs.loan.q1.answer')
        },
        {
          question: t('faqs.loan.q2.question'),
          answer: t('faqs.loan.q2.answer')
        },
        {
          question: t('faqs.loan.q3.question'),
          answer: t('faqs.loan.q3.answer')
        }
      ]
    },
    {
      title: t('faqs.pricing.title'),
      icon: Clock,
      faqs: [
        {
          question: t('faqs.pricing.q1.question'),
          answer: t('faqs.pricing.q1.answer')
        },
        {
          question: t('faqs.pricing.q2.question'),
          answer: t('faqs.pricing.q2.answer')
        },
        {
          question: t('faqs.pricing.q3.question'),
          answer: t('faqs.pricing.q3.answer')
        }
      ]
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="bg-accent-muted text-accent-foreground border-accent mb-6">
              <HelpCircle className="w-4 h-4 mr-2" />
              {t('faqs.badge')}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t('faqs.title')}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {t('faqs.subtitle')}
            </p>

            {/* Quick Contact */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                <Phone className="w-5 h-5 mr-2" />
                {t('hero.cta.phone')}
              </Button>
              <Button variant="outline" size="lg">
                <Mail className="w-5 h-5 mr-2" />
                {t('contact.info.email')}
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                    <category.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{category.title}</h2>
                </div>

                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 10 + faqIndex;
                    const isOpen = openFAQ === globalIndex;
                    
                    return (
                      <Card key={faqIndex} className="transition-all duration-300 hover:shadow-card">
                        <CardContent className="p-0">
                          <button
                            onClick={() => toggleFAQ(globalIndex)}
                            className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-muted/50"
                          >
                            <h3 className="text-lg font-semibold text-foreground pr-4">
                              {faq.question}
                            </h3>
                            {isOpen ? (
                              <Minus className="w-5 h-5 text-accent flex-shrink-0" />
                            ) : (
                              <Plus className="w-5 h-5 text-accent flex-shrink-0" />
                            )}
                          </button>
                          
                          {isOpen && (
                            <div className="px-6 pb-6 pt-0">
                              <div className="border-t border-border pt-4">
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gradient-subtle">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-elegant">
              <MessageSquare className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('faqs.contact.title')}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t('faqs.contact.description')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg">
                  <Phone className="w-5 h-5 mr-2" />
                  {t('contact.form.submit')}
                </Button>
                <Button variant="outline" size="lg">
                  <Mail className="w-5 h-5 mr-2" />
                  {t('footer.schedule')}
                </Button>
              </div>

              <div className="mt-6 text-sm text-muted-foreground">
                <p>{t('contact.form.response')}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}