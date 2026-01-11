import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ShoppingCart, CreditCard, Phone, User, Mail, MapPin, 
  Loader2, CheckCircle, AlertCircle, Copy, MessageCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
}

interface CheckoutProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

interface ContactInfo {
  whatsapp_number: string;
  till_number: string | null;
  paybill_number: string | null;
  account_number: string | null;
}

interface MpesaSettings {
  is_enabled: boolean;
  allow_manual_payment: boolean;
  payment_type: string;
  shortcode: string | null;
}

const Checkout = ({ product, isOpen, onClose }: CheckoutProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [mpesaSettings, setMpesaSettings] = useState<MpesaSettings | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    quantity: 1,
    paymentMethod: "manual",
    notes: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    const [contactRes, mpesaRes] = await Promise.all([
      supabase.from("contact_info").select("whatsapp_number, till_number, paybill_number, account_number").limit(1).single(),
      supabase.from("mpesa_settings").select("*").limit(1).single(),
    ]);
    
    if (contactRes.data) setContactInfo(contactRes.data);
    if (mpesaRes.data) setMpesaSettings(mpesaRes.data as MpesaSettings);
  };

  const totalAmount = product.price * formData.quantity;

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email || null,
          product_id: product.id,
          product_name: product.name,
          quantity: formData.quantity,
          total_amount: totalAmount,
          payment_method: formData.paymentMethod,
          shipping_address: formData.address || null,
          notes: formData.notes || null,
          payment_status: "pending",
          order_status: "pending",
          order_number: `ORD-${Date.now()}`,
        } as any)
        .select("order_number")
        .single();

      if (error) throw error;

      setOrderNumber(data.order_number);
      setOrderComplete(true);
      setStep(3);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const handleWhatsAppConfirmation = () => {
    if (!contactInfo) return;
    
    const message = encodeURIComponent(
      `🧾 *Payment Confirmation*\n\n` +
      `📋 Order: ${orderNumber}\n` +
      `📦 Product: ${product.name}\n` +
      `💰 Amount: KES ${totalAmount.toLocaleString()}\n` +
      `📱 Phone: ${formData.phone}\n\n` +
      `I have completed the payment. Please confirm my order.`
    );
    
    const cleanNumber = contactInfo.whatsapp_number.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const resetAndClose = () => {
    setStep(1);
    setOrderComplete(false);
    setOrderNumber("");
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      quantity: 1,
      paymentMethod: "manual",
      notes: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background via-background to-muted/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <ShoppingCart className="w-5 h-5 text-secondary" />
            {orderComplete ? "Order Complete" : "Checkout"}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Customer Info */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Product Summary */}
            <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-100">
                      <ShoppingCart className="w-6 h-6 text-emerald-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{product.name}</h4>
                  <p className="text-lg font-bold text-secondary">KES {product.price.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name *
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="bg-card"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Phone Number *
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+254 7XX XXX XXX"
                  className="bg-card"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email (Optional)
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="bg-card"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Delivery Address
                </Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Nairobi, Kenya"
                  rows={2}
                  className="bg-card"
                />
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                  >
                    -
                  </Button>
                  <span className="font-semibold text-lg w-8 text-center">{formData.quantity}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-secondary">KES {totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
              disabled={!formData.name || !formData.phone}
            >
              Continue to Payment
            </Button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="space-y-4">
            <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Order Total</span>
                  <span className="text-2xl font-bold text-secondary">KES {totalAmount.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Label className="text-base font-semibold">Select Payment Method</Label>
              
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                className="space-y-3"
              >
                {mpesaSettings?.allow_manual_payment && (
                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-border bg-card hover:border-emerald-400 transition-colors">
                    <RadioGroupItem value="manual" id="manual" />
                    <Label htmlFor="manual" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold">Manual M-Pesa Payment</p>
                          <p className="text-sm text-muted-foreground">Pay via Till/Paybill & send confirmation</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                )}
              </RadioGroup>

              {formData.paymentMethod === "manual" && contactInfo && (
                <Card className="bg-muted/50 border-dashed">
                  <CardContent className="p-4 space-y-4">
                    <h4 className="font-semibold text-foreground">M-Pesa Payment Details</h4>
                    
                    {contactInfo.till_number && (
                      <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
                        <div>
                          <p className="text-xs text-muted-foreground">Till Number (Buy Goods)</p>
                          <p className="font-bold text-lg">{contactInfo.till_number}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(contactInfo.till_number!)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    {contactInfo.paybill_number && (
                      <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
                        <div>
                          <p className="text-xs text-muted-foreground">Paybill Number</p>
                          <p className="font-bold text-lg">{contactInfo.paybill_number}</p>
                          {contactInfo.account_number && (
                            <p className="text-sm text-muted-foreground">Account: {contactInfo.account_number}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(contactInfo.paybill_number!)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        <strong>Amount:</strong> KES {totalAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-amber-600 mt-1">
                        After payment, click "Place Order" and send confirmation via WhatsApp
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label>Order Notes (Optional)</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any special instructions..."
                  rows={2}
                  className="bg-card"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Place Order"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Order Complete */}
        {step === 3 && orderComplete && (
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Order Placed!</h3>
              <p className="text-muted-foreground">Your order has been received successfully.</p>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="text-xl font-bold text-foreground">{orderNumber}</p>
              </CardContent>
            </Card>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-left">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800">Next Step</p>
                  <p className="text-sm text-amber-700">
                    Please send your payment confirmation via WhatsApp to complete your order.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleWhatsAppConfirmation}
                className="w-full gap-2 bg-green-500 hover:bg-green-600"
              >
                <MessageCircle className="w-5 h-5" />
                Send Confirmation on WhatsApp
              </Button>
              
              <Button variant="outline" onClick={resetAndClose} className="w-full">
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Checkout;
