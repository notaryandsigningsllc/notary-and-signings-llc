import Navigation from "@/components/Navigation";
import TikTokLogoProcessor from "@/components/TikTokLogoProcessor";
import Footer from "@/components/Footer";

const ImageProcessor = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="py-12">
        <TikTokLogoProcessor />
      </main>
      <Footer />
    </div>
  );
};

export default ImageProcessor;