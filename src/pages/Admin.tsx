import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, LogOut, Plus, Pencil, Trash2, Loader2, 
  Package, Settings, ArrowLeft, Save, Star, Flame,
  Upload, Image as ImageIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  payment_info: string | null;
  is_featured: boolean | null;
  is_todays_deal: boolean | null;
}

interface Category {
  id: string;
  name: string;
}

interface ContactInfo {
  id: string;
  whatsapp_number: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  till_number: string | null;
  paybill_number: string | null;
  account_number: string | null;
}

interface SiteSettings {
  id: string;
  logo_url: string | null;
  site_name: string;
  tagline: string | null;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [savingContact, setSavingContact] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  
  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    payment_info: "",
    is_featured: false,
    is_todays_deal: false,
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      } else {
        fetchData();
      }
    });
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, contactRes, settingsRes] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name"),
        supabase.from("contact_info").select("*").limit(1).single(),
        supabase.from("site_settings").select("*").limit(1).single(),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (contactRes.data) setContactInfo(contactRes.data);
      if (settingsRes.data) setSiteSettings(settingsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image_url: "",
      payment_info: "",
      is_featured: false,
      is_todays_deal: false,
    });
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category,
      image_url: product.image_url || "",
      payment_info: product.payment_info || "",
      is_featured: product.is_featured || false,
      is_todays_deal: product.is_todays_deal || false,
    });
    setIsDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      toast({
        title: "Missing Fields",
        description: "Please fill in name, price, and category.",
        variant: "destructive",
      });
      return;
    }

    setSavingProduct(true);

    const productData = {
      name: productForm.name.trim(),
      description: productForm.description.trim() || null,
      price: parseFloat(productForm.price),
      category: productForm.category,
      image_url: productForm.image_url.trim() || null,
      payment_info: productForm.payment_info.trim() || null,
      is_featured: productForm.is_featured,
      is_todays_deal: productForm.is_todays_deal,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Product updated successfully!" });
        setIsDialogOpen(false);
        resetProductForm();
        fetchData();
      }
    } else {
      const { error } = await supabase.from("products").insert([productData]);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Product added successfully!" });
        setIsDialogOpen(false);
        resetProductForm();
        fetchData();
      }
    }
    setSavingProduct(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Product removed successfully." });
      fetchData();
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    const { error } = await supabase
      .from("products")
      .update({ is_featured: !product.is_featured })
      .eq("id", product.id);
    
    if (!error) {
      fetchData();
      toast({ title: product.is_featured ? "Removed from featured" : "Marked as featured" });
    }
  };

  const handleToggleDeal = async (product: Product) => {
    const { error } = await supabase
      .from("products")
      .update({ is_todays_deal: !product.is_todays_deal })
      .eq("id", product.id);
    
    if (!error) {
      fetchData();
      toast({ title: product.is_todays_deal ? "Removed from deals" : "Added to today's deals" });
    }
  };

  const handleSaveContact = async () => {
    if (!contactInfo) return;
    setSavingContact(true);

    const { error } = await supabase
      .from("contact_info")
      .update({
        whatsapp_number: contactInfo.whatsapp_number,
        email: contactInfo.email,
        phone: contactInfo.phone,
        address: contactInfo.address,
        till_number: contactInfo.till_number,
        paybill_number: contactInfo.paybill_number,
        account_number: contactInfo.account_number,
      })
      .eq("id", contactInfo.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Contact info updated successfully!" });
    }
    setSavingContact(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !siteSettings) return;
    
    const file = e.target.files[0];
    setUploadingLogo(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ logo_url: publicUrl })
        .eq('id', siteSettings.id);

      if (updateError) throw updateError;

      setSiteSettings({ ...siteSettings, logo_url: publicUrl });
      toast({ title: "Success", description: "Logo uploaded successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!siteSettings) return;
    setSavingSettings(true);

    const { error } = await supabase
      .from("site_settings")
      .update({
        site_name: siteSettings.site_name,
        tagline: siteSettings.tagline,
      })
      .eq("id", siteSettings.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Settings updated successfully!" });
    }
    setSavingSettings(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              {siteSettings?.logo_url ? (
                <img src={siteSettings.logo_url} alt="Logo" className="h-10 w-auto" />
              ) : (
                <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
              )}
              <span className="font-display font-bold text-lg">Admin Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                View Site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold">Products</h2>
                <p className="text-muted-foreground">Manage your product catalog</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetProductForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-accent hover:opacity-90">
                    <Plus className="w-4 h-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? "Edit Product" : "Add New Product"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Product Name *</Label>
                      <Input
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="e.g., 4-Channel CCTV Kit"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Price (KES) *</Label>
                        <Input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          placeholder="15000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category *</Label>
                        <Select
                          value={productForm.category}
                          onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.name}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="Product description..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input
                        value={productForm.image_url}
                        onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Info (shown in WhatsApp message)</Label>
                      <Textarea
                        value={productForm.payment_info}
                        onChange={(e) => setProductForm({ ...productForm, payment_info: e.target.value })}
                        placeholder="Till: 123456 | Paybill: 789012 Account: MISAFA"
                        rows={2}
                      />
                    </div>
                    
                    {/* Featured & Deal toggles */}
                    <div className="border-t pt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <Label>Featured Product</Label>
                        </div>
                        <Switch
                          checked={productForm.is_featured}
                          onCheckedChange={(checked) => setProductForm({ ...productForm, is_featured: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <Label>Today's Deal</Label>
                        </div>
                        <Switch
                          checked={productForm.is_todays_deal}
                          onCheckedChange={(checked) => setProductForm({ ...productForm, is_todays_deal: checked })}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSaveProduct}
                      className="w-full bg-gradient-accent hover:opacity-90"
                      disabled={savingProduct}
                    >
                      {savingProduct ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {editingProduct ? "Update Product" : "Add Product"}
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Products Table */}
            {products.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Products Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first product to get started.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-4 p-4">
                        {/* Image */}
                        <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">
                              {product.name}
                            </h3>
                            {product.is_featured && (
                              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 gap-1">
                                <Star className="w-3 h-3" /> Featured
                              </Badge>
                            )}
                            {product.is_todays_deal && (
                              <Badge variant="secondary" className="bg-orange-500/20 text-orange-600 gap-1">
                                <Flame className="w-3 h-3" /> Deal
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {product.category}
                          </p>
                          <p className="text-lg font-bold text-secondary">
                            KES {product.price.toLocaleString()}
                          </p>
                        </div>
                        {/* Actions */}
                        <div className="flex gap-2 flex-wrap justify-end">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleToggleFeatured(product)}
                            className={product.is_featured ? "text-yellow-500 border-yellow-500" : ""}
                            title="Toggle featured"
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleToggleDeal(product)}
                            className={product.is_todays_deal ? "text-orange-500 border-orange-500" : ""}
                            title="Toggle deal"
                          >
                            <Flame className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditDialog(product)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Site Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Site Settings
                </CardTitle>
                <CardDescription>
                  Update your logo and site information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {siteSettings && (
                  <>
                    {/* Logo Upload */}
                    <div className="space-y-4">
                      <Label>Logo</Label>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                          {siteSettings.logo_url ? (
                            <img src={siteSettings.logo_url} alt="Logo" className="w-full h-full object-contain" />
                          ) : (
                            <Shield className="w-10 h-10 text-muted-foreground/50" />
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload"
                          />
                          <label htmlFor="logo-upload">
                            <Button variant="outline" className="gap-2" asChild disabled={uploadingLogo}>
                              <span>
                                {uploadingLogo ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Upload className="w-4 h-4" />
                                )}
                                Upload Logo
                              </span>
                            </Button>
                          </label>
                          <p className="text-xs text-muted-foreground mt-2">
                            Recommended: 200x200px PNG or SVG
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Site Name</Label>
                        <Input
                          value={siteSettings.site_name}
                          onChange={(e) =>
                            setSiteSettings({ ...siteSettings, site_name: e.target.value })
                          }
                          placeholder="MISAFA TECHNOLOGIES"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tagline</Label>
                        <Input
                          value={siteSettings.tagline || ""}
                          onChange={(e) =>
                            setSiteSettings({ ...siteSettings, tagline: e.target.value })
                          }
                          placeholder="Powering, Protecting & Automating the Future"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSaveSettings}
                      className="bg-gradient-accent hover:opacity-90"
                      disabled={savingSettings}
                    >
                      {savingSettings ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Settings
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Contact & Payment Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Contact & Payment Settings</CardTitle>
                <CardDescription>
                  Update your contact information and payment details. These will be shown to customers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>WhatsApp Number *</Label>
                        <Input
                          value={contactInfo.whatsapp_number}
                          onChange={(e) =>
                            setContactInfo({ ...contactInfo, whatsapp_number: e.target.value })
                          }
                          placeholder="+254700000000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input
                          value={contactInfo.phone || ""}
                          onChange={(e) =>
                            setContactInfo({ ...contactInfo, phone: e.target.value })
                          }
                          placeholder="+254700000000"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          value={contactInfo.email || ""}
                          onChange={(e) =>
                            setContactInfo({ ...contactInfo, email: e.target.value })
                          }
                          placeholder="info@misafatech.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Input
                          value={contactInfo.address || ""}
                          onChange={(e) =>
                            setContactInfo({ ...contactInfo, address: e.target.value })
                          }
                          placeholder="Nairobi, Kenya"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">Payment Details (M-Pesa)</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Till Number</Label>
                          <Input
                            value={contactInfo.till_number || ""}
                            onChange={(e) =>
                              setContactInfo({ ...contactInfo, till_number: e.target.value })
                            }
                            placeholder="123456"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Paybill Number</Label>
                          <Input
                            value={contactInfo.paybill_number || ""}
                            onChange={(e) =>
                              setContactInfo({ ...contactInfo, paybill_number: e.target.value })
                            }
                            placeholder="789012"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Account Number</Label>
                          <Input
                            value={contactInfo.account_number || ""}
                            onChange={(e) =>
                              setContactInfo({ ...contactInfo, account_number: e.target.value })
                            }
                            placeholder="MISAFA"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleSaveContact}
                      className="bg-gradient-accent hover:opacity-90"
                      disabled={savingContact}
                    >
                      {savingContact ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Contact Info
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;