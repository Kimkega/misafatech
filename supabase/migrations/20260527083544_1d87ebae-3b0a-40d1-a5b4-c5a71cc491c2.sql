CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  product_id uuid,
  product_name text NOT NULL,
  supplier_email text,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  line_total numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.order_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create order items"
ON public.order_items
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can manage all order items"
ON public.order_items
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Suppliers can view their product order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'supplier'::app_role)
  AND (
    supplier_email = auth.email()
    OR public.is_supplier_of_product(auth.uid(), product_id)
  )
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_supplier_email ON public.order_items(lower(supplier_email));

CREATE TABLE IF NOT EXISTS public.supplier_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_email text NOT NULL,
  supplier_user_id uuid,
  order_id uuid NOT NULL,
  order_number text NOT NULL,
  product_id uuid,
  product_name text NOT NULL,
  message text NOT NULL,
  quick_link text NOT NULL,
  channel text NOT NULL DEFAULT 'email',
  status text NOT NULL DEFAULT 'pending',
  error_message text,
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.supplier_notifications TO authenticated;
GRANT ALL ON public.supplier_notifications TO service_role;

ALTER TABLE public.supplier_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage supplier notifications"
ON public.supplier_notifications
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Suppliers can view own notifications"
ON public.supplier_notifications
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'supplier'::app_role)
  AND (supplier_user_id = auth.uid() OR supplier_email = auth.email())
);

CREATE POLICY "Suppliers can mark own notifications read"
ON public.supplier_notifications
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'supplier'::app_role)
  AND (supplier_user_id = auth.uid() OR supplier_email = auth.email())
)
WITH CHECK (
  public.has_role(auth.uid(), 'supplier'::app_role)
  AND (supplier_user_id = auth.uid() OR supplier_email = auth.email())
);

CREATE INDEX IF NOT EXISTS idx_supplier_notifications_supplier_email ON public.supplier_notifications(lower(supplier_email));
CREATE INDEX IF NOT EXISTS idx_supplier_notifications_order_id ON public.supplier_notifications(order_id);

CREATE OR REPLACE FUNCTION public.supplier_can_access_order(_user_id uuid, _order_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.order_items oi
    LEFT JOIN public.suppliers s ON lower(s.email) = lower(oi.supplier_email)
    WHERE oi.order_id = _order_id
      AND (
        s.user_id = _user_id
        OR lower(oi.supplier_email) = lower((SELECT email FROM auth.users WHERE id = _user_id))
        OR public.is_supplier_of_product(_user_id, oi.product_id)
      )
  )
  OR EXISTS (
    SELECT 1
    FROM public.orders o
    WHERE o.id = _order_id
      AND public.is_supplier_of_product(_user_id, o.product_id)
  )
$$;

DROP POLICY IF EXISTS "Suppliers view their product orders" ON public.orders;
DROP POLICY IF EXISTS "Suppliers update their product orders" ON public.orders;

CREATE POLICY "Suppliers view their assigned orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.supplier_can_access_order(auth.uid(), id));

CREATE POLICY "Suppliers update assigned order fulfillment"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.supplier_can_access_order(auth.uid(), id));