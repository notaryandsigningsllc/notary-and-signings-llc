import Navigation from "@/components/Navigation";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import StickyAdSidebar from "@/components/StickyAdSidebar";

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 min-w-0">
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
        
        {/* Sticky Sidebar Ad - Only visible on xl screens */}
        <StickyAdSidebar adSlot="YOUR_AD_SLOT_SERVICES_SIDEBAR" className="mr-4" />
      </div>
      <Footer />
    </div>
  );
};

export default Services;