import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, DollarSign, ShoppingBag, Package, 
  Users, CreditCard, AlertCircle, CheckCircle2,
  Clock, XCircle, Truck
} from "lucide-react";

interface Order {
  id: string;
  total_amount: number;
  payment_status: string;
  order_status: string;
  created_at: string;
  delivery_fee?: number;
}

interface Product {
  id: string;
}

interface AdminStatsProps {
  orders: Order[];
  products: Product[];
}

const AdminStats = ({ orders, products }: AdminStatsProps) => {
  // Calculate statistics
  const totalRevenue = orders
    .filter(o => o.payment_status === 'completed')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const pendingRevenue = orders
    .filter(o => o.payment_status === 'pending')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.created_at).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  });

  const todayRevenue = todayOrders
    .filter(o => o.payment_status === 'completed')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const thisMonthOrders = orders.filter(o => {
    const orderDate = new Date(o.created_at);
    const now = new Date();
    return orderDate.getMonth() === now.getMonth() && 
           orderDate.getFullYear() === now.getFullYear();
  });

  const monthlyRevenue = thisMonthOrders
    .filter(o => o.payment_status === 'completed')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const paidOrders = orders.filter(o => o.payment_status === 'completed').length;
  const pendingOrders = orders.filter(o => o.payment_status === 'pending').length;
  const cancelledOrders = orders.filter(o => o.order_status === 'cancelled').length;
  const processingOrders = orders.filter(o => o.order_status === 'processing').length;
  const shippedOrders = orders.filter(o => o.order_status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.order_status === 'delivered').length;

  const stats = [
    {
      title: "Total Revenue",
      value: `KES ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "From completed payments",
      gradient: "from-emerald-500 to-green-600",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-600"
    },
    {
      title: "Today's Sales",
      value: `KES ${todayRevenue.toLocaleString()}`,
      icon: TrendingUp,
      description: `${todayOrders.length} orders today`,
      gradient: "from-blue-500 to-cyan-600",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-600"
    },
    {
      title: "Monthly Revenue",
      value: `KES ${monthlyRevenue.toLocaleString()}`,
      icon: CreditCard,
      description: `${thisMonthOrders.length} orders this month`,
      gradient: "from-purple-500 to-pink-600",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-600"
    },
    {
      title: "Pending Payments",
      value: `KES ${pendingRevenue.toLocaleString()}`,
      icon: Clock,
      description: `${pendingOrders} awaiting payment`,
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-600"
    },
  ];

  const orderStats = [
    { 
      label: "Paid Orders", 
      value: paidOrders, 
      icon: CheckCircle2, 
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-200 dark:border-emerald-500/20"
    },
    { 
      label: "Pending", 
      value: pendingOrders, 
      icon: Clock, 
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-200 dark:border-amber-500/20"
    },
    { 
      label: "Processing", 
      value: processingOrders, 
      icon: Package, 
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-500/10",
      border: "border-blue-200 dark:border-blue-500/20"
    },
    { 
      label: "Shipped", 
      value: shippedOrders, 
      icon: Truck, 
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-500/10",
      border: "border-purple-200 dark:border-purple-500/20"
    },
    { 
      label: "Delivered", 
      value: deliveredOrders, 
      icon: CheckCircle2, 
      color: "text-teal-600",
      bg: "bg-teal-50 dark:bg-teal-500/10",
      border: "border-teal-200 dark:border-teal-500/20"
    },
    { 
      label: "Cancelled", 
      value: cancelledOrders, 
      icon: XCircle, 
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-500/10",
      border: "border-red-200 dark:border-red-500/20"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Status Overview */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-secondary" />
            Order Status Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {orderStats.map((stat, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-xl ${stat.bg} border ${stat.border} transition-transform hover:scale-105`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-card to-muted/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-secondary/10">
              <Package className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="text-xs text-muted-foreground">Total Products</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-card to-muted/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{orders.length}</p>
              <p className="text-xs text-muted-foreground">Total Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-card to-muted/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {orders.length > 0 ? Math.round((paidOrders / orders.length) * 100) : 0}%
              </p>
              <p className="text-xs text-muted-foreground">Payment Rate</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-card to-muted/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                KES {orders.length > 0 ? Math.round(totalRevenue / Math.max(paidOrders, 1)).toLocaleString() : 0}
              </p>
              <p className="text-xs text-muted-foreground">Avg Order Value</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStats;
