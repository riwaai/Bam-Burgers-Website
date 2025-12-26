-- Create a function to add admin role when user with specific email signs up
CREATE OR REPLACE FUNCTION public.auto_grant_admin_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    -- Automatically grant admin role to specific email
    IF NEW.email = 'bamburgers@riwaai.com' THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger to auto-grant admin on signup
CREATE TRIGGER on_auth_user_grant_admin
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.auto_grant_admin_role();