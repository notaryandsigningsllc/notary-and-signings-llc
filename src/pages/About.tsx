import Navigation from "@/components/Navigation";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";
import StickyAdSidebar from "@/components/StickyAdSidebar";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <AboutSection />
          
          {/* Ad Unit - Below About */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <AdSense 
              adSlot="YOUR_AD_SLOT_ABOUT" 
              adFormat="horizontal" 
              className="my-4"
            />
          </div>
        </main>
        
        {/* Sticky Sidebar Ad - Only visible on xl screens */}
        <StickyAdSidebar adSlot="YOUR_AD_SLOT_ABOUT_SIDEBAR" className="mr-4" />
      </div>
      <Footer />
    </div>
  );
};

export default About;