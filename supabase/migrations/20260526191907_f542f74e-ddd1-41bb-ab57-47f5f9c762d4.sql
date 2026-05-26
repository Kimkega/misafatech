
-- 1. Add 'supplier' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'supplier';

-- 2. Add supplier_email column to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS supplier_email TEXT;
CREATE INDEX IF NOT EXISTS idx_products_supplier_email ON public.products(supplier_email);

-- 3. Suppliers table
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  company TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.suppliers TO authenticated;
GRANT ALL ON public.suppliers TO service_role;

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage suppliers"
ON public.suppliers FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Suppliers view own record"
ON public.suppliers FOR SELECT TO authenticated
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Suppliers update own record"
ON public.suppliers FOR UPDATE TO authenticated
USING (user_id = auth.uid() OR email = auth.email());

CREATE TRIGGER suppliers_updated_at
BEFORE UPDATE ON public.suppliers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Helper function: is current user the supplier of a given product?
CREATE OR REPLACE FUNCTION public.is_supplier_of_product(_user_id UUID, _product_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.products p
    JOIN public.suppliers s ON s.email = p.supplier_email
    WHERE p.id = _product_id
      AND (s.user_id = _user_id OR s.email = (SELECT email FROM auth.users WHERE id = _user_id))
  )
$$;

-- 5. Allow suppliers to view & update their orders
CREATE POLICY "Suppliers view their product orders"
ON public.orders FOR SELECT TO authenticated
USING (public.is_supplier_of_product(auth.uid(), product_id));

CREATE POLICY "Suppliers update their product orders"
ON public.orders FOR UPDATE TO authenticated
USING (public.is_supplier_of_product(auth.uid(), product_id));
