import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Destinations } from "@/components/Destinations";
import { FeaturedProperties } from "@/components/FeaturedProperties";
import { AlgeriaMap } from "@/components/AlgeriaMap";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { InfoButton } from "@/components/InfoButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Destinations />
      <FeaturedProperties />
      <AlgeriaMap />
      <Features />
      <Footer />
      <InfoButton />
    </div>
  );
};

export default Index;
