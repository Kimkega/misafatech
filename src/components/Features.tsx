import { Shield, Sun, Cpu, Wifi, Settings, Car, Home, Building2, Factory, Sprout } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Smart Security Systems",
    description: "CCTV cameras, alarm systems, biometric access control, and 24/7 monitoring solutions.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Sun,
    title: "Solar & Clean Energy",
    description: "Solar panels, inverters, batteries, and complete off-grid power solutions.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Cpu,
    title: "Automation & Control",
    description: "Smart home systems, industrial automation, PLCs, and IoT solutions.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Wifi,
    title: "Networking Solutions",
    description: "Enterprise routers, managed switches, structured cabling, and WiFi installations.",
    color: "from-green-500 to-teal-500",
  },
  {
    icon: Settings,
    title: "Industrial Machinery",
    description: "Commercial equipment, factory machines, and maintenance services.",
    color: "from-gray-500 to-slate-500",
  },
  {
    icon: Car,
    title: "Smart Mobility & GPS",
    description: "Vehicle tracking, fleet management, and smart transportation systems.",
    color: "from-red-500 to-rose-500",
  },
];

const targetAudience = [
  { icon: Home, text: "Homeowners" },
  { icon: Building2, text: "Businesses & Offices" },
  { icon: Sprout, text: "Farms & Agriculture" },
  { icon: Factory, text: "Factories & Industries" },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            What We Offer
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Complete Technology Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From installation to maintenance, we provide end-to-end technology 
            services tailored for your specific needs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group bg-card border-border hover:border-secondary/50 transition-all duration-300 hover:shadow-card overflow-hidden"
            >
              <CardContent className="p-6">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Target Audience */}
        <div className="bg-gradient-primary rounded-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
              Who We Serve
            </h3>
            <p className="text-primary-foreground/70">
              Technology solutions designed for every sector
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {targetAudience.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-secondary" />
                </div>
                <span className="text-sm font-medium text-primary-foreground">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
