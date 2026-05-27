import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ShoppingCart, CreditCard, Phone, User, Mail, MapPin, Truck,
  Loader2, CheckCircle, AlertCircle, Copy, MessageCircle, Smartphone, FileText, ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { KENYA_LOCATIONS, COURIER_INFO, getDeliveryFee, getEstimatedDays } from "@/data/kenyaLocations";
import { createOrderItems, notifySuppliersForOrder } from "@/lib/orderAutomation";

interface Product { id: string; name: string; price: number; image_url: string | null; supplier_email?: string | null; }
interface CheckoutProps { product: Product; isOpen: boolean; onClose: () => void; }

const Checkout = ({ product, isOpen, onClose }: CheckoutProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stkLoading, setStkLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [mpesaSettings, setMpesaSettings] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "", phone: "", email: "",
    county: "", subCounty: "", town: "", courier: "",
    quantity: 1, paymentMethod: "manual", notes: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    Promise.all([
      supabase.from("contact_info").select("*").limit(1).single(),
      supabase.from("mpesa_settings").select("*").limit(1).single(),
    ]).then(([c, m]) => {
      if (c.data) setContactInfo(c.data);
      if (m.data) {
        setMpesaSettings(m.data);
        setFormData(p => ({ ...p, paymentMethod: m.data.is_enabled ? "stk" : "manual" }));
      }
    });
  }, [isOpen]);

  const selCounty = useMemo(() => KENYA_LOCATIONS.find(c => c.name === formData.county), [formData.county]);
  const selSub = useMemo(() => selCounty?.subCounties.find(s => s.name === formData.subCounty), [selCounty, formData.subCounty]);
  const selTown = useMemo(() => selSub?.towns.find(t => t.name === formData.town), [selSub, formData.town]);

  const productSubtotal = product.price * formData.quantity;
  const deliveryFee = formData.courier && formData.county ? getDeliveryFee(formData.county, formData.courier) : 0;
  const estDays = formData.courier && formData.county ? getEstimatedDays(formData.county, formData.courier) : 0;
  const totalAmount = productSubtotal + deliveryFee;

  const invoiceUrl = orderNumber ? `${window.location.origin}/invoice/${orderNumber}` : "";

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.county) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.from("orders").insert({
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email || null,
        product_id: product.id,
        product_name: product.name,
        quantity: formData.quantity,
        total_amount: totalAmount,
        payment_method: formData.paymentMethod,
        shipping_address: [formData.town, formData.subCounty, formData.county].filter(Boolean).join(", "),
        county: formData.county,
        sub_county: formData.subCounty || null,
        town: formData.town || null,
        courier: formData.courier || null,
        delivery_fee: deliveryFee,
        estimated_delivery: estDays ? `${estDays} days` : null,
        notes: formData.notes || null,
        payment_status: "pending",
        order_status: "pending",
        order_number: `ORD-${Date.now()}`,
      } as any).select("id, order_number").single();

      if (error) throw error;
      setOrderId(data.id);
      setOrderNumber(data.order_number);

      const invUrl = `${window.location.origin}/invoice/${data.order_number}`;
      const productUrl = `${window.location.origin}/product/${product.id}`;
      const lines = [{ productId: product.id, productName: product.name, supplierEmail: product.supplier_email || null, quantity: formData.quantity, unitPrice: product.price }];
      await createOrderItems(data.id, lines);
      await notifySuppliersForOrder({ orderId: data.id, orderNumber: data.order_number, customerName: formData.name, total: totalAmount, origin: window.location.origin, lines });

      // SMS with invoice link
      try {
        await supabase.functions.invoke("send-sms", {
          body: {
            phone: formData.phone,
            message: `Hi ${formData.name}! Order ${data.order_number} for ${product.name} (KES ${totalAmount.toLocaleString()}) received. Pay/view invoice: ${invUrl}`,
            orderId: data.id,
            type: "order_placed",
          },
        });
      } catch (e) { console.error("SMS failed", e); }

      if (formData.paymentMethod === "stk" && mpesaSettings?.is_enabled) {
        await triggerSTK(data.id, data.order_number);
      } else {
        setOrderComplete(true);
        setStep(4);
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const triggerSTK = async (oId: string, oNum: string) => {
    setStkLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("mpesa-stk-push", {
        body: { phone: formData.phone, amount: totalAmount, orderId: oId, accountReference: oNum.substring(0, 12) },
      });
      if (error) throw error;
      if (data?.success) {
        toast({ title: "STK Push Sent!", description: "Check your phone for the M-Pesa prompt." });
        setOrderComplete(true);
        setStep(4);
      } else throw new Error(data?.error || "STK failed");
    } catch (e: any) {
      toast({ title: "STK Failed", description: e.message, variant: "destructive" });
      setFormData(p => ({ ...p, paymentMethod: "manual" }));
    } finally {
      setStkLoading(false);
    }
  };

  const copy = (t: string) => { navigator.clipboard.writeText(t); toast({ title: "Copied!" }); };

  const sendWhatsAppWithInvoice = async () => {
    if (!contactInfo) return;
    const { buildInvoiceMessage, openWhatsApp } = await import("@/lib/whatsapp");
    openWhatsApp(contactInfo.whatsapp_number, buildInvoiceMessage({
      orderNumber,
      invoiceUrl,
      receiptUrl: `${window.location.origin}/receipt/${orderNumber}`,
      productUrl: `${window.location.origin}/product/${product.id}`,
      customerName: formData.name,
      customerPhone: formData.phone,
      itemsSummary: `${product.name} × ${formData.quantity}`,
      total: totalAmount,
      deliverTo: [formData.town, formData.subCounty, formData.county].filter(Boolean).join(", "),
      carrier: COURIER_INFO[formData.courier]?.name || formData.courier,
      paymentMethod: formData.paymentMethod === "stk" ? "M-Pesa Express" : "Manual M-Pesa",
    }));
  };

  const reset = () => {
    setStep(1); setOrderComplete(false); setOrderNumber(""); setOrderId("");
    setFormData({ name: "", phone: "", email: "", county: "", subCounty: "", town: "", courier: "", quantity: 1, paymentMethod: mpesaSettings?.is_enabled ? "stk" : "manual", notes: "" });
    onClose();
  };

  const hasPayment = mpesaSettings?.is_enabled || mpesaSettings?.allow_manual_payment;

  return (
    <Dialog open={isOpen} onOpenChange={reset}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background via-background to-muted/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-secondary" />
            {orderComplete ? "Order Complete" : `Checkout — Step ${step}/3`}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-emerald-100"><ShoppingCart className="w-6 h-6 text-emerald-400" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{product.name}</h4>
                  <p className="text-lg font-bold text-secondary">KES {product.price.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2"><Label className="flex items-center gap-2"><User className="w-4 h-4" />Full Name *</Label>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" /></div>
            <div className="space-y-2"><Label className="flex items-center gap-2"><Phone className="w-4 h-4" />Phone *</Label>
              <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="0712 345 678" /></div>
            <div className="space-y-2"><Label className="flex items-center gap-2"><Mail className="w-4 h-4" />Email (Optional)</Label>
              <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" /></div>

            <div className="space-y-2"><Label>Quantity</Label>
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" size="icon" onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}>-</Button>
                <span className="font-semibold text-lg w-8 text-center">{formData.quantity}</span>
                <Button type="button" variant="outline" size="icon" onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}>+</Button>
              </div>
            </div>

            <Button onClick={() => setStep(2)} className="w-full bg-gradient-to-r from-emerald-500 to-green-500" disabled={!formData.name || !formData.phone}>Continue to Delivery</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2"><Label className="flex items-center gap-2"><MapPin className="w-4 h-4" />County *</Label>
              <Select value={formData.county} onValueChange={v => setFormData({ ...formData, county: v, subCounty: "", town: "", courier: "" })}>
                <SelectTrigger><SelectValue placeholder="Select County" /></SelectTrigger>
                <SelectContent className="max-h-60">{KENYA_LOCATIONS.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {selCounty && <div className="space-y-2"><Label>Sub-County *</Label>
              <Select value={formData.subCounty} onValueChange={v => setFormData({ ...formData, subCounty: v, town: "", courier: "" })}>
                <SelectTrigger><SelectValue placeholder="Select Sub-County" /></SelectTrigger>
                <SelectContent className="max-h-60">{selCounty.subCounties.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
              </Select></div>}
            {selSub && <div className="space-y-2"><Label>Town *</Label>
              <Select value={formData.town} onValueChange={v => setFormData({ ...formData, town: v, courier: "" })}>
                <SelectTrigger><SelectValue placeholder="Select Town" /></SelectTrigger>
                <SelectContent className="max-h-60">{selSub.towns.map(t => <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
              </Select></div>}
            {selTown && selTown.couriers.length > 0 && (
              <div className="space-y-2"><Label className="flex items-center gap-2"><Truck className="w-4 h-4" />Carrier *</Label>
                <RadioGroup value={formData.courier} onValueChange={v => setFormData({ ...formData, courier: v })} className="space-y-2 max-h-72 overflow-y-auto">
                  {selTown.couriers.map(c => (
                    <div key={c} className="flex items-center space-x-3 p-3 border rounded-lg hover:border-emerald-400">
                      <RadioGroupItem value={c} id={`co-${c}`} />
                      <Label htmlFor={`co-${c}`} className="flex-1 cursor-pointer">
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
              <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600" onClick={() => setStep(3)} disabled={!formData.courier}>Continue to Payment</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Card className="bg-emerald-50 border-emerald-200"><CardContent className="p-4 space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal:</span><span>KES {productSubtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Delivery:</span><span>KES {deliveryFee.toLocaleString()}</span></div>
              <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total:</span><span className="text-emerald-600">KES {totalAmount.toLocaleString()}</span></div>
            </CardContent></Card>

            {hasPayment ? (
              <RadioGroup value={formData.paymentMethod} onValueChange={v => setFormData({ ...formData, paymentMethod: v })} className="space-y-2">
                {mpesaSettings?.is_enabled && (
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="stk" id="stk" />
                    <Label htmlFor="stk" className="flex-1 cursor-pointer flex items-center gap-2"><Smartphone className="w-4 h-4 text-green-600" /><div><p className="font-semibold">M-Pesa Express</p><p className="text-xs text-muted-foreground">Instant STK push</p></div></Label>
                  </div>
                )}
                {mpesaSettings?.allow_manual_payment && (
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="manual" id="manual" />
                    <Label htmlFor="manual" className="flex-1 cursor-pointer flex items-center gap-2"><CreditCard className="w-4 h-4 text-green-600" /><div><p className="font-semibold">Manual M-Pesa</p><p className="text-xs text-muted-foreground">Pay via Till/Paybill</p></div></Label>
                  </div>
                )}
              </RadioGroup>
            ) : <div className="p-4 bg-amber-50 rounded text-center text-sm">No payment methods configured</div>}

            {formData.paymentMethod === "manual" && contactInfo && (
              <Card className="bg-muted/40 border-dashed"><CardContent className="p-3 space-y-2 text-sm">
                {contactInfo.till_number && <div className="flex justify-between items-center"><span>Till: <strong>{contactInfo.till_number}</strong></span><Button size="icon" variant="ghost" onClick={() => copy(contactInfo.till_number)}><Copy className="w-3 h-3" /></Button></div>}
                {contactInfo.paybill_number && <div className="flex justify-between items-center"><span>Paybill: <strong>{contactInfo.paybill_number}</strong> {contactInfo.account_number && `Acc: ${contactInfo.account_number}`}</span><Button size="icon" variant="ghost" onClick={() => copy(contactInfo.paybill_number)}><Copy className="w-3 h-3" /></Button></div>}
                <p className="text-xs text-amber-700">Pay KES {totalAmount.toLocaleString()} then place order</p>
              </CardContent></Card>
            )}

            <div className="space-y-2"><Label>Notes (Optional)</Label>
              <Textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} rows={2} placeholder="Any special instructions..." /></div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={handleSubmit} disabled={loading || stkLoading || !hasPayment} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                {(loading || stkLoading) ? <Loader2 className="w-4 h-4 animate-spin" /> : "Place Order"}
              </Button>
            </div>
          </div>
        )}

        {step === 4 && orderComplete && (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500 flex items-center justify-center"><CheckCircle className="w-8 h-8 text-white" /></div>
            <div>
              <h3 className="text-xl font-bold">Order Placed!</h3>
              <p className="text-sm text-muted-foreground">Order #{orderNumber}</p>
            </div>

            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold"><FileText className="w-4 h-4 text-emerald-600" /> Your Invoice Link</div>
                <div className="flex items-center gap-1">
                  <Input readOnly value={invoiceUrl} className="text-xs bg-card" />
                  <Button size="icon" variant="outline" onClick={() => copy(invoiceUrl)}><Copy className="w-3 h-3" /></Button>
                  <Button size="icon" variant="outline" onClick={() => window.open(invoiceUrl, "_blank")}><ExternalLink className="w-3 h-3" /></Button>
                </div>
                <p className="text-xs text-muted-foreground">Pay & download receipt from this link</p>
              </CardContent>
            </Card>

            <Button onClick={sendWhatsAppWithInvoice} className="w-full bg-green-500 hover:bg-green-600 gap-2">
              <MessageCircle className="w-4 h-4" />Send Invoice via WhatsApp
            </Button>
            <Button variant="outline" onClick={() => window.open(invoiceUrl, "_blank")} className="w-full gap-2">
              <FileText className="w-4 h-4" />Open Invoice Page
            </Button>
            <Button variant="ghost" onClick={reset} className="w-full">Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Checkout;
