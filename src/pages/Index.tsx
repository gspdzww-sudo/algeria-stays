import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Destinations } from "@/components/Destinations";
import { FeaturedProperties } from "@/components/FeaturedProperties";
import { AlgeriaMap } from "@/components/AlgeriaMap";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

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
    </div>
  );
};

export default Index;
