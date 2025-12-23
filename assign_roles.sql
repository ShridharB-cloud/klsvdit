
-- Insert Mentor Role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'mentor'
FROM auth.users
WHERE email LIKE '%shridhar%'
ON CONFLICT (user_id, role) DO NOTHING;

-- Insert Admin Role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email LIKE '%shridhar%'
ON CONFLICT (user_id, role) DO NOTHING;
