import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { KENYA_LOCATIONS, COURIER_INFO, getDeliveryFee, getEstimatedDays } from "@/data/kenyaLocations";
import { Loader2, MapPin, Truck, CreditCard, CheckCircle, MessageCircle, User, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartCheckout = ({ isOpen, onClose }: CartCheckoutProps) => {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "", phone: "", email: "",
    county: "", subCounty: "", town: "",
    courier: "", paymentMethod: "manual"
  });

  const [contactInfo, setContactInfo] = useState<any>(null);
  const [mpesaSettings, setMpesaSettings] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        supabase.from("contact_info").select("*").limit(1).single(),
        supabase.from("mpesa_settings").select("*").limit(1).single(),
      ]).then(([contactRes, mpesaRes]) => {
        if (contactRes.data) setContactInfo(contactRes.data);
        if (mpesaRes.data) setMpesaSettings(mpesaRes.data);
      });
    }
  }, [isOpen]);

  const selectedCounty = useMemo(() => KENYA_LOCATIONS.find(c => c.name === formData.county), [formData.county]);
  const selectedSubCounty = useMemo(() => selectedCounty?.subCounties.find(s => s.name === formData.subCounty), [selectedCounty, formData.subCounty]);
  const selectedTown = useMemo(() => selectedSubCounty?.towns.find(t => t.name === formData.town), [selectedSubCounty, formData.town]);
  
  const deliveryFee = formData.courier && formData.county ? getDeliveryFee(formData.county, formData.courier) : 0;
  const estimatedDays = formData.courier && formData.county ? getEstimatedDays(formData.county, formData.courier) : 0;
  const grandTotal = totalPrice + deliveryFee;

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.county) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const productNames = items.map(i => `${i.product?.name} x${i.quantity}`).join(", ");
      const { data, error } = await supabase.from("orders").insert({
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email || null,
        product_name: productNames,
        quantity: items.reduce((sum, i) => sum + i.quantity, 0),
        total_amount: grandTotal,
        payment_method: formData.paymentMethod,
        county: formData.county,
        sub_county: formData.subCounty,
        town: formData.town,
        courier: formData.courier,
        delivery_fee: deliveryFee,
        estimated_delivery: `${estimatedDays} days`,
        shipping_address: `${formData.town}, ${formData.subCounty}, ${formData.county}`,
        order_number: `ORD-${Date.now()}`,
      } as any).select("id, order_number").single();

      if (error) throw error;
      setOrderNumber(data.order_number);

      // Send SMS notification for order placed
      try {
        await supabase.functions.invoke("send-sms", {
          body: {
            phone: formData.phone,
            message: `Hi ${formData.name}! Your order ${data.order_number} (KES ${grandTotal.toLocaleString()}) has been placed. Delivery to ${formData.town}, ${formData.county} via ${formData.courier}. Est: ${estimatedDays} days. Thank you!`,
            orderId: data.id,
            type: "order_placed"
          }
        });
      } catch (smsError) {
        console.error("SMS notification failed:", smsError);
      }

      await clearCart();
      setOrderComplete(true);
      setStep(4);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppConfirm = () => {
    if (!contactInfo) return;
    const message = encodeURIComponent(`🧾 Order: ${orderNumber}\n💰 Total: KES ${grandTotal.toLocaleString()}\n📍 Delivery: ${formData.town}, ${formData.county}\n🚚 Courier: ${formData.courier}\n\nI have completed payment. Please confirm.`);
    window.open(`https://wa.me/${contactInfo.whatsapp_number.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {orderComplete ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Truck className="w-5 h-5" />}
            {orderComplete ? "Order Placed!" : `Checkout - Step ${step}/3`}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Customer Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><User className="w-4 h-4" /> Full Name *</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Phone className="w-4 h-4" /> Phone *</Label>
              <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="0712 345 678" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
              <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
            </div>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600" onClick={() => setStep(2)} disabled={!formData.name || !formData.phone}>
              Continue to Delivery
            </Button>
          </div>
        )}

        {/* Step 2: Delivery Location */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><MapPin className="w-4 h-4" /> County *</Label>
              <Select value={formData.county} onValueChange={v => setFormData({...formData, county: v, subCounty: "", town: "", courier: ""})}>
                <SelectTrigger><SelectValue placeholder="Select County" /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {KENYA_LOCATIONS.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {selectedCounty && (
              <div className="space-y-2">
                <Label>Sub-County *</Label>
                <Select value={formData.subCounty} onValueChange={v => setFormData({...formData, subCounty: v, town: "", courier: ""})}>
                  <SelectTrigger><SelectValue placeholder="Select Sub-County" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {selectedCounty.subCounties.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            {selectedSubCounty && (
              <div className="space-y-2">
                <Label>Town/Area *</Label>
                <Select value={formData.town} onValueChange={v => setFormData({...formData, town: v, courier: ""})}>
                  <SelectTrigger><SelectValue placeholder="Select Town" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {selectedSubCounty.towns.map(t => <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            {selectedTown && selectedTown.couriers.length > 0 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Truck className="w-4 h-4" /> Courier *</Label>
                <RadioGroup value={formData.courier} onValueChange={v => setFormData({...formData, courier: v})} className="space-y-2">
                  {selectedTown.couriers.map(c => (
                    <div key={c} className="flex items-center space-x-3 p-3 border rounded-lg hover:border-emerald-400">
                      <RadioGroupItem value={c} id={c} />
                      <Label htmlFor={c} className="flex-1 cursor-pointer">
                        <div className="font-medium">{COURIER_INFO[c]?.name || c}</div>
                        <div className="text-xs text-muted-foreground">{COURIER_INFO[c]?.description}</div>
                        <div className="text-sm font-bold text-emerald-600 mt-1">KES {getDeliveryFee(formData.county, c)} • {getEstimatedDays(formData.county, c)} days</div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600" onClick={() => setStep(3)} disabled={!formData.courier}>
                Continue to Payment
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="space-y-4">
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal:</span><span>KES {totalPrice.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Delivery ({formData.courier}):</span><span>KES {deliveryFee.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total:</span><span className="text-emerald-600">KES {grandTotal.toLocaleString()}</span></div>
              </CardContent>
            </Card>
            {contactInfo && (
              <Card className="border-dashed">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">M-Pesa Payment</h4>
                  {contactInfo.till_number && <p className="text-sm">Till Number: <strong>{contactInfo.till_number}</strong></p>}
                  {contactInfo.paybill_number && <p className="text-sm">Paybill: <strong>{contactInfo.paybill_number}</strong> Acc: {contactInfo.account_number}</p>}
                  <p className="text-xs text-amber-600 mt-2">Pay KES {grandTotal.toLocaleString()} then place order</p>
                </CardContent>
              </Card>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600" onClick={handleSubmit} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Place Order"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && orderComplete && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold">Order Placed!</h3>
            <p className="text-muted-foreground">Order #{orderNumber}</p>
            <p className="text-sm">Delivery to {formData.town}, {formData.county} via {formData.courier}</p>
            <p className="text-sm text-emerald-600 font-medium">Estimated: {estimatedDays} days</p>
            <Button onClick={handleWhatsAppConfirm} className="w-full bg-green-500 hover:bg-green-600 gap-2">
              <MessageCircle className="w-4 h-4" /> Confirm via WhatsApp
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CartCheckout;
