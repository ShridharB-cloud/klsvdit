import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PhaseProgress } from "@/components/dashboard/PhaseProgress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FolderKanban, 
  BookOpen, 
  FileText, 
  Calendar,
  Users,
  ArrowRight,
  Clock
} from "lucide-react";

const mockGroupData = {
  groupId: "G-2024-CSE-012",
  projectTitle: "AI-Powered Student Performance Prediction System",
  mentor: "Dr. Rajesh Kumar",
  members: ["Priya Sharma", "Rahul Verma", "Sneha Patil", "Amit Desai"],
  department: "Computer Science & Engineering",
  currentPhase: 2,
};

const mockPhases = [
  { id: 1, name: "Phase 1", completion: "25%", status: "completed" as const, variant: "phase1" as const },
  { id: 2, name: "Phase 2", completion: "50%", status: "current" as const, variant: "phase2" as const },
  { id: 3, name: "Phase 3", completion: "75%", status: "locked" as const, variant: "phase3" as const },
  { id: 4, name: "Phase 4", completion: "100%", status: "locked" as const, variant: "phase4" as const },
  { id: 5, name: "External Review", completion: "Final", status: "locked" as const, variant: "external" as const },
];

const mockDiaryEntries = [
  { date: "2024-01-15", work: "Completed database schema design", status: "reviewed" },
  { date: "2024-01-08", work: "Finalized project architecture", status: "reviewed" },
  { date: "2024-01-01", work: "Initial project setup and research", status: "reviewed" },
];

const mockUpcomingEvents = [
  { title: "Phase 2 Submission", date: "Jan 25, 2024", type: "deadline" },
  { title: "Mentor Meeting", date: "Jan 20, 2024", type: "meeting" },
  { title: "Group Discussion", date: "Jan 18, 2024", type: "meeting" },
];

export default function StudentDashboard() {
  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Welcome section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome back, Priya!</h2>
          <p className="text-muted-foreground">
            Here's an overview of your project progress.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Current Phase"
            value="Phase 2"
            description="50% completion target"
            icon={FolderKanban}
            variant="primary"
          />
          <StatsCard
            title="Diary Entries"
            value={12}
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
          {/* Group Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Group Overview</CardTitle>
                  <CardDescription>{mockGroupData.groupId}</CardDescription>
                </div>
                <Badge variant="phase2">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Project Title</h4>
                <p className="text-lg font-semibold text-foreground">{mockGroupData.projectTitle}</p>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Mentor</h4>
                  <p className="font-medium">{mockGroupData.mentor}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Department</h4>
                  <p className="font-medium">{mockGroupData.department}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Team Members</h4>
                <div className="flex flex-wrap gap-2">
                  {mockGroupData.members.map((member) => (
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

          {/* Upcoming Events */}
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
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    event.type === "deadline" ? "bg-warning" : "bg-primary"
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
          {/* Phase Progress */}
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
              <PhaseProgress phases={mockPhases} currentPhase={2} />
            </CardContent>
          </Card>

          {/* Recent Diary Entries */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Diary Entries</CardTitle>
                <Button variant="outline" size="sm">
                  Add Entry
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockDiaryEntries.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg border"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary shrink-0">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{entry.date}</span>
                      <Badge variant="success" className="text-xs">
                        {entry.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {entry.work}
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
