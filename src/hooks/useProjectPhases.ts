
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStudentGroup } from "./useStudentGroup";

export interface PhaseData {
    id: any; // Using any for UI compatibility with existing mock (number vs uuid)
    phase_id: string; // real UUID
    name: string;
    completion: string;
    status: "completed" | "current" | "locked";
    variant: "phase1" | "phase2" | "phase3" | "phase4" | "external";
    original_status?: string; // from DB
}

export function useProjectPhases() {
    const { data: groupData } = useStudentGroup();
    const groupId = groupData?.id; // Note: This might be the mock ID "G-..." if unassigned. 
    // Wait, useStudentGroup returns the "group_id" string (e.g. G-2024...) as 'id', 
    // BUT for DB queries we need the UUID 'id' from project_groups table? 
    // No, useStudentGroup hook fetches the UUID as 'id' ? 
    // Let's check useStudentGroup.ts

    // useStudentGroup returns:
    // id: groupData.id (which is UUID) ? 
    // or groupData.group_id (which is text "G-...")?

    // Checking useStudentGroup.ts:
    // id: groupData.id (UUID primary key)

    return useQuery({
        queryKey: ["project-phases", groupId],
        queryFn: async () => {
            // 1. Fetch all phases definitions
            const { data: phasesDef, error: phasesError } = await supabase
                .from("project_phases")
                .select("*")
                .order("phase_number");

            if (phasesError) throw phasesError;

            // 2. Fetch group status if group exists
            let groupStatuses: any[] = [];
            if (groupId) {
                // IF groupId is a valid UUID. 
                // If it is the MOCK ID "G-2024-CSE-012", this query will fail with invalid input syntax for type uuid.
                // We need to be careful about the "Prototype Mode".
                // If useStudentGroup returns the Mock Data fallback, we shouldn't query DB with it.

                // Actually, useStudentGroup hook returns REAL data or null.
                // The StudentDashboard component does the fallback.
                // So if we are here, and useStudentGroup returned data, it is REAL UUID.

                // Wait, I need to check if useStudentGroup returns the hook result or the fallback?
                // The HOOK returns the real data.

                const { data: statusData, error: statusError } = await supabase
                    .from("group_phase_status")
                    .select("*")
                    .eq("group_id", groupId);

                if (statusError && statusError.code !== "PGRST116") { // Ignore if not found?
                    console.error(statusError);
                }
                groupStatuses = statusData || [];
            }

            // 3. Merge and formatting
            return phasesDef.map((phase) => {
                const groupStatus = groupStatuses.find(gs => gs.phase_id === phase.id);

                let uiStatus: "completed" | "current" | "locked" = "locked"; // Default

                // Logic to determine status
                if (groupStatus) {
                    if (groupStatus.status === 'approved') uiStatus = "completed";
                    else if (groupStatus.status === 'in_progress' || groupStatus.status === 'submitted') uiStatus = "current";
                    else if (groupStatus.status === 'pending') uiStatus = "current"; // Or locked?
                } else {
                    // If no status row, default to locked unless it's Phase 1?
                    if (phase.phase_number === 1) uiStatus = "current";
                }

                // Map variant
                const variants = ["phase1", "phase2", "phase3", "phase4", "external"];
                const variant = variants[phase.phase_number - 1] || "phase1";

                return {
                    id: phase.phase_number, // UI expects number ID 1-5
                    phase_id: phase.id,
                    name: phase.phase_name,
                    completion: `${phase.completion_percentage}%`,
                    status: uiStatus,
                    variant: variant as any,
                    original_status: groupStatus?.status
                };
            });
        },
        enabled: true, // Always fetch phases defs at least
    });
}
