import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Sun, 
  Battery, 
  Zap, 
  Calculator, 
  MessageCircle, 
  Lightbulb,
  Tv,
  Fan,
  Refrigerator,
  Monitor,
  Laptop,
  Smartphone,
  WashingMachine,
  Microwave,
  Coffee,
  Router,
  Printer,
  ChevronRight
} from "lucide-react";

interface Appliance {
  id: string;
  name: string;
  icon: React.ElementType;
  watts: number;
  hoursPerDay: number;
}

const defaultAppliances: Appliance[] = [
  { id: "led_bulbs", name: "LED Bulbs (10W each)", icon: Lightbulb, watts: 50, hoursPerDay: 6 },
  { id: "tv", name: "TV (32-55\")", icon: Tv, watts: 100, hoursPerDay: 5 },
  { id: "fan", name: "Ceiling Fan", icon: Fan, watts: 75, hoursPerDay: 8 },
  { id: "fridge", name: "Refrigerator", icon: Refrigerator, watts: 150, hoursPerDay: 24 },
  { id: "desktop", name: "Desktop Computer", icon: Monitor, watts: 200, hoursPerDay: 8 },
  { id: "laptop", name: "Laptop", icon: Laptop, watts: 50, hoursPerDay: 8 },
  { id: "phone_charger", name: "Phone Chargers (x3)", icon: Smartphone, watts: 30, hoursPerDay: 4 },
  { id: "router", name: "WiFi Router", icon: Router, watts: 20, hoursPerDay: 24 },
  { id: "washing", name: "Washing Machine", icon: WashingMachine, watts: 500, hoursPerDay: 1 },
  { id: "microwave", name: "Microwave", icon: Microwave, watts: 1000, hoursPerDay: 0.5 },
  { id: "kettle", name: "Electric Kettle", icon: Coffee, watts: 1500, hoursPerDay: 0.25 },
  { id: "printer", name: "Printer", icon: Printer, watts: 50, hoursPerDay: 1 },
];

interface ContactInfo {
  whatsapp_number: string;
}

interface EnergyCalculatorProps {
  contactInfo: ContactInfo | null;
}

const EnergyCalculator = ({ contactInfo }: EnergyCalculatorProps) => {
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const [customWatts, setCustomWatts] = useState("");
  const [customHours, setCustomHours] = useState("");
  const [showResults, setShowResults] = useState(false);

  const toggleAppliance = (id: string) => {
    setSelectedAppliances(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const calculateSystem = () => {
    let totalWattHours = 0;
    
    selectedAppliances.forEach(id => {
      const appliance = defaultAppliances.find(a => a.id === id);
      if (appliance) {
        totalWattHours += appliance.watts * appliance.hoursPerDay;
      }
    });

    // Add custom appliance
    if (customWatts && customHours) {
      totalWattHours += parseFloat(customWatts) * parseFloat(customHours);
    }

    // System sizing calculations
    const dailyEnergy = totalWattHours; // Wh per day
    const systemVoltage = dailyEnergy > 5000 ? 48 : dailyEnergy > 2000 ? 24 : 12;
    
    // Battery sizing (2 days autonomy, 50% DoD)
    const batteryCapacityAh = Math.ceil((dailyEnergy * 2) / (systemVoltage * 0.5));
    const batteryCount = Math.ceil(batteryCapacityAh / 200); // 200Ah batteries
    
    // Solar panel sizing (5 peak sun hours, 80% efficiency)
    const solarWatts = Math.ceil(dailyEnergy / (5 * 0.8));
    const panelCount = Math.ceil(solarWatts / 400); // 400W panels
    
    // Inverter sizing (1.25x peak load)
    const peakLoad = selectedAppliances.reduce((max, id) => {
      const appliance = defaultAppliances.find(a => a.id === id);
      return appliance ? Math.max(max, appliance.watts) : max;
    }, 0);
    const totalPeakLoad = selectedAppliances.reduce((sum, id) => {
      const appliance = defaultAppliances.find(a => a.id === id);
      return appliance ? sum + appliance.watts : sum;
    }, 0);
    const inverterSize = Math.ceil((totalPeakLoad * 1.25) / 1000) * 1000;

    return {
      dailyEnergy,
      systemVoltage,
      batteryCapacityAh,
      batteryCount,
      solarWatts,
      panelCount,
      inverterSize,
    };
  };

  const results = calculateSystem();

  const handleWhatsAppInquiry = () => {
    if (!contactInfo) return;
    
    const selectedNames = selectedAppliances
      .map(id => defaultAppliances.find(a => a.id === id)?.name)
      .filter(Boolean)
      .join(", ");
    
    const message = encodeURIComponent(
      `☀️ *SOLAR SYSTEM INQUIRY - MISAFA Technologies*\n\n` +
      `📊 *My Energy Requirements:*\n` +
      `• Daily consumption: ${results.dailyEnergy.toLocaleString()} Wh\n` +
      `• Appliances: ${selectedNames || 'Custom setup'}\n\n` +
      `📦 *Recommended System:*\n` +
      `• Solar Panels: ${results.panelCount}x 400W (${results.solarWatts}W total)\n` +
      `• Batteries: ${results.batteryCount}x 200Ah ${results.systemVoltage}V\n` +
      `• Inverter: ${(results.inverterSize / 1000).toFixed(1)}kW\n\n` +
      `I'd like to get a quote for this solar system. Please advise on pricing and installation.`
    );
    
    const cleanNumber = contactInfo.whatsapp_number.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <section className="py-16 bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-background" id="calculator">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-600 mb-4">
            <Calculator className="w-5 h-5" />
            <span className="font-semibold">Energy Calculator</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Go Off-Grid Today
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select your appliances to calculate the solar system you need. Get personalized recommendations for panels, batteries, and inverters.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Appliance Selection */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Select Your Appliances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {defaultAppliances.map((appliance) => {
                    const Icon = appliance.icon;
                    const isSelected = selectedAppliances.includes(appliance.id);
                    return (
                      <div
                        key={appliance.id}
                        onClick={() => toggleAppliance(appliance.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-yellow-500 bg-yellow-500/10' 
                            : 'border-border hover:border-yellow-500/50'
                        }`}
                      >
                        <Checkbox checked={isSelected} className="pointer-events-none" />
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{appliance.name}</p>
                          <p className="text-xs text-muted-foreground">{appliance.watts}W × {appliance.hoursPerDay}h</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Appliance */}
                <div className="mt-6 p-4 rounded-xl border-2 border-dashed border-border">
                  <Label className="text-sm font-medium mb-3 block">Add Custom Appliance</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="number"
                        placeholder="Watts (e.g., 500)"
                        value={customWatts}
                        onChange={(e) => setCustomWatts(e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Hours per day"
                        value={customHours}
                        onChange={(e) => setCustomHours(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setShowResults(true)}
                  className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white gap-2"
                  size="lg"
                >
                  <Calculator className="w-5 h-5" />
                  Calculate My System
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            <Card className={`border-2 ${showResults && results.dailyEnergy > 0 ? 'border-yellow-500' : 'border-border'} sticky top-24`}>
              <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sun className="w-5 h-5 text-yellow-500" />
                  Your Solar System
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {!showResults || results.dailyEnergy === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sun className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Select appliances to see your recommended solar system</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Daily Consumption */}
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Daily Consumption</p>
                      <p className="text-2xl font-bold text-foreground">
                        {(results.dailyEnergy / 1000).toFixed(1)} kWh
                      </p>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
                        <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                          <Sun className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{results.panelCount}x Solar Panels</p>
                          <p className="text-sm text-muted-foreground">400W each ({results.solarWatts}W total)</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                          <Battery className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{results.batteryCount}x Batteries</p>
                          <p className="text-sm text-muted-foreground">200Ah {results.systemVoltage}V each</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                          <Zap className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{(results.inverterSize / 1000).toFixed(1)}kW Inverter</p>
                          <p className="text-sm text-muted-foreground">Pure sine wave recommended</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button
                      onClick={handleWhatsAppInquiry}
                      className="w-full bg-green-500 hover:bg-green-600 text-white gap-2"
                      size="lg"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Get Quote on WhatsApp
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      *Estimates based on 5 peak sun hours. Actual requirements may vary.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Custom Requirements */}
        <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20">
          <h3 className="font-display text-xl font-bold text-foreground mb-2">
            Need a Custom Solution?
          </h3>
          <p className="text-muted-foreground mb-4">
            For complex installations, large commercial projects, or specific requirements
          </p>
          <Button
            onClick={() => {
              if (!contactInfo) return;
              const cleanNumber = contactInfo.whatsapp_number.replace(/[^0-9]/g, '');
              window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent("Hi! I need a custom solar solution. Can you help me design a system for my specific requirements?")}`, '_blank');
            }}
            variant="outline"
            className="gap-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
          >
            <MessageCircle className="w-4 h-4" />
            Chat with Our Experts
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EnergyCalculator;