import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ShippingBanner from "@/components/ShippingBanner";
import TodaysDeals from "@/components/TodaysDeals";
import FeaturedProducts from "@/components/FeaturedProducts";
import ProductsSection from "@/components/ProductsSection";
import EnergyCalculator from "@/components/EnergyCalculator";
import Features from "@/components/Features";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

interface ContactInfo {
  whatsapp_number: string;
}

const Index = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    const { data } = await supabase
      .from("contact_info")
      .select("whatsapp_number")
      .limit(1)
      .single();
    if (data) setContactInfo(data);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ShippingBanner />
      <div id="deals">
        <TodaysDeals />
      </div>
      <FeaturedProducts />
      <ProductsSection />
      <EnergyCalculator contactInfo={contactInfo} />
      <Features />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;