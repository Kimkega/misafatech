import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Package, MessageCircle, Star, Tag, Eye, Search, X, ShoppingCart } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredProducts = useMemo(() => {
    let result = products;
    
    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    
    // Filter by search query (realtime)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((p) => 
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [products, selectedCategory, searchQuery]);

  const handleWhatsAppBuy = (product: Product) => {
    if (!contactInfo) return;
    
    const message = encodeURIComponent(
      `🛒 *Order Request*\n\n` +
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
    <section id="products" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-3">
            Our Products
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-3">
            Browse Our Catalog
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Quality tech products with installation & support. Click to order via WhatsApp.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products by name, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 rounded-full border-2 border-emerald-200 focus:border-emerald-500 bg-card"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <Button
            size="sm"
            variant={selectedCategory === "All" ? "default" : "outline"}
            onClick={() => setSelectedCategory("All")}
            className={selectedCategory === "All" ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0" : ""}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={selectedCategory === category.name ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.name)}
              className={selectedCategory === category.name ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0" : ""}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchQuery ? "No products found" : "No Products Available"}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? `No products match "${searchQuery}". Try a different search term.`
                : selectedCategory === "All"
                  ? "Products will appear here once added."
                  : `No products in "${selectedCategory}" yet.`}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-4">
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-card rounded-xl border border-border overflow-hidden hover:border-emerald-400 hover:shadow-lg transition-all duration-300"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-green-50">
                        <Tag className="w-10 h-10 text-emerald-300" />
                      </div>
                    )}
                    
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.is_featured && (
                        <Badge className="bg-yellow-500/90 text-yellow-950 text-xs gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                        {product.category}
                      </Badge>
                    </div>

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex items-center gap-2 text-white text-sm font-medium">
                        <Eye className="w-4 h-4" />
                        View Details
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="p-3 md:p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-foreground text-sm md:text-base line-clamp-1 group-hover:text-emerald-600 transition-colors">
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