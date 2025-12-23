
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Announcement {
    id: string;
    title: string;
    message: string;
    created_at: string;
    // Since we don't have a created_by column in notifications, we can't easily fetch "sent" messages 
    // unless we add a new table. For now, we focus on SENDING.
}

export function useMentorAnnouncements() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch groups for selection in the form
    const { data: groups } = useQuery({
        queryKey: ["mentor-groups-simple"],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data } = await supabase
                .from("project_groups")
                .select("id, group_id, project_title")
                .eq("mentor_id", user.id);

            return data || [];
        }
    });

    const sendAnnouncement = useMutation({
        mutationFn: async ({ groupIds, title, message }: { groupIds: string[], title: string, message: string }) => {
            // 1. Fetch all student IDs for the selected groups
            const { data: members, error: memberError } = await supabase
                .from("group_members")
                .select("student_id")
                .in("group_id", groupIds);

            if (memberError) throw memberError;
            if (!members || members.length === 0) return; // No students to notify

            // 2. Prepare notification objects for batch insert
            const notifications = members.map(member => ({
                user_id: member.student_id,
                title: title,
                message: message,
                type: 'info', // Default type
                is_read: false
            }));

            // 3. Insert into notifications table
            const { error: insertError } = await supabase
                .from("notifications")
                .insert(notifications);

            if (insertError) throw insertError;
        },
        onSuccess: () => {
            toast({ title: "Announcement Sent", description: "The announcement has been sent to all students in the selected groups." });
        },
        onError: (error) => {
            toast({ title: "Error", description: "Failed to send announcement: " + error.message, variant: "destructive" });
        }
    });

    return {
        groups,
        sendAnnouncement
    };
}
