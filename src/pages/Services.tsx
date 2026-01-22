import Navigation from "@/components/Navigation";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <ServicesSection />
        
        {/* Ad Unit - Below Services */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AdSense 
            adSlot="YOUR_AD_SLOT_SERVICES" 
            adFormat="horizontal" 
            className="my-4"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;