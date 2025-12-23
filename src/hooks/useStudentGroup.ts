
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface GroupDetails {
    id: string;
    project_title: string;
    department: string;
    mentor_name: string;
    members: string[];
    batch_year: string;
}

export function useStudentGroup() {
    return useQuery({
        queryKey: ["student-group"],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // 1. Get the group ID for the current student
            const { data: memberData, error: memberError } = await supabase
                .from("group_members")
                .select("group_id")
                .eq("student_id", user.id)
                .maybeSingle();

            if (memberError) throw memberError;
            if (!memberData) return null; // Student has no group

            const groupId = memberData.group_id;

            // 2. Fetch group details
            const { data: groupData, error: groupError } = await supabase
                .from("project_groups")
                .select("*")
                .eq("id", groupId)
                .single();

            if (groupError) throw groupError;

            // 3. Fetch mentor details
            let mentorName = "Not Assigned";
            if (groupData.mentor_id) {
                const { data: mentorProfile } = await supabase
                    .from("profiles")
                    .select("full_name")
                    .eq("user_id", groupData.mentor_id)
                    .single();

                if (mentorProfile) mentorName = mentorProfile.full_name;
            }

            // 4. Fetch all group members
            const { data: membersData } = await supabase
                .from("group_members")
                .select(`
          profiles:student_id (
            full_name
          )
        `)
                .eq("group_id", groupId);

            const members = membersData?.map((m: any) => m.profiles?.full_name || "Unknown") || [];

            return {
                id: groupData.id,
                project_title: groupData.project_title || "Untitled Project",
                department: groupData.department || "Unknown Department",
                mentor_name: mentorName,
                members: members,
                batch_year: groupData.batch_year,
            } as GroupDetails;
        },
    });
}
