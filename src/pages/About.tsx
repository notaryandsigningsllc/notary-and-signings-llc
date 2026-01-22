import Navigation from "@/components/Navigation";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import AdSense from "@/components/AdSense";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
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
      <Footer />
    </div>
  );
};

export default About;