import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Package, LogOut, Truck, Phone, MapPin, ArrowLeft, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  product_name: string;
  quantity: number;
  total_amount: number;
  order_status: string;
  payment_status: string;
  shipping_address: string | null;
  courier: string | null;
  created_at: string;
}

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered"];

const statusColor = (s: string) => ({
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-emerald-100 text-emerald-800",
}[s] || "bg-gray-100 text-gray-800");

const Supplier = () => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [supplier, setSupplier] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }

      const { data: roleRow } = await supabase
        .from("user_roles").select("role").eq("user_id", user.id).eq("role", "supplier" as any).maybeSingle();
      if (!roleRow) { setAllowed(false); setLoading(false); return; }
      setAllowed(true);

      const { data: sup } = await supabase.from("suppliers" as any)
        .select("*").or(`user_id.eq.${user.id},email.eq.${user.email}`).maybeSingle();
      setSupplier(sup);

      // RLS filters automatically — fetch all visible orders (= my product orders)
      const { data: ords } = await supabase.from("orders")
        .select("*").order("created_at", { ascending: false });
      setOrders((ords as any) || []);
      setLoading(false);
    })();

    const channel = supabase.channel("supplier-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        supabase.from("orders").select("*").order("created_at", { ascending: false })
          .then(({ data }) => setOrders((data as any) || []));
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [navigate]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ order_status: status }).eq("id", id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else toast({ title: "Order updated ✓" });
  };

  const logout = async () => { await supabase.auth.signOut(); navigate("/auth"); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
    </div>
  );

  if (!allowed) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center">
      <ShieldCheck className="w-12 h-12 text-destructive" />
      <h1 className="text-2xl font-bold">Supplier access required</h1>
      <p className="text-muted-foreground">Ask the admin to add you as a supplier.</p>
      <Link to="/"><Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4" />Home</Button></Link>
    </div>
  );

  const counts = {
    total: orders.length,
    pending: orders.filter(o => o.order_status === "pending").length,
    processing: orders.filter(o => o.order_status === "processing").length,
    shipped: orders.filter(o => o.order_status === "shipped").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-background to-green-50/30">
      <header className="bg-gradient-to-r from-emerald-600 to-green-600 text-white sticky top-0 z-40 shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6" />
            <div>
              <h1 className="font-bold">Supplier Portal</h1>
              <p className="text-xs opacity-90">{supplier?.company || supplier?.full_name || supplier?.email}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={logout} className="text-white hover:bg-white/20 gap-2">
            <LogOut className="w-4 h-4" />Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total orders", val: counts.total, color: "text-emerald-600" },
            { label: "Pending", val: counts.pending, color: "text-yellow-600" },
            { label: "Processing", val: counts.processing, color: "text-blue-600" },
            { label: "Shipped", val: counts.shipped, color: "text-purple-600" },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
            </CardContent></Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" /> Orders to fulfill</CardTitle></CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No orders yet for your products.</p>
            ) : (
              <div className="space-y-3">
                {orders.map(o => (
                  <div key={o.id} className="border rounded-lg p-4 hover:shadow-sm transition">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold">{o.order_number}</span>
                          <Badge className={statusColor(o.order_status)}>{o.order_status}</Badge>
                          <Badge variant="outline">{o.payment_status}</Badge>
                        </div>
                        <p className="mt-1 font-medium">{o.product_name} × {o.quantity}</p>
                        <p className="text-sm text-muted-foreground">KES {o.total_amount.toLocaleString()}</p>
                        <div className="mt-2 text-sm space-y-0.5 text-muted-foreground">
                          <div>{o.customer_name}</div>
                          <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{o.customer_phone}</div>
                          {o.shipping_address && <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{o.shipping_address}</div>}
                          {o.courier && <div className="flex items-center gap-1"><Truck className="w-3 h-3" />{o.courier}</div>}
                        </div>
                      </div>
                      <Select value={o.order_status} onValueChange={v => updateStatus(o.id, v)}>
                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Supplier;
