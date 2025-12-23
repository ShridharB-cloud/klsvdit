
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useStudentGroup } from "./useStudentGroup"; // To get group_id

export interface DiaryEntry {
    id: string;
    group_id: string;
    entry_date: string;
    work_done: string;
    issues_faced?: string;
    next_plan?: string;
    submitted_by?: string;
    is_reviewed: boolean;
    mentor_comments?: string;
    created_at: string;
}

export interface NewDiaryEntry {
    work_done: string;
    issues_faced?: string;
    next_plan?: string;
}

export function useProjectDiary() {
    const { data: groupData } = useStudentGroup();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const groupId = groupData?.id;

    // FETCH ENTRIES
    const { data: diaryEntries, isLoading } = useQuery({
        queryKey: ["project-diary", groupId],
        queryFn: async () => {
            if (!groupId) return [];

            const { data, error } = await supabase
                .from("project_diary")
                .select("*")
                .eq("group_id", groupId)
                .order("entry_date", { ascending: false });

            if (error) throw error;
            return data as DiaryEntry[];
        },
        enabled: !!groupId, // Only fetch if group ID is available
    });

    // ADD ENTRY MUTATION
    const addEntry = useMutation({
        mutationFn: async (newEntry: NewDiaryEntry) => {
            if (!groupId) throw new Error("No group assigned");

            const { data: { user } } = await supabase.auth.getUser();

            const { data, error } = await supabase
                .from("project_diary")
                .insert({
                    group_id: groupId,
                    work_done: newEntry.work_done,
                    issues_faced: newEntry.issues_faced,
                    next_plan: newEntry.next_plan,
                    submitted_by: user?.id,
                    entry_date: new Date().toISOString().split('T')[0] // Today YYYY-MM-DD
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project-diary"] });
            toast({
                title: "Diary Entry Added",
                description: "Your work log has been submitted successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Submission Failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    return {
        diaryEntries,
        isLoading,
        addEntry,
    };
}
