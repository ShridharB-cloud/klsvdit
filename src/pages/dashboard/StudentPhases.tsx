
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useProjectPhases } from "@/hooks/useProjectPhases";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Clock, Lock, ArrowRight, FileText, Upload } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Mock details for phases description since DB only has basic info
const PHASE_DETAILS: Record<number, { description: string, deliverables: string[] }> = {
    1: {
        description: "Identify a real-world problem and propose a feasible solution.",
        deliverables: ["Problem Statement", "Literature Survey", "Proposed Architecture"]
    },
    2: {
        description: "Design the system architecture, database schema, and detailed project plan.",
        deliverables: ["System Design Document", "ER Diagram", "Project Plan"]
    },
    3: {
        description: "Implement the core modules of the project according to the design.",
        deliverables: ["Source Code", "Working Prototype", "Unit Test Reports"]
    },
    4: {
        description: "Perform comprehensive testing and document the entire project.",
        deliverables: ["Test Cases", "Project Report", "User Manual"]
    },
    5: {
        description: "Final evaluation and external viva voce.",
        deliverables: ["Final Presentation", "Project Demo"]
    }
};

export default function StudentPhases() {
    const { data: realPhases, isLoading } = useProjectPhases();
    const navigate = useNavigate();

    // Prototype Fallback
    const phases = realPhases || [];

    if (isLoading) {
        return (
            <DashboardLayout role="student">
                <div className="space-y-6">
                    <Skeleton className="h-8 w-[200px]" />
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full" />)}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="student">
            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Project Phases</h2>
                        <p className="text-muted-foreground mt-1">
                            Track your project progress and manage deliverables for each phase.
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => navigate("/dashboard/student")}>
                        Back to Dashboard
                    </Button>
                </div>

                <div className="space-y-6">
                    {phases.length > 0 ? (
                        phases.map((phase) => {
                            const details = PHASE_DETAILS[phase.id] || { description: "No details available.", deliverables: [] };
                            const isLocked = phase.status === "locked";
                            const isCompleted = phase.status === "completed";

                            return (
                                <Card key={phase.id} className={cn("transition-all duration-200", isLocked ? "opacity-75 bg-muted/30" : "border-primary/20 bg-card/50")}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={cn(
                                                        "flex h-8 w-8 items-center justify-center rounded-full shrink-0",
                                                        isCompleted && "bg-success text-success-foreground",
                                                        phase.status === 'current' && "bg-primary text-primary-foreground",
                                                        isLocked && "bg-muted-foreground/20 text-muted-foreground"
                                                    )}
                                                >
                                                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : isLocked ? <Lock className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                                </div>
                                                <div>
                                                    <CardTitle className={cn("text-xl", isLocked && "text-muted-foreground")}>{phase.name}</CardTitle>
                                                    <CardDescription className="mt-1">
                                                        {details.description}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <Badge variant={phase.status === 'current' ? phase.variant : isCompleted ? 'success' : 'outline'}>
                                                {phase.status === 'current' ? 'In Progress' : isCompleted ? 'Completed' : 'Locked'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {!isLocked && (
                                            <>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-primary" />
                                                            Key Deliverables
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {details.deliverables.map((item, idx) => (
                                                                <li key={idx} className="text-sm text-foreground flex items-center gap-2">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="flex flex-col justify-end space-y-3">
                                                        <div className="flex items-center justify-between text-sm mb-2">
                                                            <span className="text-muted-foreground">Completion</span>
                                                            <span className="font-medium">{phase.completion}</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                            <div
                                                                className={cn("h-full transition-all duration-500", isCompleted ? "bg-success" : "bg-primary")}
                                                                style={{ width: phase.completion }}
                                                            />
                                                        </div>

                                                        <div className="pt-2">
                                                            <Button className="w-full" disabled={isLocked || isCompleted}>
                                                                <Upload className="h-4 w-4 mr-2" />
                                                                {isCompleted ? "View Submission" : "Submit Deliverables"}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {isLocked && (
                                            <div className="flex items-center justify-center py-6 text-muted-foreground text-sm italic">
                                                Complete previous phases to unlock this section.
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="text-center py-10 text-muted-foreground">
                            No phases found.
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
