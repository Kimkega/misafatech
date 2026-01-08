import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, MessageCircle, Star, Tag, Eye } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  payment_info: string | null;
  is_featured: boolean | null;
}

interface Category {
  id: string;
  name: string;
  icon: string | null;
}

interface ContactInfo {
  whatsapp_number: string;
}

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, contactRes] = await Promise.all([
        supabase.from("products").select("*").order("is_featured", { ascending: false }).order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name"),
        supabase.from("contact_info").select("whatsapp_number").limit(1).single(),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (contactRes.data) setContactInfo(contactRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const handleWhatsAppBuy = (product: Product) => {
    if (!contactInfo) return;
    
    const message = encodeURIComponent(
      `🛒 *Order Request - MISAFA Technologies*\n\n` +
      `📦 *Product:* ${product.name}\n` +
      `💰 *Price:* KES ${product.price.toLocaleString()}\n` +
      `📂 *Category:* ${product.category}\n\n` +
      `${product.description ? `📝 *Description:* ${product.description}\n\n` : ''}` +
      `${product.payment_info ? `💳 *Payment Info:*\n${product.payment_info}\n\n` : ''}` +
      `I'm interested in purchasing this product. Please confirm availability.`
    );
    
    const cleanNumber = contactInfo.whatsapp_number.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <section id="products" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-3">
            Our Products
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-3">
            Browse Our Catalog
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Quality tech products with installation & support. Click to order via WhatsApp.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <Button
            size="sm"
            variant={selectedCategory === "All" ? "default" : "outline"}
            onClick={() => setSelectedCategory("All")}
            className={selectedCategory === "All" ? "bg-gradient-accent text-primary-foreground" : ""}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={selectedCategory === category.name ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.name)}
              className={selectedCategory === category.name ? "bg-gradient-accent text-primary-foreground" : ""}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Products Available
            </h3>
            <p className="text-muted-foreground">
              {selectedCategory === "All"
                ? "Products will appear here once added."
                : `No products in "${selectedCategory}" yet.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-card rounded-xl border border-border overflow-hidden hover:border-secondary/50 hover:shadow-card transition-all duration-300"
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
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.is_featured && (
                        <Badge className="bg-yellow-500/90 text-yellow-950 text-xs gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>

                    {/* View Details Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex items-center gap-2 text-white text-sm font-medium">
                        <Eye className="w-4 h-4" />
                        View Details
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Info */}
                <div className="p-3 md:p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-foreground text-sm md:text-base line-clamp-1 group-hover:text-secondary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-3 min-h-[2rem]">
                    {product.description || "Quality product with warranty"}
                  </p>

                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-foreground text-sm md:text-base">
                      KES {product.price.toLocaleString()}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleWhatsAppBuy(product)}
                      className="h-8 px-3 gap-1.5 bg-green-500 hover:bg-green-600 text-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Buy</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
