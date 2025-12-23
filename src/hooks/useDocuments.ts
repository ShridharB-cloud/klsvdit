
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStudentGroup } from "./useStudentGroup";
import { useToast } from "@/hooks/use-toast";

export interface Document {
    id: string;
    group_id: string;
    document_type: 'synopsis' | 'srs' | 'design' | 'ppt' | 'report' | 'certificate' | 'other';
    title: string;
    file_url: string;
    file_name: string;
    uploaded_by: string;
    created_at: string;
}

export interface NewDocument {
    document_type: string;
    title: string;
    file: File;
}

export function useDocuments() {
    const { data: groupData } = useStudentGroup();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const groupId = groupData?.id;

    const { data: documents, isLoading } = useQuery({
        queryKey: ["documents", groupId],
        queryFn: async () => {
            // If it's the mock group, return empty list or mock list? 
            // Let's return empty/mock list so we don't error on DB
            if (!groupId || groupId.startsWith("G-2024")) {
                return [];
            }

            const { data, error } = await supabase
                .from("documents")
                .select("*")
                .eq("group_id", groupId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as Document[];
        },
        enabled: !!groupId,
    });

    const uploadDocument = useMutation({
        mutationFn: async (newDoc: NewDocument) => {
            if (!groupId || groupId.startsWith("G-2024")) {
                // Mock upload for prototype
                return new Promise((resolve) => setTimeout(resolve, 1000));
            }

            // 1. Upload file to Storage (Mocking this step for now as buckets might not exist)
            // In a real app: const { data, error } = await supabase.storage.from('documents').upload(...)

            // 2. Insert record to DB
            const { data, error } = await supabase
                .from("documents")
                .insert([
                    {
                        group_id: groupId,
                        document_type: newDoc.document_type,
                        title: newDoc.title,
                        file_name: newDoc.file.name,
                        file_url: "https://example.com/mock-file.pdf", // Placeholder
                        // uploaded_by: user_id // Supabase handles this via RLS/Auth context usually, or we pass it
                    }
                ]);

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            toast({
                title: "Document Uploaded",
                description: "Your document has been successfully added.",
            });
        },
        onError: (error) => {
            console.error("Upload error:", error);
            toast({
                title: "Upload Failed",
                description: "There was an error uploading your document.",
                variant: "destructive",
            });
        },
    });

    return {
        documents,
        isLoading,
        uploadDocument,
    };
}
