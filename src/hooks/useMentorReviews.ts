
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface ReviewItem {
    id: string;
    type: 'phase' | 'diary';
    title: string;
    subtitle: string;
    submittedAt: string;
    status: 'pending' | 'reviewed';
    data: any; // Original data object
}

export function useMentorReviews() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: reviews, isLoading } = useQuery({
        queryKey: ["mentor-reviews"],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            // 1. Fetch pending Phase Submissions
            // We need to join with project_groups to ensure it's assigned to this mentor
            const { data: phaseData, error: phaseError } = await supabase
                .from("group_phase_status")
                .select(`
          id,
          status,
          submission_date,
          group:project_groups!inner(id, group_id, project_title, mentor_id),
          phase:project_phases(id, phase_name)
        `)
                .eq("status", "submitted")
                .eq("project_groups.mentor_id", user.id); // Filter by mentor

            if (phaseError) {
                console.error("Error fetching phase reviews", phaseError);
            }

            // 2. Fetch pending Diary Entries
            const { data: diaryData, error: diaryError } = await supabase
                .from("project_diary")
                .select(`
          id,
          entry_date,
          work_done,
          is_reviewed,
          group:project_groups!inner(id, group_id, project_title, mentor_id),
          student:profiles(full_name)
        `)
                .eq("is_reviewed", false)
                .eq("project_groups.mentor_id", user.id);

            if (diaryError) {
                console.error("Error fetching diary reviews", diaryError);
            }

            const items: ReviewItem[] = [];

            // Transform Phase Data
            phaseData?.forEach((item: any) => {
                items.push({
                    id: item.id,
                    type: 'phase',
                    title: `Phase Submission: ${item.phase?.phase_name}`,
                    subtitle: `${item.group?.group_id} - ${item.group?.project_title}`,
                    submittedAt: item.submission_date,
                    status: 'pending',
                    data: item
                });
            });

            // Transform Diary Data
            diaryData?.forEach((item: any) => {
                items.push({
                    id: item.id,
                    type: 'diary',
                    title: `Diary Entry: ${item.student?.full_name || 'Student'}`,
                    subtitle: `${item.group?.group_id} - ${item.work_done.substring(0, 50)}...`,
                    submittedAt: item.entry_date,
                    status: 'pending',
                    data: item
                });
            });

            // Sort by date desc
            return items.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        },
    });

    const approvePhase = useMutation({
        mutationFn: async ({ id, remarks }: { id: string, remarks: string }) => {
            const { error } = await supabase
                .from("group_phase_status")
                .update({
                    status: 'approved',
                    mentor_remarks: remarks,
                    approved_at: new Date().toISOString()
                })
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mentor-reviews"] });
            toast({ title: "Phase Approved", description: "The phase has been marked as approved." });
        }
    });

    const reviewDiary = useMutation({
        mutationFn: async ({ id, comments }: { id: string, comments: string }) => {
            const { error } = await supabase
                .from("project_diary")
                .update({
                    is_reviewed: true,
                    mentor_comments: comments,
                    reviewed_at: new Date().toISOString()
                })
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mentor-reviews"] });
            toast({ title: "Diary Reviewed", description: "The entry has been marked as reviewed." });
        }
    });

    return {
        reviews,
        isLoading,
        approvePhase,
        reviewDiary
    };
}
