
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAdminStats() {
    return useQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => {
            // 1. Fetch counts
            const { count: totalGroups } = await supabase
                .from("project_groups")
                .select("*", { count: "exact", head: true });

            const { count: totalStudents } = await supabase
                .from("user_roles")
                .select("*", { count: "exact", head: true })
                .eq("role", "student");

            const { count: totalMentors } = await supabase
                .from("user_roles")
                .select("*", { count: "exact", head: true })
                .eq("role", "mentor");

            const { count: totalDepartments } = await supabase
                .from("departments")
                .select("*", { count: "exact", head: true });

            // 2. Fetch delayed groups (assuming status='delayed' is set in DB, or we can logic this later)
            // For now, let's just fetch groups marked as delayed.
            const { data: delayedGroupsData } = await supabase
                .from("project_groups")
                .select(`
            id, 
            group_id, 
            project_title, 
            status,
            mentor_id,
            profiles:mentor_id (full_name)
        `)
                .eq("status", "delayed")
                .limit(5);

            // Clean up delayed groups data
            const delayedGroups = delayedGroupsData?.map(g => ({
                id: g.group_id, // Display ID
                project: g.project_title,
                mentor: g.profiles ? (g.profiles as any).full_name : "Unassigned",
                daysDelayed: 0 // We don't have a calculation for this yet without phase data
            })) || [];

            // 3. Department stats (Mock logic spread over real counts if possible, or calculate)
            // Getting real dept breakdown requires a join.
            const { data: deptGroups } = await supabase
                .from("project_groups")
                .select("department_id, status");

            // Calculate simple stats from deptGroups
            // checking department names might be expensive effectively in one go without a view, 
            // so we might stick to a simpler version or just fetch departments and count.

            // Let's just return what we have for now.

            return {
                totalGroups: totalGroups || 0,
                totalStudents: totalStudents || 0,
                totalMentors: totalMentors || 0,
                totalDepartments: totalDepartments || 0,
                delayedGroups,
                // Keep some mock data structure for charts until we implement full aggregation
                departmentStats: [],
                recentActivity: []
            };
        },
    });
}
