
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type AppRole = 'student' | 'mentor' | 'admin';

export interface UserProfile {
    id: string; // The UUID from auth/profiles
    email?: string; // We might not have email in profiles if not synced, but let's assume we can't get it easily without admin API. 
    // Actually, profiles usually stores email if we added it? 
    // Schema Check: profiles table has (id, full_name, etc), NOT email. 
    // Email is in auth.users. Regular users can't see it (usually).
    // But as Admin, maybe I want to see emails?
    // If I have a specific "secure view" for admins I could.
    // For now, use full_name.
    full_name: string;
    avatar_url?: string;
    department?: string;
    roles: AppRole[];
    created_at: string;
}

export function useAdminUsers() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: users, isLoading } = useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => {
            // 1. Fetch all profiles
            const { data: profiles, error: profilesError } = await supabase
                .from("profiles")
                .select("*");

            if (profilesError) throw profilesError;

            // 2. Fetch all user roles
            const { data: roles, error: rolesError } = await supabase
                .from("user_roles")
                .select("*");

            if (rolesError) throw rolesError;

            // 3. Merge data
            // Create a map of user_id -> roles[]
            const roleMap = new Map<string, AppRole[]>();
            roles?.forEach(r => {
                const current = roleMap.get(r.user_id) || [];
                current.push(r.role as AppRole);
                roleMap.set(r.user_id, current);
            });

            // Map profiles to UserProfile objects
            const combined: UserProfile[] = profiles.map(p => ({
                id: p.user_id, // profile user_id matches auth.uid
                full_name: p.full_name || "Unknown User",
                avatar_url: p.avatar_url,
                roles: roleMap.get(p.user_id) || ['student'], // Default to student if no role? Or empty?
                created_at: p.updated_at // Approximate
            }));

            return combined;
        }
    });

    const updateUserRole = useMutation({
        mutationFn: async ({ userId, role, action }: { userId: string, role: AppRole, action: 'add' | 'remove' }) => {
            if (action === 'add') {
                const { error } = await supabase
                    .from("user_roles")
                    .insert({ user_id: userId, role });
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("user_roles")
                    .delete()
                    .eq("user_id", userId)
                    .eq("role", role);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            // Also invalidate stats as counts change
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
            toast({ title: "Success", description: "User roles updated successfully." });
        },
        onError: (error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    });

    return { users, isLoading, updateUserRole };
}
