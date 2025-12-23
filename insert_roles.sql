
-- Grant Admin and Mentor roles to Shridhar
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'shridhar@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'mentor'::app_role
FROM auth.users
WHERE email = 'shridhar@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
