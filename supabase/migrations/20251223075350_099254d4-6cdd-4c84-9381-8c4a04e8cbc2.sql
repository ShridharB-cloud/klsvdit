-- Create storage bucket for project documents
INSERT INTO storage.buckets (id, name, public) VALUES ('project-documents', 'project-documents', false);

-- Storage policies for project documents
CREATE POLICY "Users can view their group documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'project-documents' 
  AND (storage.foldername(name))[1]::uuid IN (SELECT public.get_user_group_ids(auth.uid()))
);

CREATE POLICY "Students can upload documents to their group"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'project-documents'
  AND (storage.foldername(name))[1]::uuid IN (
    SELECT group_id FROM public.group_members WHERE student_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all documents"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'project-documents'
  AND public.has_role(auth.uid(), 'admin')
);