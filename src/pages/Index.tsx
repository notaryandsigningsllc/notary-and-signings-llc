import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        
        {/* Ad Unit - Below Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <AdSense 
            adSlot="YOUR_AD_SLOT_ID_1" 
            adFormat="horizontal" 
            className="my-4"
          />
        </div>
        
        <AboutSection />
        <ServicesSection />
        
        {/* Ad Unit - Between Services and Testimonials */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <AdSense 
            adSlot="YOUR_AD_SLOT_ID_2" 
            adFormat="auto" 
            className="my-4"
          />
        </div>
        
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
