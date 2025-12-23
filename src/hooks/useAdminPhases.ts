
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface ProjectPhaseConfig {
    id: string;
    phase_number: number;
    phase_name: string;
    description: string;
    start_date: string | null;
    end_date: string | null;
    is_locked: boolean;
}

export function useAdminPhases() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: phases, isLoading } = useQuery({
        queryKey: ["admin-phases"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("project_phases")
                .select("*")
                .order("phase_number");

            if (error) throw error;
            return data as ProjectPhaseConfig[];
        }
    });

    const updatePhase = useMutation({
        mutationFn: async (updates: Partial<ProjectPhaseConfig> & { id: string }) => {
            const { id, ...rest } = updates;
            const { error } = await supabase
                .from("project_phases")
                .update(rest)
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-phases"] });
            // Also invalidate public phases potentiallly
            queryClient.invalidateQueries({ queryKey: ["project-phases"] });
            toast({ title: "Phase Updated", description: "Configuration saved successfully." });
        },
        onError: (error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    });

    return { phases, isLoading, updatePhase };
}
