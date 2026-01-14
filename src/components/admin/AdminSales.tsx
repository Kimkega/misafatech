import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  TrendingUp, DollarSign, Calendar, Search, 
  Download, Filter, ArrowUpRight, ArrowDownRight,
  BarChart3
} from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  product_name: string;
  quantity: number;
  total_amount: number;
  payment_status: string;
  order_status: string;
  mpesa_receipt: string | null;
  created_at: string;
  delivery_fee?: number;
}

interface AdminSalesProps {
  orders: Order[];
}

const AdminSales = ({ orders }: AdminSalesProps) => {
  const [dateFilter, setDateFilter] = useState<"today" | "week" | "month" | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter orders based on date and search
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Date filtering
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    if (dateFilter === "today") {
      filtered = filtered.filter(o => new Date(o.created_at) >= today);
    } else if (dateFilter === "week") {
      filtered = filtered.filter(o => new Date(o.created_at) >= weekAgo);
    } else if (dateFilter === "month") {
      filtered = filtered.filter(o => new Date(o.created_at) >= monthAgo);
    }

    // Search filtering
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
  }, [orders, dateFilter, searchQuery]);

  // Calculate sales statistics
  const completedSales = filteredOrders.filter(o => o.payment_status === "completed");
  const totalSales = completedSales.reduce((sum, o) => sum + o.total_amount, 0);
  const totalOrders = filteredOrders.length;
  const conversionRate = totalOrders > 0 ? (completedSales.length / totalOrders) * 100 : 0;

  // Calculate previous period for comparison
  const getPreviousPeriodSales = () => {
    const now = new Date();
    let startDate: Date, endDate: Date;

    if (dateFilter === "today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (dateFilter === "week") {
      startDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      endDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (dateFilter === "month") {
      startDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      endDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else {
      return null;
    }

    const previousOrders = orders.filter(o => {
      const orderDate = new Date(o.created_at);
      return orderDate >= startDate && orderDate < endDate && o.payment_status === "completed";
    });

    return previousOrders.reduce((sum, o) => sum + o.total_amount, 0);
  };

  const previousSales = getPreviousPeriodSales();
  const salesGrowth = previousSales !== null && previousSales > 0 
    ? ((totalSales - previousSales) / previousSales) * 100 
    : null;

  const getPaymentStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
      processing: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
      failed: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Sales Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Total Sales</p>
                <p className="text-3xl font-bold mt-1">KES {totalSales.toLocaleString()}</p>
                {salesGrowth !== null && (
                  <div className={`flex items-center gap-1 mt-2 text-sm ${salesGrowth >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>
                    {salesGrowth >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>{Math.abs(salesGrowth).toFixed(1)}% vs previous period</span>
                  </div>
                )}
              </div>
              <div className="p-3 rounded-xl bg-white/20">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Orders</p>
                <p className="text-3xl font-bold mt-1">{totalOrders}</p>
                <p className="text-blue-200 text-sm mt-2">
                  {completedSales.length} completed
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/20">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Conversion Rate</p>
                <p className="text-3xl font-bold mt-1">{conversionRate.toFixed(1)}%</p>
                <p className="text-purple-200 text-sm mt-2">
                  Paid vs Total
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/20">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order #, customer, phone, product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={dateFilter} onValueChange={(v: any) => setDateFilter(v)}>
                <SelectTrigger className="w-40">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="py-1.5 px-3">
                {filteredOrders.length} transactions
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-secondary" />
            Sales Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <DollarSign className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No sales found for the selected period</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>M-Pesa Receipt</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm font-medium">
                        {order.order_number}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('en-KE', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{order.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{order.product_name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {order.quantity}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-secondary">
                        KES {order.total_amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {order.mpesa_receipt ? (
                          <span className="font-mono text-xs bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded">
                            {order.mpesa_receipt}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusBadge(order.payment_status)}>
                          {order.payment_status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSales;
