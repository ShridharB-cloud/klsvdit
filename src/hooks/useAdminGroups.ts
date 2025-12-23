
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface ProjectGroup {
    id: string; // internal UUID
    group_id: string; // Display ID (GRP-2024...)
    project_title: string;
    project_description?: string;
    status: 'active' | 'completed' | 'delayed' | 'inactive';
    mentor_id?: string;
    mentor_name?: string; // Derived
    member_count: number;
}

export function useAdminGroups() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch all groups
    const { data: groups, isLoading } = useQuery({
        queryKey: ["admin-groups"],
        queryFn: async () => {
            // Fetch groups
            const { data: groupData, error } = await supabase
                .from("project_groups")
                .select(`
            id, 
            group_id, 
            project_title, 
            project_description, 
            status, 
            mentor_id
        `)
                .order("group_id");

            if (error) throw error;
            if (!groupData) return [];

            // Fetch member counts and mentor names strictly without complex joins if risky
            // For MVP Admin, let's just fetch profiles manually to map mentors
            const mentorIds = Array.from(new Set(groupData.map(g => g.mentor_id).filter(Boolean))) as string[];

            let mentorMap = new Map<string, string>();
            if (mentorIds.length > 0) {
                const { data: mentors } = await supabase
                    .from("profiles")
                    .select("user_id, full_name")
                    .in("user_id", mentorIds);

                mentors?.forEach(m => mentorMap.set(m.user_id, m.full_name));
            }

            // Fetch all members to count
            // Aggregate by count is better but for < 100 groups, fetching all members is OK-ish MVP.
            // Better: use .select('count') in a loop or grouped query? 
            // Supabase doesn't do "GROUP BY" easily in client select.
            // Let's fetch all group_members and aggregate in JS.
            const { data: allMembers } = await supabase.from("group_members").select("group_id");

            const memberCounts = new Map<string, number>();
            allMembers?.forEach(m => {
                memberCounts.set(m.group_id, (memberCounts.get(m.group_id) || 0) + 1);
            });

            return groupData.map(g => ({
                ...g,
                mentor_name: g.mentor_id ? mentorMap.get(g.mentor_id) || "Unknown" : "Unassigned",
                member_count: memberCounts.get(g.id) || 0,
                status: g.status as ProjectGroup['status'] // Cast
            }));
        }
    });

    const createGroup = useMutation({
        mutationFn: async (newGroup: { group_id: string, project_title: string, department_id?: string }) => {
            const { error } = await supabase
                .from("project_groups")
                .insert(newGroup);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-groups"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
            toast({ title: "Group Created", description: "New project group has been added." });
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    });

    const updateMentor = useMutation({
        mutationFn: async ({ groupId, mentorId }: { groupId: string, mentorId: string | null }) => {
            const { error } = await supabase
                .from("project_groups")
                .update({ mentor_id: mentorId })
                .eq("id", groupId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-groups"] });
            toast({ title: "Mentor Assigned", description: "Group mentor has been updated." });
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    });

    return { groups, isLoading, createGroup, updateMentor };
}
