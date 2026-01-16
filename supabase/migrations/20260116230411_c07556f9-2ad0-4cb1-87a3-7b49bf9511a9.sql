-- Add policy to allow checking roles using has_role function
-- This ensures non-admins can at least check their own role status
CREATE POLICY "Allow checking own role"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));