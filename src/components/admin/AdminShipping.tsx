import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Truck, MapPin, DollarSign, Clock, Plus, Pencil, Trash2, 
  Save, Loader2, Bus, Car, Package, Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  CARRIERS, KENYA_LOCATIONS, getCarrierTypeLabel, 
  type Carrier, type County 
} from "@/data/kenyaLocations";

interface ShippingZone {
  id: string;
  county: string;
  sub_county: string;
  town: string | null;
  courier_available: string[];
  delivery_fee: number;
  estimated_days: number;
}

const AdminShipping = () => {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCounty, setSelectedCounty] = useState<string>("all");
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fee modifiers state
  const [feeModifiers, setFeeModifiers] = useState({
    nairobiMultiplier: 1,
    nearbyMultiplier: 1.1,
    mediumMultiplier: 1.3,
    coastalMultiplier: 1.5,
    remoteMultiplier: 2,
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("delivery_zones")
      .select("*")
      .order("county", { ascending: true });
    
    if (data) setZones(data);
    if (error) console.error("Error fetching zones:", error);
    setLoading(false);
  };

  const filteredZones = useMemo(() => {
    return zones.filter(zone => {
      const matchesSearch = searchTerm === "" || 
        zone.county.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zone.sub_county.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (zone.town && zone.town.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCounty = selectedCounty === "all" || zone.county === selectedCounty;
      return matchesSearch && matchesCounty;
    });
  }, [zones, searchTerm, selectedCounty]);

  const handleSaveZone = async (zone: ShippingZone) => {
    setSaving(true);
    
    if (zone.id) {
      const { error } = await supabase
        .from("delivery_zones")
        .update({
          courier_available: zone.courier_available,
          delivery_fee: zone.delivery_fee,
          estimated_days: zone.estimated_days,
        })
        .eq("id", zone.id);
      
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Updated", description: "Shipping zone updated!" });
        fetchZones();
      }
    } else {
      const { error } = await supabase
        .from("delivery_zones")
        .insert([{
          county: zone.county,
          sub_county: zone.sub_county,
          town: zone.town,
          courier_available: zone.courier_available,
          delivery_fee: zone.delivery_fee,
          estimated_days: zone.estimated_days,
        }]);
      
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Added", description: "Shipping zone created!" });
        fetchZones();
      }
    }
    
    setSaving(false);
    setIsDialogOpen(false);
    setEditingZone(null);
  };

  const handleDeleteZone = async (id: string) => {
    if (!confirm("Delete this shipping zone?")) return;
    
    const { error } = await supabase
      .from("delivery_zones")
      .delete()
      .eq("id", id);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Zone removed" });
      fetchZones();
    }
  };

  const bulkImportFromLocations = async () => {
    setSaving(true);
    let imported = 0;
    
    for (const county of KENYA_LOCATIONS) {
      for (const subCounty of county.subCounties) {
        for (const town of subCounty.towns) {
          const existingZone = zones.find(
            z => z.county === county.name && 
                 z.sub_county === subCounty.name && 
                 z.town === town.name
          );
          
          if (!existingZone) {
            // Calculate default fee based on location
            let baseFee = 350;
            if (county.name === "Nairobi") baseFee = 150;
            else if (["Kiambu", "Machakos", "Kajiado"].includes(county.name)) baseFee = 250;
            else if (["Mombasa", "Kilifi", "Kwale"].includes(county.name)) baseFee = 400;
            else if (["Turkana", "Marsabit", "Mandera", "Wajir", "Garissa"].includes(county.name)) baseFee = 600;

            const { error } = await supabase
              .from("delivery_zones")
              .insert([{
                county: county.name,
                sub_county: subCounty.name,
                town: town.name,
                courier_available: town.couriers,
                delivery_fee: baseFee,
                estimated_days: county.name === "Nairobi" ? 1 : 3,
              }]);
            
            if (!error) imported++;
          }
        }
      }
    }
    
    toast({ title: "Import Complete", description: `Imported ${imported} new zones` });
    fetchZones();
    setSaving(false);
  };

  const getCarrierIcon = (type: Carrier['type']) => {
    switch (type) {
      case 'courier': return <Package className="w-4 h-4" />;
      case 'matatu': return <Car className="w-4 h-4" />;
      case 'bus': return <Bus className="w-4 h-4" />;
    }
  };

  const getCarrierBadgeColor = (type: Carrier['type']) => {
    switch (type) {
      case 'courier': return 'bg-blue-100 text-blue-800';
      case 'matatu': return 'bg-green-100 text-green-800';
      case 'bus': return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Shipping Management</h2>
          <p className="text-muted-foreground">Configure delivery zones, carriers, and fees</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={bulkImportFromLocations}
            disabled={saving}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            Import All Locations
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingZone(null);
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-green-500">
                <Plus className="w-4 h-4 mr-2" /> Add Zone
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <ZoneEditor 
                zone={editingZone}
                onSave={handleSaveZone}
                saving={saving}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="zones" className="space-y-4">
        <TabsList>
          <TabsTrigger value="zones" className="gap-2">
            <MapPin className="w-4 h-4" /> Delivery Zones
          </TabsTrigger>
          <TabsTrigger value="carriers" className="gap-2">
            <Truck className="w-4 h-4" /> Carriers
          </TabsTrigger>
        </TabsList>

        {/* Zones Tab */}
        <TabsContent value="zones" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search zones..." 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by County" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Counties</SelectItem>
                    {KENYA_LOCATIONS.map(c => (
                      <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Zones Table */}
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location</TableHead>
                      <TableHead>Carriers</TableHead>
                      <TableHead className="text-right">Fee (KES)</TableHead>
                      <TableHead className="text-right">Days</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : filteredZones.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No zones found. Click "Import All Locations" to add zones.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredZones.map(zone => (
                        <TableRow key={zone.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{zone.county}</p>
                              <p className="text-sm text-muted-foreground">
                                {zone.sub_county}{zone.town && ` • ${zone.town}`}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {zone.courier_available.slice(0, 3).map(carrierId => {
                                const carrier = CARRIERS.find(c => c.id === carrierId);
                                if (!carrier) return null;
                                return (
                                  <Badge 
                                    key={carrierId} 
                                    variant="secondary" 
                                    className={`text-xs ${getCarrierBadgeColor(carrier.type)}`}
                                  >
                                    {carrier.name}
                                  </Badge>
                                );
                              })}
                              {zone.courier_available.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{zone.courier_available.length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {zone.delivery_fee.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {zone.estimated_days}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  setEditingZone(zone);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteZone(zone.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Carriers Tab */}
        <TabsContent value="carriers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Courier Services */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="w-5 h-5 text-blue-500" />
                  Courier Services
                </CardTitle>
                <CardDescription>Professional courier companies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {CARRIERS.filter(c => c.type === 'courier').map(carrier => (
                  <div key={carrier.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{carrier.name}</span>
                      <Badge variant="outline">KES {carrier.baseFee}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{carrier.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Matatu Saccos */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Car className="w-5 h-5 text-green-500" />
                  Matatu Saccos
                </CardTitle>
                <CardDescription>Regional matatu operators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ScrollArea className="h-[400px]">
                  {CARRIERS.filter(c => c.type === 'matatu').map(carrier => (
                    <div key={carrier.id} className="p-3 border rounded-lg mb-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{carrier.name}</span>
                        <Badge variant="outline">KES {carrier.baseFee}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{carrier.description}</p>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Bus Companies */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bus className="w-5 h-5 text-purple-500" />
                  Bus Companies
                </CardTitle>
                <CardDescription>Long-distance bus services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ScrollArea className="h-[400px]">
                  {CARRIERS.filter(c => c.type === 'bus').map(carrier => (
                    <div key={carrier.id} className="p-3 border rounded-lg mb-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{carrier.name}</span>
                        <Badge variant="outline">KES {carrier.baseFee}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{carrier.description}</p>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Zone Editor Component
interface ZoneEditorProps {
  zone: ShippingZone | null;
  onSave: (zone: ShippingZone) => void;
  saving: boolean;
}

const ZoneEditor = ({ zone, onSave, saving }: ZoneEditorProps) => {
  const [formData, setFormData] = useState<ShippingZone>({
    id: zone?.id || "",
    county: zone?.county || "",
    sub_county: zone?.sub_county || "",
    town: zone?.town || "",
    courier_available: zone?.courier_available || [],
    delivery_fee: zone?.delivery_fee || 300,
    estimated_days: zone?.estimated_days || 3,
  });

  const selectedCountyData = KENYA_LOCATIONS.find(c => c.name === formData.county);
  const selectedSubCountyData = selectedCountyData?.subCounties.find(s => s.name === formData.sub_county);

  const toggleCarrier = (carrierId: string) => {
    setFormData(prev => ({
      ...prev,
      courier_available: prev.courier_available.includes(carrierId)
        ? prev.courier_available.filter(c => c !== carrierId)
        : [...prev.courier_available, carrierId]
    }));
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{zone ? "Edit Zone" : "Add Shipping Zone"}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>County</Label>
            <Select 
              value={formData.county} 
              onValueChange={v => setFormData({...formData, county: v, sub_county: "", town: ""})}
              disabled={!!zone}
            >
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {KENYA_LOCATIONS.map(c => (
                  <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Sub-County</Label>
            <Select 
              value={formData.sub_county} 
              onValueChange={v => setFormData({...formData, sub_county: v, town: ""})}
              disabled={!formData.county || !!zone}
            >
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {selectedCountyData?.subCounties.map(s => (
                  <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Town (Optional)</Label>
          <Select 
            value={formData.town || ""} 
            onValueChange={v => setFormData({...formData, town: v})}
            disabled={!formData.sub_county || !!zone}
          >
            <SelectTrigger><SelectValue placeholder="All towns" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All towns</SelectItem>
              {selectedSubCountyData?.towns.map(t => (
                <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Delivery Fee (KES)
            </Label>
            <Input 
              type="number"
              value={formData.delivery_fee}
              onChange={e => setFormData({...formData, delivery_fee: Number(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> Estimated Days
            </Label>
            <Input 
              type="number"
              value={formData.estimated_days}
              onChange={e => setFormData({...formData, estimated_days: Number(e.target.value)})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Available Carriers</Label>
          <ScrollArea className="h-[200px] border rounded-lg p-3">
            <div className="space-y-2">
              {CARRIERS.map(carrier => (
                <div 
                  key={carrier.id}
                  className="flex items-center justify-between p-2 border rounded hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleCarrier(carrier.id)}
                >
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={formData.courier_available.includes(carrier.id)}
                      onCheckedChange={() => toggleCarrier(carrier.id)}
                    />
                    <span className="font-medium text-sm">{carrier.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {getCarrierTypeLabel(carrier.type)}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    KES {carrier.baseFee}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <DialogFooter>
        <Button onClick={() => onSave(formData)} disabled={saving || !formData.county || !formData.sub_county}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Zone
        </Button>
      </DialogFooter>
    </>
  );
};

export default AdminShipping;
