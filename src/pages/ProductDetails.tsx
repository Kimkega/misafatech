import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  ArrowLeft, 
  Shield, 
  Truck, 
  Headphones,
  Star,
  Check,
  Loader2,
  Flame,
  Share2,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface ContactInfo {
  whatsapp_number: string;
  phone: string | null;
  email: string | null;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProductData();
    }
  }, [id]);

  const fetchProductData = async () => {
    try {
      const [productRes, contactRes] = await Promise.all([
        supabase.from("products").select("*").eq("id", id).single(),
        supabase.from("contact_info").select("whatsapp_number, phone, email").limit(1).single(),
      ]);

      if (productRes.data) {
        setProduct(productRes.data);
        
        // Fetch related products from same category
        const relatedRes = await supabase
          .from("products")
          .select("*")
          .eq("category", productRes.data.category)
          .neq("id", id)
          .limit(4);
        
        if (relatedRes.data) {
          setRelatedProducts(relatedRes.data);
        }
      }
      
      if (contactRes.data) setContactInfo(contactRes.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppBuy = () => {
    if (!product || !contactInfo) return;
    
    const message = encodeURIComponent(
      `🛒 *Order Request - MISAFA Technologies*\n\n` +
      `📦 *Product:* ${product.name}\n` +
      `💰 *Price:* KES ${product.price.toLocaleString()}\n` +
      `📂 *Category:* ${product.category}\n\n` +
      `📝 *Description:* ${product.description}\n\n` +
      `${product.payment_info ? `💳 *Payment Info:*\n${product.payment_info}\n\n` : ''}` +
      `I'm interested in purchasing this product. Please confirm availability and payment details.`
    );
    
    const cleanNumber = contactInfo.whatsapp_number.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Check out ${product?.name} at MISAFA Technologies!`,
          url,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied!", description: "Product link copied to clipboard." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-secondary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/#products">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/#products" className="hover:text-secondary transition-colors">Products</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted border border-border shadow-lg">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/20 to-accent/20">
                    <Shield className="w-24 h-24 text-secondary/40" />
                  </div>
                )}
              </div>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_featured && (
                  <Badge className="bg-yellow-500 text-yellow-950 gap-1 shadow-lg">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </Badge>
                )}
                {product.is_todays_deal && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white gap-1 shadow-lg">
                    <Flame className="w-3 h-3" />
                    Today's Deal
                  </Badge>
                )}
              </div>

              {/* Share Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <Badge variant="outline" className="w-fit mb-4 text-secondary border-secondary">
                {product.category}
              </Badge>
              
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-foreground">
                  KES {product.price.toLocaleString()}
                </span>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Payment Info */}
              {product.payment_info && (
                <div className="bg-muted/50 rounded-xl p-4 mb-8 border border-border">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4 text-secondary" />
                    Payment Information
                  </h4>
                  <p className="text-muted-foreground text-sm whitespace-pre-line">
                    {product.payment_info}
                  </p>
                </div>
              )}

              {/* Buy Button */}
              <Button
                onClick={handleWhatsAppBuy}
                size="lg"
                className="w-full gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg py-6 mb-8 shadow-lg"
              >
                <MessageCircle className="w-6 h-6" />
                Order via WhatsApp
              </Button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Shield, label: "Genuine Products" },
                  { icon: Truck, label: "Countrywide Delivery" },
                  { icon: Headphones, label: "24/7 Support" },
                ].map((badge, index) => (
                  <div key={index} className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/30 border border-border">
                    <badge.icon className="w-6 h-6 text-secondary mb-2" />
                    <span className="text-xs text-muted-foreground">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link 
                    key={relatedProduct.id} 
                    to={`/product/${relatedProduct.id}`}
                    className="group"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border mb-3 group-hover:border-secondary/50 transition-colors">
                      {relatedProduct.image_url ? (
                        <img
                          src={relatedProduct.image_url}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/20 to-accent/20">
                          <Shield className="w-8 h-8 text-secondary/40" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-foreground group-hover:text-secondary transition-colors line-clamp-1">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-secondary font-bold">
                      KES {relatedProduct.price.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;