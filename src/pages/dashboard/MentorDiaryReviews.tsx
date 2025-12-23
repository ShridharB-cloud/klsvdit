
import { useMentorReviews } from "@/hooks/useMentorReviews";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    BookOpen,
} from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function MentorDiaryReviews() {
    const { reviews, isLoading, reviewDiary } = useMentorReviews();
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [remarks, setRemarks] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Filter only diary reviews
    const diaryReviews = reviews?.filter(r => r.type === 'diary');

    const handleAction = (item: any) => {
        setSelectedItem(item);
        setRemarks("");
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {
        if (!selectedItem) return;
        reviewDiary.mutate({ id: selectedItem.id, comments: remarks });
        setIsDialogOpen(false);
    };

    return (
        <DashboardLayout role="mentor">
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Diary Reviews</h2>
                    <p className="text-muted-foreground">
                        Check weekly progress logs and provide feedback.
                    </p>
                </div>

                {isLoading ? (
                    <div>Loading reviews...</div>
                ) : (
                    <div className="grid gap-6">
                        {diaryReviews?.length === 0 && (
                            <div className="text-center py-10 text-muted-foreground">
                                No pending diary reviews found.
                            </div>
                        )}

                        {diaryReviews?.map((item) => (
                            <Card key={`${item.type}-${item.id}`} className="flex flex-col sm:flex-row shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-6 flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                                                    <BookOpen className="w-3 h-3 mr-1" /> Diary
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(item.submittedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-lg">{item.title}</h3>
                                            <p className="text-muted-foreground">{item.subtitle}</p>
                                            {/* Display full work done if needed, or keep truncated in subtitle */}
                                            <div className="mt-2 text-sm bg-muted/50 p-2 rounded">
                                                <p className="font-medium text-xs text-muted-foreground mb-1">Work Done:</p>
                                                {item.data.work_done}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t sm:border-t-0 sm:border-l flex items-center justify-center bg-secondary/5">
                                    <Button onClick={() => handleAction(item)}>
                                        Review Entry
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Review Diary Entry</DialogTitle>
                            <DialogDescription>
                                Provide feedback for the student's weekly log.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Textarea
                                placeholder="Enter comments for the student..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit}>
                                Submit Review
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardLayout>
    );
}
