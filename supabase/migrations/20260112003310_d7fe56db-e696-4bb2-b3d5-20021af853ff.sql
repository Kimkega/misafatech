-- Add parent_id to categories for subcategories support
ALTER TABLE public.categories ADD COLUMN parent_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;

-- Create email_settings table for SMTP configuration
CREATE TABLE public.email_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  smtp_host text,
  smtp_port integer DEFAULT 587,
  smtp_user text,
  smtp_password text,
  from_email text,
  from_name text DEFAULT 'Store',
  admin_email text,
  order_notification_enabled boolean DEFAULT true,
  customer_notification_enabled boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on email_settings
ALTER TABLE public.email_settings ENABLE ROW LEVEL SECURITY;

-- Policies for email_settings
CREATE POLICY "Authenticated users can view email settings" ON public.email_settings
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert email settings" ON public.email_settings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update email settings" ON public.email_settings
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create trigger for email_settings updated_at
CREATE TRIGGER update_email_settings_updated_at
  BEFORE UPDATE ON public.email_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default email settings
INSERT INTO public.email_settings (smtp_host, smtp_port, from_name) 
VALUES ('smtp.gmail.com', 587, 'Store')
ON CONFLICT DO NOTHING;