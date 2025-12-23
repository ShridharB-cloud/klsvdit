import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PhaseProgress } from "@/components/dashboard/PhaseProgress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStudentGroup } from "@/hooks/useStudentGroup";
import { useProjectDiary } from "@/hooks/useProjectDiary";
import { useProjectPhases } from "@/hooks/useProjectPhases";
import { AddDiaryEntryDialog } from "@/components/dashboard/AddDiaryEntryDialog";
import {
  FolderKanban,
  BookOpen,
  FileText,
  Calendar,
  Users,
  ArrowRight,
  Clock,
  AlertCircle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const mockGroupData = {
  id: "G-2024-CSE-012",
  project_title: "AI-Powered Student Performance Prediction System",
  mentor_name: "Dr. Rajesh Kumar",
  members: ["Priya Sharma", "Rahul Verma", "Sneha Patil", "Amit Desai"],
  department: "Computer Science & Engineering",
  batch_year: "2024"
};

const mockPhases = [
  { id: 1, name: "Phase 1", completion: "25%", status: "completed" as const, variant: "phase1" as const },
  { id: 2, name: "Phase 2", completion: "50%", status: "current" as const, variant: "phase2" as const },
  { id: 3, name: "Phase 3", completion: "75%", status: "locked" as const, variant: "phase3" as const },
  { id: 4, name: "Phase 4", completion: "100%", status: "locked" as const, variant: "phase4" as const },
  { id: 5, name: "External Review", completion: "Final", status: "locked" as const, variant: "external" as const },
];

const mockDiaryEntries = [
  { entry_date: "2024-01-15", work_done: "Completed database schema design", is_reviewed: true },
  { entry_date: "2024-01-08", work_done: "Finalized project architecture", is_reviewed: true },
  { entry_date: "2024-01-01", work_done: "Initial project setup and research", is_reviewed: true },
];

const mockUpcomingEvents = [
  { title: "Phase 2 Submission", date: "Jan 25, 2024", type: "deadline" },
  { title: "Mentor Meeting", date: "Jan 20, 2024", type: "meeting" },
  { title: "Group Discussion", date: "Jan 18, 2024", type: "meeting" },
];

export default function StudentDashboard() {
  const { data: realGroupData, isLoading: groupLoading } = useStudentGroup();
  const { diaryEntries: realDiaryEntries, isLoading: diaryLoading } = useProjectDiary();
  const { data: realPhases, isLoading: phasesLoading } = useProjectPhases();

  // Use real data if available, otherwise fallback to mock data (Prototype Mode)
  const groupData = realGroupData || mockGroupData;
  const diaryEntries = (realDiaryEntries && realDiaryEntries.length > 0) ? realDiaryEntries : mockDiaryEntries;

  // If we are falling back to mock group data, use mock phases to ensure consistency (e.g. Phase 2 current)
  // Otherwise use real phases (or mock if real is somehow empty)
  const phases = (realGroupData && realPhases && realPhases.length > 0) ? realPhases : mockPhases;

  // Determine current phase for Stats Card
  const currentPhaseObj = phases.find(p => p.status === 'current') || phases.find(p => p.status === 'completed') || phases[0];
  const currentPhaseName = currentPhaseObj ? currentPhaseObj.name : "Phase 1";

  if (groupLoading || diaryLoading || phasesLoading) {
    return (
      <DashboardLayout role="student">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Only show empty state if BOTH real and mock data are missing
  if (!groupData) {
    return (
      <DashboardLayout role="student">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome!</h2>
            <p className="text-muted-foreground">You are not assigned to any project group yet.</p>
          </div>

          <Card className="border-warning bg-warning/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                <CardTitle className="text-warning">Action Required</CardTitle>
              </div>
              <CardDescription>
                Please contact your department coordinator to get assigned to a Project Group.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Welcome section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here's an overview of your project progress.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Current Phase"
            value={currentPhaseName}
            description="50% completion target"
            icon={FolderKanban}
            variant="primary"
          />
          <StatsCard
            title="Diary Entries"
            value={diaryEntries.length}
            description="This semester"
            icon={BookOpen}
            variant="success"
          />
          <StatsCard
            title="Documents"
            value={8}
            description="Uploaded files"
            icon={FileText}
          />
          <StatsCard
            title="Days to Deadline"
            value={10}
            description="Phase 2 submission"
            icon={Calendar}
            variant="warning"
          />
        </div>

        {/* Main content grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Group Overview - CONNECTED */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Group Overview</CardTitle>
                  <CardDescription>{groupData.id}</CardDescription>
                </div>
                <Badge variant="phase2">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Project Title</h4>
                <p className="text-lg font-semibold text-foreground">{groupData.project_title}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Mentor</h4>
                  <p className="font-medium">{groupData.mentor_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Department</h4>
                  <p className="font-medium">{groupData.department}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Team Members</h4>
                <div className="flex flex-wrap gap-2">
                  {groupData.members.map((member) => (
                    <div
                      key={member}
                      className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5"
                    >
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events - Mock for now */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockUpcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
                >
                  <div className={`h-2 w-2 rounded-full mt-2 ${event.type === "deadline" ? "bg-warning" : "bg-primary"
                    }`} />
                  <div>
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.date}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full" size="sm">
                View Full Schedule
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Phase Progress & Recent Diary */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Phase Progress - CONNECTED */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Phase Progress</CardTitle>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <PhaseProgress phases={phases} currentPhase={currentPhaseObj?.id || 1} />
            </CardContent>
          </Card>

          {/* Recent Diary Entries - CONNECTED */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Diary Entries</CardTitle>
                <AddDiaryEntryDialog />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {diaryEntries.slice(0, 5).map((entry, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg border"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary shrink-0">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{entry.entry_date}</span>
                      <Badge variant={entry.is_reviewed ? "success" : "secondary"} className="text-xs">
                        {entry.is_reviewed ? "Reviewed" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {entry.work_done}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full" size="sm">
                View All Entries
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
