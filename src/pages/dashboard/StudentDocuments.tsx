
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useDocuments, Document } from "@/hooks/useDocuments";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FileText, Upload, Download, Trash2, ArrowLeft, File } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

// Mock data for prototype
const mockDocuments: Document[] = [
    { id: "1", group_id: "G-1", document_type: "synopsis", title: "Project Synopsis v1.0", file_name: "synopsis_final.pdf", file_url: "#", uploaded_by: "shridhar", created_at: "2024-01-10" },
    { id: "2", group_id: "G-1", document_type: "design", title: "System Architecture Design", file_name: "architecture_diagram.png", file_url: "#", uploaded_by: "shridhar", created_at: "2024-01-20" },
];

export default function StudentDocuments() {
    const navigate = useNavigate();
    const { documents: realDocuments, isLoading, uploadDocument } = useDocuments();
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const { register, handleSubmit, reset, setValue } = useForm();

    // Use real data if available, else mock
    const documents = (realDocuments && realDocuments.length > 0) ? realDocuments : mockDocuments;

    const onSubmit = (data: any) => {
        // In a real scenario, we'd handle the file object here
        // For now, we just pass the metadata to the hook
        uploadDocument.mutate({
            ...data,
            file: { name: "mock-file.pdf" } as File // Mocking file object for the hook
        }, {
            onSuccess: () => {
                setIsUploadOpen(false);
                reset();
            }
        });
    };

    return (
        <DashboardLayout role="student">
            <div className="space-y-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={() => navigate("/dashboard/student")}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
                        </div>
                        <p className="text-muted-foreground">
                            Manage and submit your project reports and documentation.
                        </p>
                    </div>

                    <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Document
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Upload Document</DialogTitle>
                                <DialogDescription>
                                    Select the document type and upload your file.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Document Title</Label>
                                    <Input id="title" placeholder="e.g. Phase 1 Report" {...register("title", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Document Type</Label>
                                    <Select onValueChange={(val) => setValue("document_type", val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="synopsis">Synopsis</SelectItem>
                                            <SelectItem value="srs">SRS</SelectItem>
                                            <SelectItem value="design">Design Document</SelectItem>
                                            <SelectItem value="report">Final Report</SelectItem>
                                            <SelectItem value="ppt">Presentation</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="file">File</Label>
                                    <Input id="file" type="file" className="cursor-pointer" />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={uploadDocument.isPending}>
                                        {uploadDocument.isPending ? "Uploading..." : "Upload"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Separator />

                {/* Documents Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                        [1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full" />)
                    ) : documents.length > 0 ? (
                        documents.map((doc) => (
                            <Card key={doc.id} className="group relative overflow-hidden hover:border-primary/50 transition-all">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <Badge variant="outline" className="uppercase text-[10px] tracking-wider">
                                            {doc.document_type}
                                        </Badge>
                                    </div>
                                    <CardTitle className="mt-4 text-base line-clamp-1" title={doc.title}>
                                        {doc.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-1 text-xs">
                                        {doc.file_name}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                                        <span>{doc.created_at?.split('T')[0]}</span>
                                        <Button variant="ghost" size="sm" className="h-8 px-2 ml-auto" asChild>
                                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 border rounded-lg border-dashed bg-muted/5">
                            <File className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">No documents uploaded yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
