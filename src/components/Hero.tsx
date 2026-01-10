import { useState, useEffect } from "react";
import { ArrowRight, Shield, Zap, Cpu, Wifi, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  price: number;
}

interface SiteSettings {
  site_name: string;
  tagline: string | null;
}

const Hero = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchSettings();
  }, []);

  useEffect(() => {
    if (featuredProducts.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredProducts.length]);

  const fetchFeaturedProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("id, name, image_url, price")
      .eq("is_featured", true)
      .limit(5);
    if (data) setFeaturedProducts(data);
  };

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("site_name, tagline")
      .limit(1)
      .single();
    if (data) setSettings(data);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background - Featured Products Slideshow */}
      <div className="absolute inset-0">
        {featuredProducts.length > 0 ? (
          <>
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-hero" />
                )}
              </div>
            ))}
            {/* Smooth Green Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-secondary/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-transparent to-primary/60" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-transparent to-teal-800/20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-emerald-800 to-teal-700" />
        )}
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Floating Orbs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-green-300/10 rounded-full blur-2xl animate-float" />
      </div>

      {/* Slide Navigation */}
      {featuredProducts.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span className="text-sm font-medium text-white">
                #1 Tech Solutions in Kenya
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {settings?.tagline?.split(' ').slice(0, 2).join(' ') || 'Powering &'}{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent">
                {settings?.tagline?.split(' ').slice(2, 3).join(' ') || 'Protecting'}
              </span>{" "}
              <br className="hidden md:block" />
              Your World
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
              Smart security, clean energy, tech gadgets & automation solutions for homes, businesses & industries.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <a href="#products">
                <Button 
                  size="lg" 
                  className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg shadow-emerald-500/30 text-lg px-8 py-6 w-full sm:w-auto border-0"
                >
                  Explore Products
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <a href="#calculator">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 text-lg px-8 py-6 w-full sm:w-auto backdrop-blur-sm"
                >
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <span>Energy Calculator</span>
                </Button>
              </a>
            </div>

            {/* Current Product Info */}
            {featuredProducts.length > 0 && featuredProducts[currentSlide] && (
              <Link to={`/product/${featuredProducts[currentSlide].id}`}>
                <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/20 ring-2 ring-emerald-400/50">
                    {featuredProducts[currentSlide].image_url && (
                      <img
                        src={featuredProducts[currentSlide].image_url}
                        alt={featuredProducts[currentSlide].name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-emerald-300 mb-1">✨ Featured Product</p>
                    <p className="font-semibold text-white">{featuredProducts[currentSlide].name}</p>
                    <p className="text-emerald-300 font-bold">KES {featuredProducts[currentSlide].price.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            )}

            {/* Slide Indicators */}
            {featuredProducts.length > 1 && (
              <div className="flex gap-2 justify-center lg:justify-start mt-6">
                {featuredProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide 
                        ? 'w-8 bg-emerald-400' 
                        : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right - Feature Cards */}
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto lg:ml-auto">
            {[
              { icon: Shield, title: "Security", desc: "CCTV, Alarms & Access Control", color: "from-blue-500 to-cyan-500" },
              { icon: Zap, title: "Solar Power", desc: "Panels, Batteries & Inverters", color: "from-yellow-400 to-orange-500" },
              { icon: Cpu, title: "Computers", desc: "Laptops, Desktops & Accessories", color: "from-violet-500 to-purple-600" },
              { icon: Wifi, title: "Networking", desc: "WiFi, Routers & IT Solutions", color: "from-emerald-400 to-green-500" },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 animate-slide-up hover:border-emerald-400/50"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/70">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;