-- Fix the cart_items insert policy to be more secure
DROP POLICY IF EXISTS "Anyone can insert cart items" ON public.cart_items;

CREATE POLICY "Users can insert cart items" 
ON public.cart_items FOR INSERT 
WITH CHECK (auth.uid() = user_id OR session_id IS NOT NULL);