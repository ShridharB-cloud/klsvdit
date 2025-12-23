
-- Insert a test project group assigned to Shridhar
VALUES (uuid_generate_v4(), 'GRP-TEST-001', 'Real Database Project: AI Automation', 'A project to verify real data fetching', (SELECT id FROM auth.users WHERE email LIKE 'shridhar%'), 'active');

INSERT INTO public.project_groups (group_id, project_title, project_description, mentor_id, status)
SELECT 'GRP-REAL-001', 'Real Data: AI Traffic Control', 'This project comes from the Supabase DB', id, 'active'
FROM auth.users
WHERE email LIKE 'shridhar%'
LIMIT 1;
