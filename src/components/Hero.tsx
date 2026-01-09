import { useState, useEffect } from "react";
import { ArrowRight, Shield, Zap, Cpu, Wifi, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  price: number;
}

const Hero = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchFeaturedProducts();
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
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-primary/50" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-hero" />
        )}
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,200,200,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,200,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Slide Navigation */}
      {featuredProducts.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm font-medium text-primary-foreground">
                #1 Tech Solutions in Kenya
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Powering &{" "}
              <span className="text-gradient">Protecting</span>{" "}
              Your World
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl mx-auto lg:mx-0">
              Smart security, clean energy & automation solutions for homes, businesses & industries.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <a href="#products">
                <Button size="lg" className="gap-2 bg-gradient-accent hover:opacity-90 text-primary-foreground shadow-glow text-lg px-8 py-6 w-full sm:w-auto">
                  Explore Products
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <a href="#calculator">
                <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6 w-full sm:w-auto">
                  <Zap className="w-5 h-5" />
                  Solar Calculator
                </Button>
              </a>
            </div>

            {/* Current Product Info */}
            {featuredProducts.length > 0 && featuredProducts[currentSlide] && (
              <Link to={`/product/${featuredProducts[currentSlide].id}`}>
                <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors cursor-pointer">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-primary-foreground/20">
                    {featuredProducts[currentSlide].image_url && (
                      <img
                        src={featuredProducts[currentSlide].image_url}
                        alt={featuredProducts[currentSlide].name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-primary-foreground/60 mb-1">Featured Product</p>
                    <p className="font-semibold text-primary-foreground">{featuredProducts[currentSlide].name}</p>
                    <p className="text-secondary font-bold">KES {featuredProducts[currentSlide].price.toLocaleString()}</p>
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
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide 
                        ? 'w-8 bg-secondary' 
                        : 'bg-primary-foreground/30 hover:bg-primary-foreground/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right - Feature Cards */}
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto lg:ml-auto">
            {[
              { icon: Shield, title: "Security", desc: "CCTV, Alarms & Access Control", color: "from-blue-500 to-blue-600" },
              { icon: Zap, title: "Solar Power", desc: "Panels, Batteries & Inverters", color: "from-yellow-500 to-orange-500" },
              { icon: Cpu, title: "Automation", desc: "Smart Home & Building Control", color: "from-purple-500 to-pink-500" },
              { icon: Wifi, title: "Networking", desc: "WiFi, Routers & IT Solutions", color: "from-green-500 to-emerald-500" },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all duration-300 cursor-pointer hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-primary-foreground text-lg mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-primary-foreground/70">
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