import { MessageCircle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  paymentInfo?: string;
  whatsappNumber: string;
}

const ProductCard = ({
  name,
  description,
  price,
  category,
  imageUrl,
  paymentInfo,
  whatsappNumber,
}: ProductCardProps) => {
  const handleWhatsAppBuy = () => {
    const message = encodeURIComponent(
      `🛒 *Order Request - MISAFA Technologies*\n\n` +
      `📦 *Product:* ${name}\n` +
      `💰 *Price:* KES ${price.toLocaleString()}\n` +
      `📂 *Category:* ${category}\n\n` +
      `📝 *Description:* ${description}\n\n` +
      `${paymentInfo ? `💳 *Payment Info:*\n${paymentInfo}\n\n` : ''}` +
      `I'm interested in purchasing this product. Please confirm availability and payment details.`
    );
    
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <Card className="group overflow-hidden bg-card border-border hover:border-secondary/50 transition-all duration-300 hover:shadow-card">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/20 to-accent/20">
            <Tag className="w-12 h-12 text-secondary/50" />
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
          {category}
        </Badge>
      </div>

      <CardContent className="p-5">
        {/* Product Info */}
        <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-1">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-bold text-foreground">
            KES {price.toLocaleString()}
          </span>
        </div>

        {/* WhatsApp Buy Button */}
        <Button
          onClick={handleWhatsAppBuy}
          className="w-full gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
        >
          <MessageCircle className="w-5 h-5" />
          Buy via WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
