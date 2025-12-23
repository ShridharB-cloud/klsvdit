import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { RolesSection } from "@/components/landing/RolesSection";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <RolesSection />
        <ProcessSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
