import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Loader2, Receipt as ReceiptIcon } from "lucide-react";

const Receipt = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) return;
    supabase.from("orders").select("*").eq("order_number", orderNumber).maybeSingle().then(({ data }) => {
      setOrder(data);
      setLoading(false);
    });
  }, [orderNumber]);

  const downloadPdf = () => {
    if (!order) return;
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("MISAFA TECHNOLOGIES", 20, 22);
    doc.setFontSize(12); doc.text("Payment Receipt", 20, 32);
    doc.line(20, 38, 190, 38);
    const rows = [
      ["Order", order.order_number], ["Customer", order.customer_name], ["Phone", order.customer_phone],
      ["Item", `${order.product_name} x ${order.quantity}`], ["Delivery", order.shipping_address || "-"],
      ["Carrier", order.courier || "-"], ["Payment", order.payment_status], ["M-Pesa", order.mpesa_receipt || "Pending"],
      ["Total", `KES ${Number(order.total_amount).toLocaleString()}`],
    ];
    rows.forEach(([k, v], i) => doc.text(`${k}: ${v}`, 20, 52 + i * 10));
    doc.text("Thank you for shopping with Misafa Technologies.", 20, 155);
    doc.save(`Receipt-${order.order_number}.pdf`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-secondary" /></div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center p-6">Receipt not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-soft p-4 flex items-center justify-center">
      <Card className="max-w-lg w-full shadow-card">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3"><ReceiptIcon className="w-8 h-8 text-secondary" /><div><h1 className="font-display text-2xl font-bold">Receipt</h1><p className="text-sm text-muted-foreground">{order.order_number}</p></div></div>
          <div className="rounded-lg border p-4 space-y-2 text-sm">
            <p><strong>Customer:</strong> {order.customer_name}</p><p><strong>Items:</strong> {order.product_name} × {order.quantity}</p>
            <p><strong>Total:</strong> KES {Number(order.total_amount).toLocaleString()}</p><p><strong>Status:</strong> {order.payment_status}</p>
          </div>
          <Button onClick={downloadPdf} className="w-full bg-gradient-accent gap-2"><Download className="w-4 h-4" />Download PDF Receipt</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Receipt;