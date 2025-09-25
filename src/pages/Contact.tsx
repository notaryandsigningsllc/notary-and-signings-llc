import Navigation from "@/components/Navigation";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;