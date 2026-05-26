import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, Trash2, Users, Mail, Phone, Building2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Supplier {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  company: string | null;
  user_id: string | null;
  created_at: string;
}

const AdminSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", full_name: "", phone: "", company: "" });
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("suppliers" as any).select("*").order("created_at", { ascending: false });
    setSuppliers((data as any) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const genPassword = () => {
    const p = Math.random().toString(36).slice(-10) + "A1!";
    setForm(f => ({ ...f, password: p }));
  };

  const create = async () => {
    if (!form.email || !form.password) {
      toast({ title: "Email & password required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-supplier", { body: form });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({
        title: "Supplier created ✓",
        description: `Login: ${form.email} / ${form.password}  (copy & share)`,
      });
      navigator.clipboard?.writeText(`Email: ${form.email}\nPassword: ${form.password}\nLogin at: ${window.location.origin}/auth`);
      setForm({ email: "", password: "", full_name: "", phone: "", company: "" });
      setOpen(false);
      load();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this supplier? Their auth account stays but they lose access.")) return;
    await supabase.from("suppliers" as any).delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" /> Suppliers
          </h2>
          <p className="text-muted-foreground text-sm">
            Add suppliers — they'll see orders for products linked to their email.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-green-500 gap-2">
              <Plus className="w-4 h-4" /> Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Supplier</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Email *</Label>
                <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="supplier@example.com" /></div>
              <div><Label>Password *</Label>
                <div className="flex gap-2">
                  <Input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="min 8 characters" />
                  <Button type="button" variant="outline" onClick={genPassword}>Generate</Button>
                </div>
              </div>
              <div><Label>Full Name</Label>
                <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Phone</Label>
                  <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <div><Label>Company</Label>
                  <Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
              </div>
              <Button onClick={create} disabled={saving} className="w-full bg-emerald-500 hover:bg-emerald-600">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Supplier"}
              </Button>
              <p className="text-xs text-muted-foreground">Credentials are copied to your clipboard after creation — share securely with the supplier.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (
        <div className="grid gap-3">
          {suppliers.length === 0 && (
            <Card><CardContent className="p-8 text-center text-muted-foreground">No suppliers yet. Add one to get started.</CardContent></Card>
          )}
          {suppliers.map(s => (
            <Card key={s.id} className="hover:shadow-md transition">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{s.full_name || s.email}</span>
                    {s.company && <Badge variant="secondary"><Building2 className="w-3 h-3 mr-1" />{s.company}</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground flex flex-wrap gap-3 mt-1">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{s.email}</span>
                    {s.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{s.phone}</span>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => { navigator.clipboard.writeText(s.email); toast({ title: "Email copied" }); }}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(s.id)} className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSuppliers;
