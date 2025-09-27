-- Create admin function to assign roles (only admins can use this)
CREATE OR REPLACE FUNCTION public.assign_user_role(_user_email text, _role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Only admins can assign roles
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can assign roles';
  END IF;
  
  -- Find user by email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = _user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found with email: %', _user_email;
  END IF;
  
  -- Insert or update role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Bootstrap: Create initial admin user (replace with your actual email)
-- This is a one-time setup to create the first admin
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Find user by email (replace 'your-email@example.com' with your actual email)
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'arlennyabreu11@gmail.com';
  
  -- If user exists, make them admin
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END
$$;