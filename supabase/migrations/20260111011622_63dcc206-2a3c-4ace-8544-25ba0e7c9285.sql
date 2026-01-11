-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'mpesa', -- 'mpesa', 'manual'
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  mpesa_receipt TEXT,
  order_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  notes TEXT,
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- RLS policies for orders (admin only for now, public can insert)
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can view orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete orders" 
ON public.orders 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create mpesa_settings table
CREATE TABLE public.mpesa_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_type TEXT NOT NULL DEFAULT 'paybill', -- 'paybill' or 'till'
  consumer_key TEXT,
  consumer_secret TEXT,
  shortcode TEXT,
  passkey TEXT,
  callback_url TEXT,
  is_enabled BOOLEAN DEFAULT false,
  allow_manual_payment BOOLEAN DEFAULT true,
  environment TEXT DEFAULT 'sandbox', -- 'sandbox' or 'production'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on mpesa_settings
ALTER TABLE public.mpesa_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for mpesa_settings
CREATE POLICY "Anyone can view mpesa settings" 
ON public.mpesa_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert mpesa settings" 
ON public.mpesa_settings 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update mpesa settings" 
ON public.mpesa_settings 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create products bucket for image uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product images
CREATE POLICY "Anyone can view product images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'products' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update product images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'products' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete product images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'products' AND auth.uid() IS NOT NULL);

-- Insert default mpesa settings
INSERT INTO public.mpesa_settings (payment_type, is_enabled, allow_manual_payment)
VALUES ('paybill', false, true);

-- Create trigger for updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mpesa_settings_updated_at
BEFORE UPDATE ON public.mpesa_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || substr(NEW.id::text, 1, 8);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER generate_order_number_trigger
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.generate_order_number();