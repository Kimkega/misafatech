import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  ChevronRight,
  Plus,
  Trash2,
  Info,
  Plug,
  BatteryCharging,
  Gauge,
  Thermometer,
  AirVent,
  Droplets
} from "lucide-react";

interface Appliance {
  id: string;
  name: string;
  icon: React.ElementType;
  watts: number;
  hoursPerDay: number;
  quantity?: number;
}

interface CustomAppliance {
  id: string;
  name: string;
  watts: number;
  hoursPerDay: number;
  quantity: number;
}

const defaultAppliances: Appliance[] = [
  { id: "led_bulbs", name: "LED Bulb (10W)", icon: Lightbulb, watts: 10, hoursPerDay: 6 },
  { id: "cfl_bulbs", name: "CFL Bulb (20W)", icon: Lightbulb, watts: 20, hoursPerDay: 6 },
  { id: "tv_32", name: "TV 32\"", icon: Tv, watts: 60, hoursPerDay: 5 },
  { id: "tv_55", name: "TV 55\"", icon: Tv, watts: 120, hoursPerDay: 5 },
  { id: "fan", name: "Ceiling Fan", icon: Fan, watts: 75, hoursPerDay: 8 },
  { id: "standing_fan", name: "Standing Fan", icon: AirVent, watts: 55, hoursPerDay: 8 },
  { id: "fridge_small", name: "Fridge (Small)", icon: Refrigerator, watts: 100, hoursPerDay: 24 },
  { id: "fridge_large", name: "Fridge (Large)", icon: Refrigerator, watts: 200, hoursPerDay: 24 },
  { id: "freezer", name: "Deep Freezer", icon: Thermometer, watts: 250, hoursPerDay: 24 },
  { id: "desktop", name: "Desktop Computer", icon: Monitor, watts: 200, hoursPerDay: 8 },
  { id: "laptop", name: "Laptop", icon: Laptop, watts: 50, hoursPerDay: 8 },
  { id: "phone_charger", name: "Phone Charger", icon: Smartphone, watts: 10, hoursPerDay: 3 },
  { id: "router", name: "WiFi Router", icon: Router, watts: 20, hoursPerDay: 24 },
  { id: "washing", name: "Washing Machine", icon: WashingMachine, watts: 500, hoursPerDay: 1 },
  { id: "microwave", name: "Microwave", icon: Microwave, watts: 1000, hoursPerDay: 0.5 },
  { id: "kettle", name: "Electric Kettle", icon: Coffee, watts: 1500, hoursPerDay: 0.25 },
  { id: "printer", name: "Printer", icon: Printer, watts: 50, hoursPerDay: 1 },
  { id: "iron", name: "Electric Iron", icon: Gauge, watts: 1200, hoursPerDay: 0.5 },
  { id: "water_heater", name: "Water Heater", icon: Droplets, watts: 2000, hoursPerDay: 1 },
  { id: "ac_1hp", name: "AC (1HP)", icon: AirVent, watts: 900, hoursPerDay: 6 },
  { id: "ac_2hp", name: "AC (2HP)", icon: AirVent, watts: 1800, hoursPerDay: 6 },
];

interface ContactInfo {
  whatsapp_number: string;
}

interface EnergyCalculatorProps {
  contactInfo: ContactInfo | null;
}

const EnergyCalculator = ({ contactInfo }: EnergyCalculatorProps) => {
  const [selectedAppliances, setSelectedAppliances] = useState<Map<string, number>>(new Map());
  const [customAppliances, setCustomAppliances] = useState<CustomAppliance[]>([]);
  const [newCustom, setNewCustom] = useState({ name: "", watts: "", hours: "", quantity: "1" });
  const [showResults, setShowResults] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [systemConfig, setSystemConfig] = useState({
    autonomyDays: 2,
    depthOfDischarge: 50,
    peakSunHours: 5,
    systemEfficiency: 80
  });

  const toggleAppliance = (id: string) => {
    const newMap = new Map(selectedAppliances);
    if (newMap.has(id)) {
      newMap.delete(id);
    } else {
      newMap.set(id, 1);
    }
    setSelectedAppliances(newMap);
    setShowResults(false);
  };

  const updateApplianceQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      const newMap = new Map(selectedAppliances);
      newMap.delete(id);
      setSelectedAppliances(newMap);
    } else {
      setSelectedAppliances(new Map(selectedAppliances).set(id, quantity));
    }
    setShowResults(false);
  };

  const addCustomAppliance = () => {
    if (!newCustom.name || !newCustom.watts || !newCustom.hours) return;
    
    const custom: CustomAppliance = {
      id: `custom_${Date.now()}`,
      name: newCustom.name,
      watts: parseFloat(newCustom.watts),
      hoursPerDay: parseFloat(newCustom.hours),
      quantity: parseInt(newCustom.quantity) || 1
    };
    
    setCustomAppliances([...customAppliances, custom]);
    setNewCustom({ name: "", watts: "", hours: "", quantity: "1" });
    setShowResults(false);
  };

  const removeCustomAppliance = (id: string) => {
    setCustomAppliances(customAppliances.filter(a => a.id !== id));
    setShowResults(false);
  };

  const calculateSystem = () => {
    let totalWattHours = 0;
    let peakWatts = 0;
    
    // Calculate from selected appliances
    selectedAppliances.forEach((quantity, id) => {
      const appliance = defaultAppliances.find(a => a.id === id);
      if (appliance) {
        const wh = appliance.watts * appliance.hoursPerDay * quantity;
        totalWattHours += wh;
        peakWatts += appliance.watts * quantity;
      }
    });

    // Calculate from custom appliances
    customAppliances.forEach(appliance => {
      const wh = appliance.watts * appliance.hoursPerDay * appliance.quantity;
      totalWattHours += wh;
      peakWatts += appliance.watts * appliance.quantity;
    });

    // System sizing calculations with configurable parameters
    const dailyEnergy = totalWattHours;
    const systemVoltage = dailyEnergy > 5000 ? 48 : dailyEnergy > 2000 ? 24 : 12;
    
    // Battery sizing
    const batteryCapacityWh = (dailyEnergy * systemConfig.autonomyDays) / (systemConfig.depthOfDischarge / 100);
    const batteryCapacityAh = Math.ceil(batteryCapacityWh / systemVoltage);
    const batteryCount = Math.ceil(batteryCapacityAh / 200);
    
    // Solar panel sizing
    const solarWatts = Math.ceil(dailyEnergy / (systemConfig.peakSunHours * (systemConfig.systemEfficiency / 100)));
    const panelCount = Math.ceil(solarWatts / 400);
    
    // Inverter sizing (1.25x peak load for surge capacity)
    const inverterSize = Math.ceil((peakWatts * 1.25) / 500) * 500;
    const inverterSizeKw = Math.max(1, Math.ceil(inverterSize / 1000));
    
    // Charge controller sizing (solar watts / voltage * 1.25 safety)
    const chargeController = Math.ceil((solarWatts / systemVoltage) * 1.25);

    // Cost estimates (rough KES pricing)
    const panelCost = panelCount * 15000;
    const batteryCost = batteryCount * 35000;
    const inverterCost = inverterSizeKw * 25000;
    const accessoriesCost = 20000;
    const totalCost = panelCost + batteryCost + inverterCost + accessoriesCost;

    return {
      dailyEnergy,
      peakWatts,
      systemVoltage,
      batteryCapacityAh,
      batteryCount,
      solarWatts,
      panelCount,
      inverterSize: inverterSizeKw * 1000,
      chargeController,
      estimatedCost: totalCost,
      monthlyProduction: Math.round((solarWatts * systemConfig.peakSunHours * 30) / 1000),
    };
  };

  const results = calculateSystem();

  const handleWhatsAppInquiry = () => {
    if (!contactInfo) return;
    
    const selectedNames: string[] = [];
    selectedAppliances.forEach((qty, id) => {
      const appliance = defaultAppliances.find(a => a.id === id);
      if (appliance) selectedNames.push(`${qty}x ${appliance.name}`);
    });
    customAppliances.forEach(a => {
      selectedNames.push(`${a.quantity}x ${a.name} (${a.watts}W)`);
    });
    
    const message = encodeURIComponent(
      `☀️ *SOLAR SYSTEM INQUIRY - Energy Calculator*\n\n` +
      `📊 *My Energy Requirements:*\n` +
      `• Daily consumption: ${(results.dailyEnergy / 1000).toFixed(2)} kWh\n` +
      `• Peak load: ${results.peakWatts}W\n` +
      `• Appliances: ${selectedNames.join(", ") || 'Custom setup'}\n\n` +
      `📦 *Recommended System:*\n` +
      `• Solar Panels: ${results.panelCount}x 400W (${results.solarWatts}W total)\n` +
      `• Batteries: ${results.batteryCount}x 200Ah ${results.systemVoltage}V\n` +
      `• Inverter: ${(results.inverterSize / 1000).toFixed(1)}kW\n` +
      `• Charge Controller: ${results.chargeController}A MPPT\n` +
      `• Est. Monthly Production: ${results.monthlyProduction} kWh\n\n` +
      `💰 Estimated Budget: KES ${results.estimatedCost.toLocaleString()}\n\n` +
      `I'd like to get a detailed quote for this solar system. Please advise on exact pricing and installation.`
    );
    
    const cleanNumber = contactInfo.whatsapp_number.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const totalSelectedCount = Array.from(selectedAppliances.values()).reduce((a, b) => a + b, 0) + customAppliances.reduce((a, c) => a + c.quantity, 0);

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 via-green-50/50 to-teal-50/30" id="calculator">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 text-yellow-700 mb-4">
            <Calculator className="w-5 h-5" />
            <span className="font-semibold">Smart Energy Calculator</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Design Your Off-Grid System
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select your appliances with quantities to calculate the exact solar system you need. Get personalized recommendations for panels, batteries, and inverters.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Appliance Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Standard Appliances */}
            <Card className="border-2 border-emerald-200/50 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Select Appliances
                  </div>
                  {totalSelectedCount > 0 && (
                    <Badge className="bg-emerald-500 text-white">
                      {totalSelectedCount} items
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {defaultAppliances.map((appliance) => {
                    const Icon = appliance.icon;
                    const isSelected = selectedAppliances.has(appliance.id);
                    const quantity = selectedAppliances.get(appliance.id) || 0;
                    
                    return (
                      <div
                        key={appliance.id}
                        className={`relative flex flex-col p-3 rounded-xl border-2 transition-all ${
                          isSelected 
                            ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                            : 'border-border hover:border-emerald-300 hover:bg-emerald-50/50'
                        }`}
                      >
                        <div 
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => toggleAppliance(appliance.id)}
                        >
                          <Checkbox checked={isSelected} className="pointer-events-none" />
                          <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{appliance.name}</p>
                            <p className="text-xs text-muted-foreground">{appliance.watts}W × {appliance.hoursPerDay}h</p>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-emerald-200">
                            <Label className="text-xs text-muted-foreground">Qty:</Label>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0"
                                onClick={(e) => { e.stopPropagation(); updateApplianceQuantity(appliance.id, quantity - 1); }}
                              >
                                -
                              </Button>
                              <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0"
                                onClick={(e) => { e.stopPropagation(); updateApplianceQuantity(appliance.id, quantity + 1); }}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Custom Appliances */}
            <Card className="border-2 border-dashed border-emerald-300/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Plus className="w-5 h-5 text-emerald-500" />
                  Add Custom Appliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="col-span-2 md:col-span-1">
                    <Label className="text-xs mb-1 block">Name</Label>
                    <Input
                      placeholder="e.g., Blender"
                      value={newCustom.name}
                      onChange={(e) => setNewCustom({ ...newCustom, name: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Watts (W) *</Label>
                    <Input
                      type="number"
                      placeholder="500"
                      value={newCustom.watts}
                      onChange={(e) => setNewCustom({ ...newCustom, watts: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Hours/Day *</Label>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="2"
                      value={newCustom.hours}
                      onChange={(e) => setNewCustom({ ...newCustom, hours: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newCustom.quantity}
                      onChange={(e) => setNewCustom({ ...newCustom, quantity: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={addCustomAppliance}
                      className="w-full h-9 bg-emerald-500 hover:bg-emerald-600 text-white"
                      disabled={!newCustom.name || !newCustom.watts || !newCustom.hours}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Custom appliances list */}
                {customAppliances.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {customAppliances.map((item) => (
                      <Badge 
                        key={item.id} 
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-700 gap-2 pr-1"
                      >
                        {item.quantity}x {item.name} ({item.watts}W × {item.hoursPerDay}h)
                        <button
                          onClick={() => removeCustomAppliance(item.id)}
                          className="p-0.5 hover:bg-emerald-200 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-700">
                    <strong>Tip:</strong> Check your appliance labels for wattage. For motors (pumps, compressors), multiply the rated watts by 3 for startup surge.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Card className="border border-border/50">
              <CardHeader className="pb-2">
                <button 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Gauge className="w-5 h-5 text-muted-foreground" />
                    Advanced Settings
                  </CardTitle>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
                </button>
              </CardHeader>
              {showAdvanced && (
                <CardContent className="pt-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-xs">Autonomy Days</Label>
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={systemConfig.autonomyDays}
                        onChange={(e) => setSystemConfig({ ...systemConfig, autonomyDays: parseInt(e.target.value) || 2 })}
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Depth of Discharge %</Label>
                      <Input
                        type="number"
                        min="30"
                        max="80"
                        value={systemConfig.depthOfDischarge}
                        onChange={(e) => setSystemConfig({ ...systemConfig, depthOfDischarge: parseInt(e.target.value) || 50 })}
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Peak Sun Hours</Label>
                      <Input
                        type="number"
                        min="3"
                        max="7"
                        step="0.5"
                        value={systemConfig.peakSunHours}
                        onChange={(e) => setSystemConfig({ ...systemConfig, peakSunHours: parseFloat(e.target.value) || 5 })}
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">System Efficiency %</Label>
                      <Input
                        type="number"
                        min="60"
                        max="95"
                        value={systemConfig.systemEfficiency}
                        onChange={(e) => setSystemConfig({ ...systemConfig, systemEfficiency: parseInt(e.target.value) || 80 })}
                        className="h-9"
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            <Button
              onClick={() => setShowResults(true)}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white gap-2 shadow-lg shadow-orange-500/30"
              size="lg"
              disabled={selectedAppliances.size === 0 && customAppliances.length === 0}
            >
              <Calculator className="w-5 h-5" />
              Calculate My Solar System
            </Button>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            <Card className={`border-2 ${showResults && results.dailyEnergy > 0 ? 'border-emerald-500 shadow-xl' : 'border-border'} sticky top-24`}>
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-green-500/10">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sun className="w-5 h-5 text-yellow-500" />
                  Your Solar System
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {!showResults || results.dailyEnergy === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sun className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Select appliances and click calculate to see your system</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Energy Summary */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200">
                        <p className="text-xs text-muted-foreground mb-1">Daily Usage</p>
                        <p className="text-xl font-bold text-foreground">
                          {(results.dailyEnergy / 1000).toFixed(1)} <span className="text-sm">kWh</span>
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                        <p className="text-xs text-muted-foreground mb-1">Peak Load</p>
                        <p className="text-xl font-bold text-foreground">
                          {results.peakWatts.toLocaleString()} <span className="text-sm">W</span>
                        </p>
                      </div>
                    </div>

                    {/* System Components */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                        <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md">
                          <Sun className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{results.panelCount}x Solar Panels</p>
                          <p className="text-sm text-muted-foreground">400W each ({results.solarWatts}W total)</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                        <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-md">
                          <Battery className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{results.batteryCount}x Batteries</p>
                          <p className="text-sm text-muted-foreground">200Ah {results.systemVoltage}V ({results.batteryCapacityAh}Ah total)</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                        <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-md">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{(results.inverterSize / 1000).toFixed(1)}kW Inverter</p>
                          <p className="text-sm text-muted-foreground">Pure sine wave recommended</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                        <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-md">
                          <BatteryCharging className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{results.chargeController}A MPPT</p>
                          <p className="text-sm text-muted-foreground">Charge Controller</p>
                        </div>
                      </div>
                    </div>

                    {/* Estimated Cost */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm opacity-90">Estimated Budget</p>
                        <Badge className="bg-white/20 text-white">Approximate</Badge>
                      </div>
                      <p className="text-2xl font-bold">
                        KES {results.estimatedCost.toLocaleString()}
                      </p>
                      <p className="text-xs opacity-80 mt-1">
                        ~{results.monthlyProduction} kWh monthly production
                      </p>
                    </div>

                    {/* CTA */}
                    <Button
                      onClick={handleWhatsAppInquiry}
                      className="w-full bg-green-500 hover:bg-green-600 text-white gap-2 shadow-lg"
                      size="lg"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Get Exact Quote on WhatsApp
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      *Estimates based on Kenya conditions. Actual requirements may vary based on location and usage patterns.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Custom Requirements CTA */}
        <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-emerald-100 via-green-50 to-teal-100 border border-emerald-200">
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
            className="gap-2 border-emerald-500 text-emerald-700 hover:bg-emerald-500 hover:text-white"
          >
            <MessageCircle className="w-4 h-4" />
            Chat with Our Energy Experts
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EnergyCalculator;