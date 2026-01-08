import { ArrowRight, Shield, Zap, Cpu, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-hero">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,200,200,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,200,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm font-medium text-primary-foreground">
                #1 Tech Solutions in Kenya
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
              Powering &{" "}
              <span className="text-gradient">Protecting</span>{" "}
              Your World
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg text-primary-foreground/70 mb-8 max-w-xl mx-auto lg:mx-0">
              Smart security, clean energy & automation solutions for homes, businesses & industries.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a href="#products">
                <Button size="lg" className="gap-2 bg-gradient-accent hover:opacity-90 text-primary-foreground shadow-glow w-full sm:w-auto">
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <a href="#contact">
                <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto">
                  Get Quote
                </Button>
              </a>
            </div>
          </div>

          {/* Right - Feature Cards */}
          <div className="flex-1 grid grid-cols-2 gap-4 max-w-md">
            {[
              { icon: Shield, title: "Security", desc: "CCTV & Alarms" },
              { icon: Zap, title: "Solar Power", desc: "Clean Energy" },
              { icon: Cpu, title: "Automation", desc: "Smart Control" },
              { icon: Wifi, title: "Networking", desc: "WiFi & IT" },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-5 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 hover:border-secondary/50 hover:bg-primary-foreground/10 transition-all duration-300 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center mb-3 group-hover:bg-secondary/30 transition-colors">
                  <feature.icon className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-semibold text-primary-foreground text-sm mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-primary-foreground/60">
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
