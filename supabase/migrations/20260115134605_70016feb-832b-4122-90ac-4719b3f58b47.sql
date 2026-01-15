-- Create SMS settings table for multiple African SMS providers
CREATE TABLE public.sms_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'africas_talking',
  is_enabled BOOLEAN DEFAULT false,
  api_key TEXT,
  api_secret TEXT,
  username TEXT,
  sender_id TEXT,
  environment TEXT DEFAULT 'sandbox',
  order_notification_enabled BOOLEAN DEFAULT true,
  status_update_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sms_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access (authenticated users can manage)
CREATE POLICY "Allow authenticated users to read sms_settings"
ON public.sms_settings
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert sms_settings"
ON public.sms_settings
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update sms_settings"
ON public.sms_settings
FOR UPDATE
TO authenticated
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_sms_settings_updated_at
BEFORE UPDATE ON public.sms_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default record
INSERT INTO public.sms_settings (provider, is_enabled) VALUES ('africas_talking', false);