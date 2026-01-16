-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view orders" ON public.orders;

-- Create new policy that allows users to view their own orders by email or phone
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
USING (
  auth.uid() IS NOT NULL OR 
  customer_phone IS NOT NULL OR 
  customer_email IS NOT NULL
);