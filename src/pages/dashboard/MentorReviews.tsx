
import { useMentorReviews } from "@/hooks/useMentorReviews";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    ClipboardCheck,
    BookOpen,
    CheckCircle2,
    XCircle,
    MessageSquare
} from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function MentorReviews() {
    const { reviews, isLoading, approvePhase, reviewDiary } = useMentorReviews();
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [remarks, setRemarks] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAction = (item: any) => {
        setSelectedItem(item);
        setRemarks("");
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {
        if (!selectedItem) return;

        if (selectedItem.type === 'phase') {
            approvePhase.mutate({ id: selectedItem.id, remarks });
        } else {
            reviewDiary.mutate({ id: selectedItem.id, comments: remarks });
        }
        setIsDialogOpen(false);
    };

    return (
        <DashboardLayout role="mentor">
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Pending Reviews</h2>
                    <p className="text-muted-foreground">
                        Review phase submissions and diary entries from your groups.
                    </p>
                </div>

                {isLoading ? (
                    <div>Loading reviews...</div>
                ) : (
                    <div className="grid gap-6">
                        {reviews?.length === 0 && (
                            <div className="text-center py-10 text-muted-foreground">
                                No pending reviews found. Good job!
                            </div>
                        )}

                        {reviews?.map((item) => (
                            <Card key={`${item.type}-${item.id}`} className="flex flex-col sm:flex-row shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-6 flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                {item.type === 'phase' ? (
                                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                                        <ClipboardCheck className="w-3 h-3 mr-1" /> Phase
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                                                        <BookOpen className="w-3 h-3 mr-1" /> Diary
                                                    </Badge>
                                                )}
                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(item.submittedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-lg">{item.title}</h3>
                                            <p className="text-muted-foreground">{item.subtitle}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t sm:border-t-0 sm:border-l flex items-center justify-center bg-secondary/5">
                                    <Button onClick={() => handleAction(item)}>
                                        Review
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {selectedItem?.type === 'phase' ? 'Approve Phase' : 'Review Diary Entry'}
                            </DialogTitle>
                            <DialogDescription>
                                Provide feedback or remarks for the student group.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Textarea
                                placeholder={selectedItem?.type === 'phase' ? "Enter remarks for approval..." : "Enter comments for the student..."}
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit}>
                                {selectedItem?.type === 'phase' ? 'Approve' : 'Submit Review'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardLayout>
    );
}
