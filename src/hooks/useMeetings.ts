
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStudentGroup } from "./useStudentGroup";
import { useToast } from "@/hooks/use-toast";
import { addDays, format, parseISO } from "date-fns";

export interface Meeting {
    id: string;
    group_id: string;
    title: string;
    description: string | null;
    meeting_type: 'mentor' | 'review' | 'external' | 'general';
    scheduled_at: string;
    location: string | null;
    created_at: string;
}

export interface NewMeeting {
    title: string;
    description?: string;
    meeting_type: string;
    scheduled_at: Date;
    location?: string;
}

// Mock data for prototype
const mockMeetings: Meeting[] = [
    {
        id: "1",
        group_id: "G-1",
        title: "Project Review 1",
        description: "Phase 1 progress review",
        meeting_type: "review",
        scheduled_at: format(addDays(new Date(), 2), "yyyy-MM-dd'T'10:00:00"),
        location: "Lab 204",
        created_at: new Date().toISOString()
    },
    {
        id: "2",
        group_id: "G-1",
        title: "Weekly Mentor Sync",
        description: "Discussing obstacles in modules",
        meeting_type: "mentor",
        scheduled_at: format(addDays(new Date(), 5), "yyyy-MM-dd'T'14:00:00"),
        location: "Staff Room",
        created_at: new Date().toISOString()
    }
];

export function useMeetings() {
    const { data: groupData } = useStudentGroup();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const groupId = groupData?.id;

    const { data: meetings, isLoading } = useQuery({
        queryKey: ["meetings", groupId],
        queryFn: async () => {
            if (!groupId || groupId.startsWith("G-2024")) {
                return mockMeetings;
            }

            const { data, error } = await supabase
                .from("meetings")
                .select("*")
                .eq("group_id", groupId)
                .gte("scheduled_at", new Date().toISOString()) // Only future meetings? Or all? Let's get all and sort.
                .order("scheduled_at", { ascending: true });

            if (error) throw error;
            return data as Meeting[];
        },
        enabled: !!groupId || !groupData, // Enable even if no groupData to return mocks? No, logic above handles it.
    });

    const requestMeeting = useMutation({
        mutationFn: async (newMeeting: NewMeeting) => {
            if (!groupId || groupId.startsWith("G-2024")) {
                // Mock request
                return new Promise((resolve) => setTimeout(resolve, 1000));
            }

            const { data, error } = await supabase
                .from("meetings")
                .insert([
                    {
                        group_id: groupId,
                        title: newMeeting.title,
                        description: newMeeting.description,
                        meeting_type: newMeeting.meeting_type,
                        scheduled_at: newMeeting.scheduled_at.toISOString(),
                        location: newMeeting.location
                    }
                ]);

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meetings"] });
            toast({
                title: "Meeting Requested",
                description: "Your meeting request has been sent to the mentor.",
            });
        },
        onError: (error) => {
            console.error("Meeting request error:", error);
            toast({
                title: "Request Failed",
                description: "Could not schedule meeting.",
                variant: "destructive",
            });
        },
    });

    return {
        meetings,
        isLoading,
        requestMeeting,
    };
}
