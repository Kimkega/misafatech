import { Truck, Shield, Clock, Headphones } from "lucide-react";

const ShippingBanner = () => {
  const features = [
    { icon: Truck, text: "Countrywide Shipping" },
    { icon: Shield, text: "Genuine Products" },
    { icon: Clock, text: "Fast Delivery" },
    { icon: Headphones, text: "24/7 Support" },
  ];

  return (
    <div className="bg-gradient-to-r from-secondary to-accent py-3 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-primary-foreground">
              <feature.icon className="w-4 h-4" />
              <span className="text-sm font-medium whitespace-nowrap">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShippingBanner;