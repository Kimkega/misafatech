import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MessageCircle, ArrowRight, Loader2, Tag } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_featured: boolean | null;
}

interface ContactInfo {
  whatsapp_number: string;
}

const FeaturedProducts = () => {
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
          .eq("is_featured", true)
          .order("created_at", { ascending: false })
          .limit(6),
        supabase.from("contact_info").select("whatsapp_number").limit(1).single(),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (contactRes.data) setContactInfo(contactRes.data);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppBuy = (product: Product) => {
    if (!contactInfo) return;
    
    const message = encodeURIComponent(
      `🛒 *Order Request - MISAFA Technologies*\n\n` +
      `📦 *Product:* ${product.name}\n` +
      `💰 *Price:* KES ${product.price.toLocaleString()}\n` +
      `📂 *Category:* ${product.category}\n\n` +
      `I'm interested in purchasing this product. Please confirm availability.`
    );
    
    const cleanNumber = contactInfo.whatsapp_number.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium text-secondary">Featured</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Top Picks for You
            </h2>
          </div>
          <a href="#products">
            <Button variant="ghost" className="gap-2 text-secondary hover:text-secondary">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:border-secondary/50 hover:shadow-card transition-all duration-300"
            >
              {/* Image */}
              <Link to={`/product/${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/20 to-accent/20">
                      <Tag className="w-10 h-10 text-secondary/40" />
                    </div>
                  )}
                  <Badge className="absolute top-2 left-2 bg-yellow-500/90 text-yellow-950 text-xs gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </Badge>
                </div>
              </Link>

              {/* Info */}
              <div className="p-3">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-medium text-foreground text-sm line-clamp-1 group-hover:text-secondary transition-colors mb-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">
                    KES {product.price.toLocaleString()}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleWhatsAppBuy(product)}
                    className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600"
                  >
                    <MessageCircle className="w-4 h-4" />
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

export default FeaturedProducts;
