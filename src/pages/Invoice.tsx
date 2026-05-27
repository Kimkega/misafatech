import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Download, Printer, CheckCircle2, Clock, Copy, MessageCircle, Smartphone, MapPin, Phone, Mail, Calendar, Truck, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  product_name: string;
  quantity: number;
  total_amount: number;
  delivery_fee: number | null;
  payment_method: string;
  payment_status: string;
  mpesa_receipt: string | null;
  order_status: string;
  shipping_address: string | null;
  county: string | null;
  sub_county: string | null;
  town: string | null;
  courier: string | null;
  estimated_delivery: string | null;
  created_at: string;
}

const Invoice = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    if (!orderNumber) return;
    const [orderRes, contactRes, siteRes] = await Promise.all([
      supabase.from("orders").select("*").eq("order_number", orderNumber).maybeSingle(),
      supabase.from("contact_info").select("*").limit(1).maybeSingle(),
      supabase.from("site_settings").select("*").limit(1).maybeSingle(),
    ]);
    if (orderRes.data) setOrder(orderRes.data as Order);
    if (contactRes.data) setContactInfo(contactRes.data);
    if (siteRes.data) setSiteSettings(siteRes.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // Realtime updates on this order
    if (!orderNumber) return;
    const channel = supabase
      .channel(`invoice-${orderNumber}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `order_number=eq.${orderNumber}` }, (payload) => {
        setOrder(payload.new as Order);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);

  const isPaid = order && (order.payment_status === "paid" || order.payment_status === "completed");
  const subtotal = order ? order.total_amount - (order.delivery_fee || 0) : 0;
  const siteName = siteSettings?.site_name || "MISAFA TECHNOLOGIES";
  const invoiceUrl = typeof window !== "undefined" ? `${window.location.origin}/invoice/${orderNumber}` : "";

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!" });
  };

  const triggerSTK = async () => {
    if (!order) return;
    setPaying(true);
    try {
      const { data, error } = await supabase.functions.invoke("mpesa-stk-push", {
        body: { phone: order.customer_phone, amount: order.total_amount, orderId: order.id, accountReference: order.order_number.substring(0, 12) },
      });
      if (error) throw error;
      if (data?.success) {
        toast({ title: "STK Push Sent", description: "Check your phone for the M-Pesa prompt." });
      } else {
        throw new Error(data?.error || "STK push failed");
      }
    } catch (e: any) {
      toast({ title: "Payment Failed", description: e.message, variant: "destructive" });
    } finally {
      setPaying(false);
    }
  };

  const sendWhatsAppPayment = async () => {
    if (!order || !contactInfo) return;
    const { buildPaymentConfirmationMessage, openWhatsApp } = await import("@/lib/whatsapp");
    openWhatsApp(contactInfo.whatsapp_number, buildPaymentConfirmationMessage({
      orderNumber: order.order_number,
      invoiceUrl,
      receiptUrl: `${window.location.origin}/receipt/${order.order_number}`,
      productUrl: order.product_id ? `${window.location.origin}/product/${order.product_id}` : undefined,
      itemName: order.product_name,
      total: order.total_amount,
      customerName: order.customer_name,
    }));
  };

  const downloadReceipt = () => {
    if (!order) return;
    const html = buildReceiptHtml(order, siteName, invoiceUrl);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Receipt-${order.order_number}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printInvoice = () => {
    window.print();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full"><CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Invoice not found</h2>
          <p className="text-muted-foreground">No invoice exists for #{orderNumber}.</p>
        </CardContent></Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/30 py-8 px-4 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto">
        {/* Action bar - hidden in print */}
        <div className="flex flex-wrap gap-2 justify-end mb-4 print:hidden">
          <Button variant="outline" size="sm" onClick={() => copy(invoiceUrl)} className="gap-1"><Copy className="w-4 h-4" /> Copy Link</Button>
          <Button variant="outline" size="sm" onClick={printInvoice} className="gap-1"><Printer className="w-4 h-4" /> Print</Button>
          {isPaid && <Button size="sm" onClick={downloadReceipt} className="gap-1 bg-emerald-500 hover:bg-emerald-600"><Download className="w-4 h-4" /> Download Receipt</Button>}
        </div>

        <Card className="shadow-xl print:shadow-none print:border-0">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-t-lg print:bg-emerald-600">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2"><Building2 className="w-6 h-6" /><span className="text-xl font-bold">{siteName}</span></div>
                <p className="text-sm opacity-90">{isPaid ? "RECEIPT / PAID INVOICE" : "INVOICE"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-90">Invoice #</p>
                <p className="font-mono font-bold text-lg">{order.order_number}</p>
                <Badge className={`mt-2 ${isPaid ? "bg-white text-emerald-700" : "bg-yellow-300 text-yellow-900"}`}>
                  {isPaid ? <><CheckCircle2 className="w-3 h-3 mr-1" />PAID</> : <><Clock className="w-3 h-3 mr-1" />{order.payment_status.toUpperCase()}</>}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Issued: {format(new Date(order.created_at), "MMM dd, yyyy 'at' hh:mm a")}
            </div>

            {/* From / Bill To */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-muted/40 rounded-lg p-4">
                <p className="text-xs uppercase text-muted-foreground mb-2">From</p>
                <p className="font-semibold">{siteName}</p>
                {contactInfo?.email && <p className="text-sm flex items-center gap-1"><Mail className="w-3 h-3" />{contactInfo.email}</p>}
                {contactInfo?.phone && <p className="text-sm flex items-center gap-1"><Phone className="w-3 h-3" />{contactInfo.phone}</p>}
                {contactInfo?.address && <p className="text-sm flex items-center gap-1"><MapPin className="w-3 h-3" />{contactInfo.address}</p>}
              </div>
              <div className="bg-muted/40 rounded-lg p-4">
                <p className="text-xs uppercase text-muted-foreground mb-2">Bill To</p>
                <p className="font-semibold">{order.customer_name}</p>
                <p className="text-sm flex items-center gap-1"><Phone className="w-3 h-3" />{order.customer_phone}</p>
                {order.customer_email && <p className="text-sm flex items-center gap-1"><Mail className="w-3 h-3" />{order.customer_email}</p>}
                {order.shipping_address && <p className="text-sm flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{order.shipping_address}</p>}
              </div>
            </div>

            {/* Items table */}
            <div>
              <p className="text-xs uppercase text-muted-foreground mb-2">Items</p>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60"><tr>
                    <th className="text-left p-3">Description</th>
                    <th className="text-center p-3 w-16">Qty</th>
                    <th className="text-right p-3 w-32">Amount</th>
                  </tr></thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3">{order.product_name}</td>
                      <td className="text-center p-3">{order.quantity}</td>
                      <td className="text-right p-3">KES {subtotal.toLocaleString()}</td>
                    </tr>
                    {order.delivery_fee && order.delivery_fee > 0 && (
                      <tr className="border-t">
                        <td className="p-3 text-muted-foreground">
                          Delivery {order.courier && `(${order.courier})`}
                          {order.estimated_delivery && <span className="text-xs block">Est. {order.estimated_delivery}</span>}
                        </td>
                        <td className="text-center p-3">1</td>
                        <td className="text-right p-3">KES {order.delivery_fee.toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full md:w-72 space-y-1">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
                {order.delivery_fee && order.delivery_fee > 0 && (
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Delivery</span><span>KES {order.delivery_fee.toLocaleString()}</span></div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold pt-1">
                  <span>Total</span>
                  <span className="text-emerald-600">KES {order.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {order.courier && (
              <div className="bg-muted/40 rounded-lg p-3 flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Delivery via <strong>{order.courier}</strong> to {[order.town, order.sub_county, order.county].filter(Boolean).join(", ")}</span>
              </div>
            )}

            {/* Payment section */}
            {!isPaid && contactInfo && (
              <Card className="border-dashed border-emerald-300 bg-emerald-50/50 print:hidden">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2"><Smartphone className="w-4 h-4 text-emerald-600" />Pay via M-Pesa</h3>
                  {contactInfo.till_number && (
                    <div className="flex justify-between items-center p-2 bg-card rounded border">
                      <div><p className="text-xs text-muted-foreground">Till (Buy Goods)</p><p className="font-bold">{contactInfo.till_number}</p></div>
                      <Button size="icon" variant="ghost" onClick={() => copy(contactInfo.till_number)}><Copy className="w-4 h-4" /></Button>
                    </div>
                  )}
                  {contactInfo.paybill_number && (
                    <div className="flex justify-between items-center p-2 bg-card rounded border">
                      <div><p className="text-xs text-muted-foreground">Paybill</p><p className="font-bold">{contactInfo.paybill_number}</p>{contactInfo.account_number && <p className="text-xs">Acc: {contactInfo.account_number}</p>}</div>
                      <Button size="icon" variant="ghost" onClick={() => copy(contactInfo.paybill_number)}><Copy className="w-4 h-4" /></Button>
                    </div>
                  )}
                  <p className="text-sm font-semibold">Amount: <span className="text-emerald-700">KES {order.total_amount.toLocaleString()}</span></p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Button onClick={triggerSTK} disabled={paying} className="bg-emerald-500 hover:bg-emerald-600 gap-2">
                      {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Smartphone className="w-4 h-4" /> Pay Now (STK)</>}
                    </Button>
                    <Button onClick={sendWhatsAppPayment} variant="outline" className="gap-2 border-green-500 text-green-700 hover:bg-green-50">
                      <MessageCircle className="w-4 h-4" /> Confirm via WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {isPaid && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="font-semibold text-emerald-900">Payment Received — Thank you!</p>
                {order.mpesa_receipt && <p className="text-sm font-mono">M-Pesa Receipt: {order.mpesa_receipt}</p>}
                <Button onClick={downloadReceipt} className="bg-emerald-500 hover:bg-emerald-600 gap-2"><Download className="w-4 h-4" /> Download Receipt</Button>
              </div>
            )}

            <div className="text-center text-xs text-muted-foreground pt-4 border-t border-dashed">
              <p>Invoice Link: <span className="font-mono">{invoiceUrl}</span></p>
              <p className="mt-1">Thank you for your business!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function buildReceiptHtml(order: Order, siteName: string, invoiceUrl: string) {
  const subtotal = order.total_amount - (order.delivery_fee || 0);
  const paid = order.payment_status === "paid" || order.payment_status === "completed";
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Receipt ${order.order_number}</title>
<style>body{font-family:-apple-system,Segoe UI,sans-serif;max-width:600px;margin:24px auto;padding:24px;color:#111}
.h{background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:20px;border-radius:8px;margin-bottom:20px}
.h h1{margin:0;font-size:22px}.badge{display:inline-block;background:#fff;color:#065f46;padding:4px 10px;border-radius:12px;font-size:12px;font-weight:bold;margin-top:8px}
.row{display:flex;justify-content:space-between;padding:6px 0}.box{background:#f3f4f6;padding:12px;border-radius:6px;margin:10px 0}
table{width:100%;border-collapse:collapse;margin:12px 0}th,td{padding:8px;border-bottom:1px solid #e5e7eb;text-align:left}
.total{font-size:20px;font-weight:bold;color:#059669}.footer{text-align:center;color:#6b7280;font-size:12px;margin-top:20px;border-top:1px dashed #e5e7eb;padding-top:12px}</style>
</head><body>
<div class="h"><h1>${siteName}</h1><p>${paid ? "PAID RECEIPT" : "INVOICE"} #${order.order_number}<br><span class="badge">${paid ? "✓ PAID" : order.payment_status.toUpperCase()}</span></p></div>
<div class="box"><strong>Bill To:</strong><br>${order.customer_name}<br>${order.customer_phone}${order.customer_email ? "<br>" + order.customer_email : ""}${order.shipping_address ? "<br>" + order.shipping_address : ""}</div>
<table><tr><th>Item</th><th>Qty</th><th style="text-align:right">Amount</th></tr>
<tr><td>${order.product_name}</td><td>${order.quantity}</td><td style="text-align:right">KES ${subtotal.toLocaleString()}</td></tr>
${order.delivery_fee && order.delivery_fee > 0 ? `<tr><td>Delivery${order.courier ? " (" + order.courier + ")" : ""}</td><td>1</td><td style="text-align:right">KES ${order.delivery_fee.toLocaleString()}</td></tr>` : ""}
</table>
<div class="row"><span>Subtotal</span><span>KES ${subtotal.toLocaleString()}</span></div>
${order.delivery_fee && order.delivery_fee > 0 ? `<div class="row"><span>Delivery</span><span>KES ${order.delivery_fee.toLocaleString()}</span></div>` : ""}
<div class="row total"><span>Total</span><span>KES ${order.total_amount.toLocaleString()}</span></div>
${order.mpesa_receipt ? `<div class="box"><strong>M-Pesa Receipt:</strong> ${order.mpesa_receipt}</div>` : ""}
<div class="footer">Issued ${format(new Date(order.created_at), "MMM dd, yyyy")}<br>${invoiceUrl}<br>Thank you for your business!</div>
</body></html>`;
}

export default Invoice;
