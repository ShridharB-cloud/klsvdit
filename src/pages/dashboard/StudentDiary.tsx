
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useProjectDiary } from "@/hooks/useProjectDiary";
import { AddDiaryEntryDialog } from "@/components/dashboard/AddDiaryEntryDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Search, Filter, CalendarDays, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Mock data fallback matching StudentDashboard
const mockDiaryEntries = [
    { entry_date: "2024-01-15", work_done: "Completed database schema design", is_reviewed: true },
    { entry_date: "2024-01-08", work_done: "Finalized project architecture", is_reviewed: true },
    { entry_date: "2024-01-01", work_done: "Initial project setup and research", is_reviewed: true },
];

export default function StudentDiary() {
    const navigate = useNavigate();
    const { diaryEntries: realDiaryEntries, isLoading } = useProjectDiary();
    const [searchQuery, setSearchQuery] = useState("");

    // Fallback logic
    const diaryEntries = (realDiaryEntries && realDiaryEntries.length > 0) ? realDiaryEntries : mockDiaryEntries;

    // Client-side filtering
    const filteredEntries = diaryEntries.filter(entry =>
        entry.work_done.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            <h2 className="text-3xl font-bold tracking-tight">Project Diary</h2>
                        </div>
                        <p className="text-muted-foreground">
                            Log your daily progress and track mentor reviews.
                        </p>
                    </div>
                    <AddDiaryEntryDialog />
                </div>

                <Separator />

                {/* Filters and Search */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search entries..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>

                {/* Entries List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
                        </div>
                    ) : filteredEntries.length > 0 ? (
                        filteredEntries.map((entry, index) => (
                            <Card key={index} className="transition-all hover:border-primary/50">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                                            <CalendarDays className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-semibold text-lg">{entry.entry_date}</h3>
                                                    <Badge variant={entry.is_reviewed ? "success" : "secondary"}>
                                                        {entry.is_reviewed ? "Reviewed" : "Pending Review"}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <p className="text-muted-foreground whitespace-pre-wrap">
                                                {entry.work_done}
                                            </p>

                                            {entry.is_reviewed && (
                                                <div className="mt-4 p-3 bg-secondary/50 rounded-md text-sm border-l-4 border-success">
                                                    <span className="font-semibold text-success-foreground">Mentor Feedback: </span>
                                                    Good progress. Ensure the ER diagram includes all relationships.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12 border rounded-lg bg-muted/10">
                            <p className="text-muted-foreground">No diary entries found matching your search.</p>
                            <Button variant="link" onClick={() => setSearchQuery("")}>Clear Search</Button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
