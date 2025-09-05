-- Fix infinite recursion in profiles RLS policy by using security definer function

-- Drop the problematic policy
DROP POLICY IF EXISTS "Only admins can modify profiles" ON public.profiles;

-- Create policy that allows users to update their own profiles
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy that allows users to insert their own profiles  
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Keep admin access via the existing security definer function
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (get_current_user_role() = 'admin');

-- Allow users to delete their own profiles
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = user_id);