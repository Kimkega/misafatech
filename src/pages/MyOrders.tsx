import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, Truck, CheckCircle2, Clock, XCircle, 
  Search, ArrowLeft, LogOut, User as UserIcon,
  Phone, Mail, MapPin, Calendar, Receipt, Loader2,
  ShoppingBag, Home
} from "lucide-react";
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

const MyOrders = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchPhone, setSearchPhone] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchedOrders, setSearchedOrders] = useState<Order[] | null>(null);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserOrders(session.user.email || "");
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserOrders = async (email: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_email", email)
      .order("created_at", { ascending: false });

    if (data) {
      setOrders(data as Order[]);
    }
    setLoading(false);
  };

  const searchOrders = async () => {
    if (!searchPhone && !searchEmail) {
      toast({
        title: "Enter search criteria",
        description: "Please enter your phone number or email to find orders",
        variant: "destructive",
      });
      return;
    }

    setSearching(true);
    let query = supabase.from("orders").select("*");

    if (searchPhone) {
      query = query.ilike("customer_phone", `%${searchPhone}%`);
    }
    if (searchEmail) {
      query = query.ilike("customer_email", `%${searchEmail}%`);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Search failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSearchedOrders(data as Order[]);
      if (data?.length === 0) {
        toast({
          title: "No orders found",
          description: "We couldn't find any orders matching your search",
        });
      }
    }
    setSearching(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
      pending: { icon: <Clock className="w-4 h-4" />, color: "text-yellow-600", bg: "bg-yellow-100 border-yellow-300" },
      processing: { icon: <Package className="w-4 h-4" />, color: "text-blue-600", bg: "bg-blue-100 border-blue-300" },
      shipped: { icon: <Truck className="w-4 h-4" />, color: "text-purple-600", bg: "bg-purple-100 border-purple-300" },
      delivered: { icon: <CheckCircle2 className="w-4 h-4" />, color: "text-green-600", bg: "bg-green-100 border-green-300" },
      cancelled: { icon: <XCircle className="w-4 h-4" />, color: "text-red-600", bg: "bg-red-100 border-red-300" },
    };
    return configs[status] || configs.pending;
  };

  const getPaymentBadge = (status: string) => {
    if (status === "paid") return <Badge className="bg-green-500">Paid</Badge>;
    if (status === "pending") return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Pending</Badge>;
    return <Badge variant="destructive">{status}</Badge>;
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const statusConfig = getStatusConfig(order.order_status);
    
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all">
        <div className={`h-2 ${order.order_status === 'delivered' ? 'bg-green-500' : order.order_status === 'shipped' ? 'bg-purple-500' : 'bg-yellow-500'}`} />
        <CardContent className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Order Number</p>
              <p className="font-mono font-bold text-primary">{order.order_number}</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${statusConfig.bg}`}>
              {statusConfig.icon}
              <span className={`text-sm font-medium capitalize ${statusConfig.color}`}>{order.order_status}</span>
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-100 to-green-50 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{order.product_name}</p>
                <p className="text-sm text-muted-foreground">Qty: {order.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">KES {order.total_amount.toLocaleString()}</p>
                {order.delivery_fee && order.delivery_fee > 0 && (
                  <p className="text-xs text-muted-foreground">+ KES {order.delivery_fee} delivery</p>
                )}
              </div>
            </div>
          </div>

          {/* Status & Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(order.created_at), "MMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-muted-foreground" />
                {getPaymentBadge(order.payment_status)}
              </div>
            </div>
            <div className="space-y-2">
              {order.mpesa_receipt && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Receipt:</span>
                  <span className="font-mono text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">{order.mpesa_receipt}</span>
                </div>
              )}
              {order.estimated_delivery && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Truck className="w-4 h-4" />
                  <span className="text-xs">Est: {order.estimated_delivery}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Info */}
          {order.shipping_address && (
            <div className="border-t pt-3">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{order.shipping_address}</p>
                  {(order.town || order.sub_county || order.county) && (
                    <p className="text-xs">
                      {[order.town, order.sub_county, order.county].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {order.courier && (
                    <p className="text-xs mt-1">
                      <span className="font-medium">Courier:</span> {order.courier}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const displayOrders = searchedOrders !== null ? searchedOrders : orders;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">My Orders</h1>
                <p className="text-xs text-muted-foreground">Track your purchases</p>
              </div>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <UserIcon className="w-4 h-4" />
                <span className="text-muted-foreground">{user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Search Section */}
        <Card className="mb-8 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Find Your Orders
            </CardTitle>
            <CardDescription>
              {user ? "View your order history or search by phone/email" : "Enter your phone number or email to track your orders"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Phone number (e.g., 0712345678)"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Email address"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={searchOrders} 
                disabled={searching}
                className="bg-gradient-to-r from-emerald-500 to-green-500"
              >
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                Search
              </Button>
            </div>
            {searchedOrders !== null && (
              <Button 
                variant="link" 
                className="mt-2 p-0 h-auto" 
                onClick={() => setSearchedOrders(null)}
              >
                Clear search results
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Orders List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : displayOrders.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
              <p className="text-muted-foreground mb-6">
                {user ? "You haven't placed any orders yet." : "Search for your orders using your phone number or email."}
              </p>
              <Link to="/">
                <Button className="bg-gradient-to-r from-emerald-500 to-green-500">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">
                {searchedOrders !== null ? "Search Results" : "Your Orders"} ({displayOrders.length})
              </h2>
            </div>
            
            {/* Order Status Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {displayOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </TabsContent>

              {["pending", "processing", "shipped", "delivered"].map((status) => (
                <TabsContent key={status} value={status} className="space-y-4">
                  {displayOrders.filter(o => o.order_status === status).length === 0 ? (
                    <Card className="text-center py-8">
                      <CardContent>
                        <p className="text-muted-foreground">No {status} orders</p>
                      </CardContent>
                    </Card>
                  ) : (
                    displayOrders.filter(o => o.order_status === status).map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}

        {/* Login CTA for guests */}
        {!user && (
          <Card className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h3 className="font-semibold">Have an account?</h3>
                <p className="text-sm text-muted-foreground">Sign in to see all your orders in one place</p>
              </div>
              <Link to="/auth">
                <Button variant="outline">
                  <UserIcon className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default MyOrders;
