
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface AcademicYear {
    id: string;
    year_name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
}

export interface Department {
    id: string;
    name: string;
    code: string;
}

export function useAdminSetup() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: academicYears, isLoading: isLoadingYears } = useQuery({
        queryKey: ["admin-academic-years"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("academic_years")
                .select("*")
                .order("year_name", { ascending: false });

            if (error) throw error;
            return data as AcademicYear[];
        }
    });

    const { data: departments, isLoading: isLoadingDepts } = useQuery({
        queryKey: ["admin-departments"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("departments")
                .select("*")
                .order("name");

            if (error) throw error;
            return data as Department[];
        }
    });

    const createYear = useMutation({
        mutationFn: async (year: Omit<AcademicYear, 'id' | 'created_at'>) => {
            // If setting active, deactivate others (optional logic, but good UX)
            if (year.is_active) {
                await supabase.from("academic_years").update({ is_active: false }).neq("id", "00000000-0000-0000-0000-000000000000");
            }

            const { error } = await supabase.from("academic_years").insert(year);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-academic-years"] });
            toast({ title: "Academic Year Created", description: "New academic session added." });
        },
        onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" })
    });

    const toggleYearActive = useMutation({
        mutationFn: async ({ id, isActive }: { id: string, isActive: boolean }) => {
            if (isActive) {
                // Deactivate all others first
                await supabase.from("academic_years").update({ is_active: false }).neq("id", id);
            }
            const { error } = await supabase.from("academic_years").update({ is_active: isActive }).eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-academic-years"] });
            toast({ title: "Status Updated", description: "Academic year status changed." });
        },
        onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" })
    });

    const createDepartment = useMutation({
        mutationFn: async (dept: { name: string, code: string }) => {
            const { error } = await supabase.from("departments").insert(dept);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-departments"] });
            toast({ title: "Department Added", description: "New department registered." });
        },
        onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" })
    });

    return {
        academicYears,
        departments,
        isLoading: isLoadingYears || isLoadingDepts,
        createYear,
        toggleYearActive,
        createDepartment
    };
}
