import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Package, MapPin, Phone, Mail, Calendar, Truck, 
  CreditCard, Printer, Download, CheckCircle2, Clock 
} from "lucide-react";
import { format } from "date-fns";
import { useRef } from "react";

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

interface OrderReceiptProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

const OrderReceipt = ({ order, isOpen, onClose }: OrderReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Receipt - ${order.order_number}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              padding: 20px;
              max-width: 400px;
              margin: 0 auto;
            }
            .receipt {
              border: 1px solid #e5e5e5;
              border-radius: 8px;
              padding: 24px;
            }
            .header { text-align: center; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #10b981; }
            .order-number { 
              font-family: monospace; 
              background: #f3f4f6; 
              padding: 8px 16px; 
              border-radius: 4px; 
              margin: 10px 0;
              font-size: 14px;
            }
            .section { margin: 16px 0; }
            .section-title { 
              font-size: 12px; 
              color: #6b7280; 
              text-transform: uppercase; 
              margin-bottom: 8px; 
            }
            .row { 
              display: flex; 
              justify-content: space-between; 
              padding: 4px 0; 
              font-size: 14px;
            }
            .divider { 
              border-top: 1px dashed #e5e5e5; 
              margin: 16px 0; 
            }
            .total { 
              font-size: 20px; 
              font-weight: bold; 
              color: #10b981; 
            }
            .status { 
              display: inline-block; 
              padding: 4px 12px; 
              border-radius: 16px; 
              font-size: 12px; 
              font-weight: 500;
            }
            .status-paid { background: #d1fae5; color: #065f46; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .footer { 
              text-align: center; 
              color: #9ca3af; 
              font-size: 12px; 
              margin-top: 20px; 
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const productSubtotal = order.total_amount - (order.delivery_fee || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-500" />
            Order Receipt
          </DialogTitle>
        </DialogHeader>

        <div ref={receiptRef} className="receipt">
          {/* Header */}
          <div className="header text-center">
            <div className="logo text-2xl font-bold text-emerald-600 mb-2">
              MISAFA TECHNOLOGIES
            </div>
            <p className="text-sm text-muted-foreground">Thank you for your order!</p>
            <div className="order-number bg-muted p-2 rounded-lg mt-3 inline-block">
              <span className="text-xs text-muted-foreground">Order #</span>
              <p className="font-mono font-bold">{order.order_number}</p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Order Date & Status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {format(new Date(order.created_at), "MMM dd, yyyy 'at' hh:mm a")}
            </div>
            <Badge 
              className={order.payment_status === 'paid' || order.payment_status === 'completed' 
                ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
              }
            >
              {order.payment_status === 'paid' || order.payment_status === 'completed' ? (
                <><CheckCircle2 className="w-3 h-3 mr-1" /> Paid</>
              ) : (
                <><Clock className="w-3 h-3 mr-1" /> {order.payment_status}</>
              )}
            </Badge>
          </div>

          {/* Customer Info */}
          <div className="section bg-muted/50 rounded-lg p-3 space-y-2">
            <p className="section-title text-xs text-muted-foreground uppercase">Customer</p>
            <div className="space-y-1.5">
              <p className="font-semibold">{order.customer_name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-3.5 h-3.5" />
                {order.customer_phone}
              </div>
              {order.customer_email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  {order.customer_email}
                </div>
              )}
            </div>
          </div>

          {/* Shipping Info */}
          {order.shipping_address && (
            <div className="section bg-muted/50 rounded-lg p-3 mt-3 space-y-2">
              <p className="section-title text-xs text-muted-foreground uppercase">Delivery</p>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{order.shipping_address}</p>
                    {(order.town || order.sub_county || order.county) && (
                      <p className="text-muted-foreground text-xs">
                        {[order.town, order.sub_county, order.county].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                {order.courier && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="w-3.5 h-3.5" />
                    {order.courier}
                    {order.estimated_delivery && ` • Est. ${order.estimated_delivery}`}
                  </div>
                )}
              </div>
            </div>
          )}

          <Separator className="my-4" />

          {/* Items */}
          <div className="section">
            <p className="section-title text-xs text-muted-foreground uppercase mb-2">Items</p>
            <div className="row flex justify-between items-start py-2">
              <div className="flex-1">
                <p className="font-medium">{order.product_name}</p>
                <p className="text-sm text-muted-foreground">Qty: {order.quantity}</p>
              </div>
              <p className="font-medium">KES {productSubtotal.toLocaleString()}</p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Totals */}
          <div className="section space-y-2">
            <div className="row flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>KES {productSubtotal.toLocaleString()}</span>
            </div>
            {order.delivery_fee && order.delivery_fee > 0 && (
              <div className="row flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>KES {order.delivery_fee.toLocaleString()}</span>
              </div>
            )}
            <Separator />
            <div className="row flex justify-between pt-2">
              <span className="font-semibold">Total</span>
              <span className="total text-xl font-bold text-emerald-600">
                KES {order.total_amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Info */}
          {order.mpesa_receipt && (
            <div className="section bg-green-50 rounded-lg p-3 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-green-600" />
                <span className="text-green-700">M-Pesa Receipt:</span>
                <span className="font-mono font-bold text-green-800">{order.mpesa_receipt}</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="footer text-center text-xs text-muted-foreground mt-6 pt-4 border-t border-dashed">
            <p>Thank you for shopping with us!</p>
            <p className="mt-1">For support, contact us via WhatsApp</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handlePrint} className="flex-1 gap-2 bg-emerald-500 hover:bg-emerald-600">
            <Printer className="w-4 h-4" />
            Print Receipt
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderReceipt;
