-- Fix overly permissive sms_settings policies
DROP POLICY IF EXISTS "Allow authenticated users to insert sms_settings" ON public.sms_settings;
DROP POLICY IF EXISTS "Allow authenticated users to read sms_settings" ON public.sms_settings;
DROP POLICY IF EXISTS "Allow authenticated users to update sms_settings" ON public.sms_settings;

-- Create proper policies that check for admin role
CREATE POLICY "Admins can insert sms_settings"
ON public.sms_settings
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read sms_settings"
ON public.sms_settings
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update sms_settings"
ON public.sms_settings
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));