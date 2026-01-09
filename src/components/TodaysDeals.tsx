import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, MessageCircle, Clock, Zap, Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
}

interface ContactInfo {
  whatsapp_number: string;
}

const TodaysDeals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, contactRes] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .eq("is_todays_deal", true)
          .order("created_at", { ascending: false })
          .limit(8),
        supabase.from("contact_info").select("whatsapp_number").limit(1).single(),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (contactRes.data) setContactInfo(contactRes.data);
    } catch (error) {
      console.error("Error fetching deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppBuy = (product: Product) => {
    if (!contactInfo) return;
    
    const message = encodeURIComponent(
      `🔥 *TODAY'S DEAL - MISAFA Technologies*\n\n` +
      `📦 *Product:* ${product.name}\n` +
      `💰 *Price:* KES ${product.price.toLocaleString()}\n\n` +
      `I want to grab this deal! Please confirm availability.`
    );
    
    const cleanNumber = contactInfo.whatsapp_number.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-background">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white mb-4 animate-pulse">
            <Flame className="w-5 h-5" />
            <span className="font-bold">HOT DEALS</span>
            <Flame className="w-5 h-5" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Today's Special Offers
          </h2>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            Limited time offers - Don't miss out!
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group relative bg-card rounded-2xl border-2 border-orange-500/30 overflow-hidden hover:border-orange-500 hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)] transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Deal Badge */}
              <div className="absolute top-0 right-0 z-10">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 text-xs font-bold rounded-bl-xl flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  DEAL
                </div>
              </div>

              {/* Image */}
              <Link to={`/product/${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-red-500/20">
                      <Flame className="w-12 h-12 text-orange-500/40" />
                    </div>
                  )}
                </div>
              </Link>

              {/* Info */}
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-orange-500 transition-colors mb-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-muted-foreground mb-3">{product.category}</p>
                
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-lg text-foreground">
                    KES {product.price.toLocaleString()}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleWhatsAppBuy(product)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white gap-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Buy
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TodaysDeals;