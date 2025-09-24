import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, User } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Real Estate Agent",
      content: "Notary and Signings LLC has been our go-to for all loan signings. Their professionalism and attention to detail is outstanding. They make the closing process smooth for our clients.",
      rating: 5,
      service: "Loan Signing"
    },
    {
      name: "Michael Chen",
      role: "Small Business Owner",
      content: "The mobile notary service saved me so much time. They came to my office within 2 hours and handled all my business documents professionally. Highly recommend!",
      rating: 5,
      service: "Mobile Notary"
    },
    {
      name: "Lisa Rodriguez",
      role: "Working Professional",
      content: "Remote online notarization was perfect for my situation. The video call was secure and professional, and I received my notarized documents immediately. Great service!",
      rating: 5,
      service: "RON Service"
    },
    {
      name: "David Thompson",
      role: "Retiree",
      content: "Needed my tax return prepared and documents notarized. They handled everything with care and explained each step. Trustworthy and reliable service.",
      rating: 5,
      service: "Tax Preparation"
    },
    {
      name: "Jennifer Park",
      role: "Healthcare Worker",
      content: "Fast fingerprinting service for my license renewal. Professional setup and quick turnaround. They made the process easy and stress-free.",
      rating: 5,
      service: "Fingerprinting"
    },
    {
      name: "Robert Williams",
      role: "International Student",
      content: "Needed apostille services for my documents to be used abroad. They handled the entire process and kept me updated throughout. Excellent service!",
      rating: 5,
      service: "Apostille"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="bg-accent-muted text-accent-foreground border-accent">
            <User className="w-4 h-4 mr-2" />
            Client Testimonials
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            What Our Clients Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our valued clients have to say 
            about their experience with our professional services.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="relative transition-all duration-300 hover:shadow-elegant hover:-translate-y-1"
            >
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
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
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
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center space-y-8">
          <div className="bg-gradient-subtle rounded-2xl p-8 border border-border">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">5.0</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
                <div className="flex justify-center space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Professional Service</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-foreground">
              Ready to Experience Professional Service?
            </h3>
            <p className="text-muted-foreground">
              Join hundreds of satisfied clients who trust us with their important documents.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}