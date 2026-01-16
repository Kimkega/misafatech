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
  Upload, Image as ImageIcon, Tag, ShoppingBag, CreditCard,
  Mail, ChevronRight, LayoutDashboard, TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import AdminStats from "@/components/admin/AdminStats";
import AdminSales from "@/components/admin/AdminSales";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminSmsSettings from "@/components/admin/AdminSmsSettings";

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
  description: string | null;
  icon: string | null;
  parent_id: string | null;
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

interface MpesaSettings {
  id: string;
  payment_type: string;
  consumer_key: string | null;
  consumer_secret: string | null;
  shortcode: string | null;
  passkey: string | null;
  is_enabled: boolean;
  allow_manual_payment: boolean;
  environment: string;
  callback_url: string | null;
}

interface EmailSettings {
  id: string;
  smtp_host: string | null;
  smtp_port: number;
  smtp_user: string | null;
  smtp_password: string | null;
  from_email: string | null;
  from_name: string | null;
  admin_email: string | null;
  order_notification_enabled: boolean;
  customer_notification_enabled: boolean;
}

interface SmsSettings {
  id: string;
  provider: string;
  is_enabled: boolean;
  api_key: string | null;
  api_secret: string | null;
  username: string | null;
  sender_id: string | null;
  environment: string;
  order_notification_enabled: boolean;
  status_update_enabled: boolean;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  product_name: string;
  quantity: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  mpesa_receipt: string | null;
  order_status: string;
  notes: string | null;
  shipping_address: string | null;
  created_at: string;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [mpesaSettings, setMpesaSettings] = useState<MpesaSettings | null>(null);
  const [emailSettings, setEmailSettings] = useState<EmailSettings | null>(null);
  const [smsSettings, setSmsSettings] = useState<SmsSettings | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [savingContact, setSavingContact] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingMpesa, setSavingMpesa] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingProductImage, setUploadingProductImage] = useState(false);
  
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

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    icon: "",
    parent_id: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    
    if (error) {
      console.error("Error checking admin role:", error);
      setIsAdmin(false);
      return false;
    }
    
    const hasAdminRole = !!data;
    setIsAdmin(hasAdminRole);
    return hasAdminRole;
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      } else {
        const hasAdmin = await checkAdminRole(session.user.id);
        if (!hasAdmin) {
          toast({ 
            title: "Access Denied", 
            description: "You don't have admin privileges.", 
            variant: "destructive" 
          });
          navigate("/");
        } else {
          fetchData();
        }
      }
    });
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, contactRes, settingsRes, mpesaRes, emailRes, smsRes, ordersRes] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name"),
        supabase.from("contact_info").select("*").limit(1).maybeSingle(),
        supabase.from("site_settings").select("*").limit(1).maybeSingle(),
        supabase.from("mpesa_settings").select("*").limit(1).maybeSingle(),
        supabase.from("email_settings").select("*").limit(1).maybeSingle(),
        supabase.from("sms_settings").select("*").limit(1).maybeSingle(),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data as Category[]);
      if (contactRes.data) setContactInfo(contactRes.data);
      if (settingsRes.data) setSiteSettings(settingsRes.data);
      if (mpesaRes.data) setMpesaSettings(mpesaRes.data as MpesaSettings);
      if (emailRes.data) setEmailSettings(emailRes.data as EmailSettings);
      if (smsRes.data) setSmsSettings(smsRes.data as SmsSettings);
      if (ordersRes.data) setOrders(ordersRes.data as Order[]);
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

  const resetCategoryForm = () => {
    setCategoryForm({ name: "", description: "", icon: "", parent_id: "" });
    setEditingCategory(null);
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

  const openEditCategoryDialog = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
      parent_id: category.parent_id || "",
    });
    setIsCategoryDialogOpen(true);
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    setUploadingProductImage(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `product-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      setProductForm({ ...productForm, image_url: publicUrl });
      toast({ title: "Success", description: "Image uploaded successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUploadingProductImage(false);
    }
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

  const handleSaveCategory = async () => {
    if (!categoryForm.name) {
      toast({ title: "Missing Fields", description: "Please enter a category name.", variant: "destructive" });
      return;
    }

    setSavingCategory(true);

    const categoryData = {
      name: categoryForm.name.trim(),
      description: categoryForm.description.trim() || null,
      icon: categoryForm.icon.trim() || null,
      parent_id: categoryForm.parent_id && categoryForm.parent_id !== "none" ? categoryForm.parent_id : null,
    };

    if (editingCategory) {
      const { error } = await supabase.from("categories").update(categoryData).eq("id", editingCategory.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Category updated!" });
        setIsCategoryDialogOpen(false);
        resetCategoryForm();
        fetchData();
      }
    } else {
      const { error } = await supabase.from("categories").insert([categoryData]);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Category added!" });
        setIsCategoryDialogOpen(false);
        resetCategoryForm();
        fetchData();
      }
    }
    setSavingCategory(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Category removed." });
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

  const handleSaveMpesaSettings = async () => {
    if (!mpesaSettings) return;
    setSavingMpesa(true);

    const { error } = await supabase
      .from("mpesa_settings")
      .update({
        payment_type: mpesaSettings.payment_type,
        consumer_key: mpesaSettings.consumer_key,
        consumer_secret: mpesaSettings.consumer_secret,
        shortcode: mpesaSettings.shortcode,
        passkey: mpesaSettings.passkey,
        is_enabled: mpesaSettings.is_enabled,
        allow_manual_payment: mpesaSettings.allow_manual_payment,
        environment: mpesaSettings.environment,
        callback_url: mpesaSettings.callback_url,
      } as any)
      .eq("id", mpesaSettings.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "M-Pesa settings updated!" });
    }
    setSavingMpesa(false);
  };

  const handleSaveEmailSettings = async () => {
    if (!emailSettings) return;
    setSavingEmail(true);

    const { error } = await supabase
      .from("email_settings")
      .update({
        smtp_host: emailSettings.smtp_host,
        smtp_port: emailSettings.smtp_port,
        smtp_user: emailSettings.smtp_user,
        smtp_password: emailSettings.smtp_password,
        from_email: emailSettings.from_email,
        from_name: emailSettings.from_name,
        admin_email: emailSettings.admin_email,
        order_notification_enabled: emailSettings.order_notification_enabled,
        customer_notification_enabled: emailSettings.customer_notification_enabled,
      } as any)
      .eq("id", emailSettings.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Email settings updated!" });
    }
    setSavingEmail(false);
  };

  const handleUpdateOrderStatus = async (orderId: string, field: 'order_status' | 'payment_status', value: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ [field]: value } as any)
      .eq("id", orderId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: "Order updated successfully." });
      fetchData();
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      confirmed: "bg-green-100 text-green-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-emerald-100 text-emerald-800",
      completed: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-red-100 text-red-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Get parent categories (categories without parent_id)
  const parentCategories = categories.filter(c => !c.parent_id);
  
  // Get subcategories grouped by parent
  const getSubcategories = (parentId: string) => categories.filter(c => c.parent_id === parentId);

  // Get all category names for product form (including subcategories)
  const getCategoryDisplayName = (cat: Category) => {
    if (cat.parent_id) {
      const parent = categories.find(c => c.id === cat.parent_id);
      return parent ? `${parent.name} → ${cat.name}` : cat.name;
    }
    return cat.name;
  };

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        <p className="text-muted-foreground">Verifying admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background gap-4">
        <Shield className="w-16 h-16 text-destructive" />
        <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
        <p className="text-muted-foreground">You don't have admin privileges to access this page.</p>
        <Link to="/">
          <Button className="gap-2 mt-4">
            <ArrowLeft className="w-4 h-4" />
            Go Back Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-primary-foreground sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              {siteSettings?.logo_url ? (
                <img src={siteSettings.logo_url} alt="Logo" className="h-10 w-auto" />
              ) : (
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
              )}
              <span className="font-display font-bold text-lg">Admin Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="secondary" size="sm" className="gap-2 bg-white/20 hover:bg-white/30 text-white border-0">
                <ArrowLeft className="w-4 h-4" />
                View Site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-white hover:bg-white/20">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-8 bg-card border shadow-sm flex-wrap h-auto gap-1 p-1.5">
            <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="sales" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4" />
              Sales
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <ShoppingBag className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
              <Tag className="w-4 h-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-600 data-[state=active]:to-gray-700 data-[state=active]:text-white">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Dashboard Overview</h2>
              <p className="text-muted-foreground">Your store performance at a glance</p>
            </div>
            <AdminStats orders={orders as any} products={products} />
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Sales Analytics</h2>
              <p className="text-muted-foreground">Track your M-Pesa payments and revenue</p>
            </div>
            <AdminSales orders={orders as any} />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Order Management</h2>
              <p className="text-muted-foreground">View and manage customer orders</p>
            </div>
            <AdminOrders orders={orders as any} onRefresh={fetchData} />
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">Products</h2>
                <p className="text-muted-foreground">Manage your product catalog</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetProductForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600">
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
                                {getCategoryDisplayName(cat)}
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

                    {/* Image Upload Section */}
                    <div className="space-y-2">
                      <Label>Product Image</Label>
                      <div className="flex gap-4 items-start">
                        <div className="w-24 h-24 rounded-lg bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                          {productForm.image_url ? (
                            <img src={productForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProductImageUpload}
                            className="hidden"
                            id="product-image-upload"
                          />
                          <label htmlFor="product-image-upload">
                            <Button variant="outline" className="gap-2 w-full" asChild disabled={uploadingProductImage}>
                              <span>
                                {uploadingProductImage ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Upload className="w-4 h-4" />
                                )}
                                Upload Image
                              </span>
                            </Button>
                          </label>
                          <Input
                            value={productForm.image_url}
                            onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                            placeholder="Or paste image URL..."
                            className="text-xs"
                          />
                        </div>
                      </div>
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
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-500"
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

            {/* Products Grid */}
            {products.length === 0 ? (
              <Card className="p-12 text-center bg-gradient-to-br from-card to-muted/30">
                <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Products Yet</h3>
                <p className="text-muted-foreground mb-4">Add your first product to get started.</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden bg-gradient-to-r from-card to-card/80 hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-4 p-4">
                        <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-green-50">
                              <Package className="w-8 h-8 text-emerald-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
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
                          <p className="text-sm text-muted-foreground truncate">{product.category}</p>
                          <p className="text-lg font-bold text-secondary">KES {product.price.toLocaleString()}</p>
                        </div>
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
                          <Button variant="outline" size="icon" onClick={() => openEditDialog(product)}>
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

          {/* Categories Tab */}
          <TabsContent value="categories">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">Categories</h2>
                <p className="text-muted-foreground">Manage categories and subcategories</p>
              </div>
              <Dialog open={isCategoryDialogOpen} onOpenChange={(open) => {
                setIsCategoryDialogOpen(open);
                if (!open) resetCategoryForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600">
                    <Plus className="w-4 h-4" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Category Name *</Label>
                      <Input
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        placeholder="e.g., Solar Panels"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Parent Category (for subcategory)</Label>
                      <Select
                        value={categoryForm.parent_id || "none"}
                        onValueChange={(value) => setCategoryForm({ ...categoryForm, parent_id: value === "none" ? "" : value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="None (top-level category)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None (top-level category)</SelectItem>
                          {parentCategories
                            .filter(c => c.id !== editingCategory?.id)
                            .map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        placeholder="Category description..."
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon (Lucide icon name)</Label>
                      <Input
                        value={categoryForm.icon}
                        onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                        placeholder="e.g., sun, battery, cpu"
                      />
                    </div>
                    <Button
                      onClick={handleSaveCategory}
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-500"
                      disabled={savingCategory}
                    >
                      {savingCategory ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {editingCategory ? "Update Category" : "Add Category"}
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {categories.length === 0 ? (
              <Card className="p-12 text-center bg-gradient-to-br from-card to-muted/30">
                <Tag className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Categories Yet</h3>
                <p className="text-muted-foreground mb-4">Add your first category to organize products.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {parentCategories.map((category) => {
                  const subcats = getSubcategories(category.id);
                  return (
                    <Card key={category.id} className="bg-gradient-to-br from-card to-muted/30 hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                            {category.description && (
                              <p className="text-sm text-muted-foreground">{category.description}</p>
                            )}
                            {category.icon && (
                              <Badge variant="outline" className="mt-2 text-xs">{category.icon}</Badge>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEditCategoryDialog(category)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Subcategories */}
                        {subcats.length > 0 && (
                          <div className="mt-4 pl-4 border-l-2 border-emerald-200 space-y-2">
                            {subcats.map((subcat) => (
                              <div key={subcat.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">{subcat.name}</span>
                                  {subcat.icon && (
                                    <Badge variant="outline" className="text-xs">{subcat.icon}</Badge>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => openEditCategoryDialog(subcat)}>
                                    <Pencil className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteCategory(subcat.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Site Settings */}
            <Card className="bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Site Settings
                </CardTitle>
                <CardDescription>Update your logo and site information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {siteSettings && (
                  <>
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
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                          <label htmlFor="logo-upload">
                            <Button variant="outline" className="gap-2" asChild disabled={uploadingLogo}>
                              <span>
                                {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                Upload Logo
                              </span>
                            </Button>
                          </label>
                          <p className="text-xs text-muted-foreground mt-2">Recommended: 200x200px PNG or SVG</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Site Name</Label>
                        <Input
                          value={siteSettings.site_name}
                          onChange={(e) => setSiteSettings({ ...siteSettings, site_name: e.target.value })}
                          placeholder="MISAFA TECHNOLOGIES"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tagline</Label>
                        <Input
                          value={siteSettings.tagline || ""}
                          onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                          placeholder="Powering, Protecting & Automating the Future"
                        />
                      </div>
                    </div>

                    <Button onClick={handleSaveSettings} className="bg-gradient-to-r from-emerald-500 to-green-500" disabled={savingSettings}>
                      {savingSettings ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      Save Settings
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* M-Pesa Settings */}
            <Card className="bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  M-Pesa Daraja Settings
                </CardTitle>
                <CardDescription>Configure M-Pesa Express integration (STK Push)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {mpesaSettings && (
                  <>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                      <div>
                        <Label className="text-base">Enable M-Pesa Express (STK Push)</Label>
                        <p className="text-sm text-muted-foreground">Automatic payment prompt sent to customer's phone</p>
                      </div>
                      <Switch
                        checked={mpesaSettings.is_enabled}
                        onCheckedChange={(checked) => setMpesaSettings({ ...mpesaSettings, is_enabled: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                      <div>
                        <Label className="text-base">Allow Manual Payment</Label>
                        <p className="text-sm text-muted-foreground">Let customers pay manually via Till/Paybill</p>
                      </div>
                      <Switch
                        checked={mpesaSettings.allow_manual_payment}
                        onCheckedChange={(checked) => setMpesaSettings({ ...mpesaSettings, allow_manual_payment: checked })}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Payment Type</Label>
                        <Select
                          value={mpesaSettings.payment_type}
                          onValueChange={(value) => setMpesaSettings({ ...mpesaSettings, payment_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paybill">Paybill (CustomerPayBillOnline)</SelectItem>
                            <SelectItem value="till">Till/Buy Goods (CustomerBuyGoodsOnline)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          {mpesaSettings.payment_type === 'paybill' 
                            ? 'Paybill: Shortcode is Paybill Number. Customer enters Account Number.' 
                            : 'Till/Buy Goods: Shortcode is Till Number. No account number needed.'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Environment</Label>
                        <Select
                          value={mpesaSettings.environment}
                          onValueChange={(value) => setMpesaSettings({ ...mpesaSettings, environment: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                            <SelectItem value="production">Production (Live)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Consumer Key</Label>
                        <Input
                          type="password"
                          value={mpesaSettings.consumer_key || ""}
                          onChange={(e) => setMpesaSettings({ ...mpesaSettings, consumer_key: e.target.value })}
                          placeholder="From Daraja portal"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Consumer Secret</Label>
                        <Input
                          type="password"
                          value={mpesaSettings.consumer_secret || ""}
                          onChange={(e) => setMpesaSettings({ ...mpesaSettings, consumer_secret: e.target.value })}
                          placeholder="From Daraja portal"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Shortcode ({mpesaSettings.payment_type === 'paybill' ? 'Paybill Number' : 'Till Number'})</Label>
                        <Input
                          value={mpesaSettings.shortcode || ""}
                          onChange={(e) => setMpesaSettings({ ...mpesaSettings, shortcode: e.target.value })}
                          placeholder={mpesaSettings.payment_type === 'paybill' ? '174379' : '123456'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Passkey (Lipa Na M-Pesa Online Passkey)</Label>
                        <Input
                          type="password"
                          value={mpesaSettings.passkey || ""}
                          onChange={(e) => setMpesaSettings({ ...mpesaSettings, passkey: e.target.value })}
                          placeholder="From Daraja portal"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Callback URL (Optional)</Label>
                      <Input
                        value={mpesaSettings.callback_url || ""}
                        onChange={(e) => setMpesaSettings({ ...mpesaSettings, callback_url: e.target.value })}
                        placeholder="Leave empty to use default"
                      />
                      <p className="text-xs text-muted-foreground">
                        URL that receives payment confirmation from Safaricom. Leave empty to use automatic callback.
                      </p>
                    </div>

                    <Button onClick={handleSaveMpesaSettings} className="bg-gradient-to-r from-emerald-500 to-green-500" disabled={savingMpesa}>
                      {savingMpesa ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      Save M-Pesa Settings
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Email Settings */}
            <Card className="bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>Configure SMTP for order notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {emailSettings && (
                  <>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                      <div>
                        <Label className="text-base">Admin Order Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive email when new orders are placed</p>
                      </div>
                      <Switch
                        checked={emailSettings.order_notification_enabled}
                        onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, order_notification_enabled: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                      <div>
                        <Label className="text-base">Customer Confirmation Emails</Label>
                        <p className="text-sm text-muted-foreground">Send order confirmation to customers</p>
                      </div>
                      <Switch
                        checked={emailSettings.customer_notification_enabled}
                        onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, customer_notification_enabled: checked })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Admin Email (receives order notifications)</Label>
                      <Input
                        type="email"
                        value={emailSettings.admin_email || ""}
                        onChange={(e) => setEmailSettings({ ...emailSettings, admin_email: e.target.value })}
                        placeholder="admin@yourstore.com"
                      />
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-semibold mb-4">SMTP Configuration</h4>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>SMTP Host</Label>
                          <Input
                            value={emailSettings.smtp_host || ""}
                            onChange={(e) => setEmailSettings({ ...emailSettings, smtp_host: e.target.value })}
                            placeholder="smtp.gmail.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>SMTP Port</Label>
                          <Input
                            type="number"
                            value={emailSettings.smtp_port || 587}
                            onChange={(e) => setEmailSettings({ ...emailSettings, smtp_port: parseInt(e.target.value) })}
                            placeholder="587"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label>SMTP Username</Label>
                          <Input
                            value={emailSettings.smtp_user || ""}
                            onChange={(e) => setEmailSettings({ ...emailSettings, smtp_user: e.target.value })}
                            placeholder="your-email@gmail.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>SMTP Password / App Password</Label>
                          <Input
                            type="password"
                            value={emailSettings.smtp_password || ""}
                            onChange={(e) => setEmailSettings({ ...emailSettings, smtp_password: e.target.value })}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label>From Email</Label>
                          <Input
                            type="email"
                            value={emailSettings.from_email || ""}
                            onChange={(e) => setEmailSettings({ ...emailSettings, from_email: e.target.value })}
                            placeholder="noreply@yourstore.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>From Name</Label>
                          <Input
                            value={emailSettings.from_name || ""}
                            onChange={(e) => setEmailSettings({ ...emailSettings, from_name: e.target.value })}
                            placeholder="Your Store Name"
                          />
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleSaveEmailSettings} className="bg-gradient-to-r from-emerald-500 to-green-500" disabled={savingEmail}>
                      {savingEmail ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      Save Email Settings
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* SMS Settings */}
            <AdminSmsSettings smsSettings={smsSettings} setSmsSettings={setSmsSettings} />

            {/* Contact Info */}
            <Card className="bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Update your contact details and payment info</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>WhatsApp Number</Label>
                        <Input
                          value={contactInfo.whatsapp_number}
                          onChange={(e) => setContactInfo({ ...contactInfo, whatsapp_number: e.target.value })}
                          placeholder="+254712345678"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input
                          value={contactInfo.phone || ""}
                          onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                          placeholder="+254700000000"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          value={contactInfo.email || ""}
                          onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                          placeholder="info@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Input
                          value={contactInfo.address || ""}
                          onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                          placeholder="Nairobi, Kenya"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-semibold mb-4">Manual Payment Details (shown to customers)</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Till Number</Label>
                          <Input
                            value={contactInfo.till_number || ""}
                            onChange={(e) => setContactInfo({ ...contactInfo, till_number: e.target.value })}
                            placeholder="123456"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Paybill Number</Label>
                          <Input
                            value={contactInfo.paybill_number || ""}
                            onChange={(e) => setContactInfo({ ...contactInfo, paybill_number: e.target.value })}
                            placeholder="789012"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Account Number</Label>
                          <Input
                            value={contactInfo.account_number || ""}
                            onChange={(e) => setContactInfo({ ...contactInfo, account_number: e.target.value })}
                            placeholder="Your Name/ID"
                          />
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleSaveContact} className="bg-gradient-to-r from-emerald-500 to-green-500" disabled={savingContact}>
                      {savingContact ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
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
