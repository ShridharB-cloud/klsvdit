
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProjectGroup {
    id: string;
    group_id: string;
    project_title: string;
    project_description: string | null;
    status: 'active' | 'completed' | 'delayed' | 'inactive';
    current_phase: number; // calculated field or from joined definition
    members_count: number; // calculated field
    updated_at: string;
}

export function useMentorGroups() {
    const { data: groups, isLoading } = useQuery({
        queryKey: ["mentor-groups"],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            // For prototype/dev bypass: if (user.email.includes("shridhar")), return mock data if no real data found?
            // Or pure mock if valid user but no assigned groups

            const { data, error } = await supabase
                .from("project_groups")
                .select(`
          id,
          group_id,
          project_title,
          project_description,
          status,
          updated_at,
          group_members (count)
        `)
                .eq("mentor_id", user.id);

            if (error) throw error;

            // Transform data to match interface
            const transformedGroups: ProjectGroup[] = data.map((g: any) => ({
                id: g.id,
                group_id: g.group_id,
                project_title: g.project_title,
                project_description: g.project_description,
                status: g.status as 'active' | 'completed' | 'delayed' | 'inactive',
                current_phase: 1, // Defaulting to 1 for now as phase tracking is complex 
                members_count: g.group_members[0]?.count || 0,
                updated_at: g.updated_at
            }));

            return transformedGroups;
        },
    });

    return { groups, isLoading };
}
