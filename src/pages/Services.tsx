import Navigation from "@/components/Navigation";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Services;