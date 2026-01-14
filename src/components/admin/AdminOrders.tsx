import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingBag, Search, Phone, Mail, MapPin, 
  Package, CreditCard, Clock, CheckCircle2, XCircle,
  Truck, Calendar, User, AlertCircle, Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  product_name: string;
  quantity: number;
  total_amount: number;
  delivery_fee?: number;
  payment_method: string;
  payment_status: string;
  mpesa_receipt: string | null;
  order_status: string;
  notes: string | null;
  shipping_address: string | null;
  county?: string | null;
  sub_county?: string | null;
  town?: string | null;
  courier?: string | null;
  created_at: string;
}

interface AdminOrdersProps {
  orders: Order[];
  onRefresh: () => void;
}

const AdminOrders = ({ orders, onRefresh }: AdminOrdersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled">("all");
  const [paymentFilter, setPaymentFilter] = useState<"all" | "pending" | "completed" | "failed">("all");
  const { toast } = useToast();

  // Filter orders
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Status filtering
    if (statusFilter !== "all") {
      filtered = filtered.filter(o => o.order_status === statusFilter);
    }

    // Payment filtering
    if (paymentFilter !== "all") {
      filtered = filtered.filter(o => o.payment_status === paymentFilter);
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(o => 
        o.order_number.toLowerCase().includes(query) ||
        o.customer_name.toLowerCase().includes(query) ||
        o.customer_phone.includes(query) ||
        o.product_name.toLowerCase().includes(query) ||
        (o.mpesa_receipt && o.mpesa_receipt.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [orders, statusFilter, paymentFilter, searchQuery]);

  const handleUpdateOrderStatus = async (orderId: string, field: 'order_status' | 'payment_status', value: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ [field]: value } as any)
      .eq("id", orderId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: "Order updated successfully." });
      onRefresh();
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "confirmed": return <CheckCircle2 className="w-4 h-4" />;
      case "processing": return <Package className="w-4 h-4" />;
      case "shipped": return <Truck className="w-4 h-4" />;
      case "delivered": return <CheckCircle2 className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200";
      case "confirmed": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200";
      case "processing": return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200";
      case "shipped": return "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border-purple-200";
      case "delivered": return "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400 border-teal-200";
      case "cancelled": return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
      case "pending": return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
      case "processing": return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
      case "failed": return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Count orders by status for quick tabs
  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.order_status === "pending").length,
    processing: orders.filter(o => o.order_status === "processing").length,
    shipped: orders.filter(o => o.order_status === "shipped").length,
    delivered: orders.filter(o => o.order_status === "delivered").length,
    cancelled: orders.filter(o => o.order_status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      {/* Quick Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(orderCounts).map(([status, count]) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status as any)}
            className={`gap-2 ${statusFilter === status ? "bg-secondary text-secondary-foreground" : ""}`}
          >
            {status === "all" && <ShoppingBag className="w-4 h-4" />}
            {status === "pending" && <Clock className="w-4 h-4" />}
            {status === "processing" && <Package className="w-4 h-4" />}
            {status === "shipped" && <Truck className="w-4 h-4" />}
            {status === "delivered" && <CheckCircle2 className="w-4 h-4" />}
            {status === "cancelled" && <XCircle className="w-4 h-4" />}
            <span className="capitalize">{status}</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={paymentFilter} onValueChange={(v: any) => setPaymentFilter(v)}>
                <SelectTrigger className="w-44">
                  <CreditCard className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="completed">Paid (M-Pesa)</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge variant="outline" className="py-1.5 px-3">
              {filteredOrders.length} orders
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card className="p-12 text-center bg-gradient-to-br from-card to-muted/30">
          <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
          <p className="text-muted-foreground">
            {orders.length === 0 
              ? "Orders will appear here when customers purchase."
              : "No orders match your current filters."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              {/* Order Header */}
              <div className={`h-1 ${
                order.payment_status === 'completed' ? 'bg-emerald-500' : 
                order.payment_status === 'failed' ? 'bg-red-500' : 'bg-amber-500'
              }`} />
              
              <CardContent className="p-0">
                <div className="p-4 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Order Info */}
                    <div className="flex-1 space-y-3">
                      {/* Header Row */}
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="font-mono font-bold text-lg text-foreground">
                          {order.order_number}
                        </span>
                        <Badge className={`gap-1 ${getOrderStatusColor(order.order_status)}`}>
                          {getOrderStatusIcon(order.order_status)}
                          {order.order_status}
                        </Badge>
                        <Badge className={getPaymentStatusColor(order.payment_status)}>
                          {order.payment_status === 'completed' ? '💰 Paid' : order.payment_status}
                        </Badge>
                        {order.mpesa_receipt && (
                          <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200">
                            M-Pesa: {order.mpesa_receipt}
                          </Badge>
                        )}
                      </div>

                      {/* Product & Amount */}
                      <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                        <div className="p-2 rounded-lg bg-secondary/10">
                          <Package className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{order.product_name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {order.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-secondary">
                            KES {order.total_amount.toLocaleString()}
                          </p>
                          {order.delivery_fee && order.delivery_fee > 0 && (
                            <p className="text-xs text-muted-foreground">
                              (incl. KES {order.delivery_fee} delivery)
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{order.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <a href={`tel:${order.customer_phone}`} className="text-secondary hover:underline">
                            {order.customer_phone}
                          </a>
                        </div>
                        {order.customer_email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <a href={`mailto:${order.customer_email}`} className="text-secondary hover:underline">
                              {order.customer_email}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{new Date(order.created_at).toLocaleString('en-KE')}</span>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      {(order.shipping_address || order.county) && (
                        <div className="flex items-start gap-2 text-sm p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                          <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-700 dark:text-blue-400">Delivery Address</p>
                            <p className="text-blue-600 dark:text-blue-300">
                              {order.shipping_address}
                              {order.town && `, ${order.town}`}
                              {order.sub_county && `, ${order.sub_county}`}
                              {order.county && `, ${order.county}`}
                            </p>
                            {order.courier && (
                              <p className="text-xs mt-1">
                                🚚 Courier: <span className="font-medium">{order.courier}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {order.notes && (
                        <div className="text-sm p-3 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
                          <p className="font-medium text-amber-700 dark:text-amber-400">📝 Customer Notes</p>
                          <p className="text-amber-600 dark:text-amber-300">{order.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:w-48">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Order Status</label>
                        <Select
                          value={order.order_status}
                          onValueChange={(value) => handleUpdateOrderStatus(order.id, 'order_status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">⏳ Pending</SelectItem>
                            <SelectItem value="confirmed">✅ Confirmed</SelectItem>
                            <SelectItem value="processing">📦 Processing</SelectItem>
                            <SelectItem value="shipped">🚚 Shipped</SelectItem>
                            <SelectItem value="delivered">✨ Delivered</SelectItem>
                            <SelectItem value="cancelled">❌ Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Payment Status</label>
                        <Select
                          value={order.payment_status}
                          onValueChange={(value) => handleUpdateOrderStatus(order.id, 'payment_status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">⏳ Pending</SelectItem>
                            <SelectItem value="processing">🔄 Processing</SelectItem>
                            <SelectItem value="completed">💰 Completed</SelectItem>
                            <SelectItem value="failed">❌ Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
