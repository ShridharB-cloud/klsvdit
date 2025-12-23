import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ClipboardCheck, 
  BookOpen, 
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";

const mockAssignedGroups = [
  {
    id: "G-2024-CSE-012",
    projectTitle: "AI-Powered Student Performance Prediction System",
    members: 4,
    currentPhase: 2,
    status: "on-track",
    lastActivity: "2 hours ago",
  },
  {
    id: "G-2024-CSE-015",
    projectTitle: "Smart Campus Navigation System",
    members: 4,
    currentPhase: 2,
    status: "needs-attention",
    lastActivity: "3 days ago",
  },
  {
    id: "G-2024-CSE-018",
    projectTitle: "Blockchain-based Certificate Verification",
    members: 3,
    currentPhase: 1,
    status: "on-track",
    lastActivity: "1 day ago",
  },
  {
    id: "G-2024-CSE-021",
    projectTitle: "IoT-based Energy Monitoring Dashboard",
    members: 4,
    currentPhase: 2,
    status: "delayed",
    lastActivity: "5 days ago",
  },
];

const mockPendingReviews = [
  {
    group: "G-2024-CSE-012",
    type: "Phase 2 Submission",
    submittedAt: "Jan 15, 2024",
    priority: "high",
  },
  {
    group: "G-2024-CSE-018",
    type: "Project Diary",
    submittedAt: "Jan 14, 2024",
    priority: "medium",
  },
  {
    group: "G-2024-CSE-015",
    type: "Phase 1 Revision",
    submittedAt: "Jan 12, 2024",
    priority: "low",
  },
];

const statusConfig = {
  "on-track": { icon: CheckCircle2, label: "On Track", variant: "success" as const },
  "needs-attention": { icon: AlertCircle, label: "Needs Attention", variant: "warning" as const },
  "delayed": { icon: XCircle, label: "Delayed", variant: "destructive" as const },
};

export default function MentorDashboard() {
  return (
    <DashboardLayout role="mentor">
      <div className="space-y-6">
        {/* Welcome section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome, Dr. Rajesh Kumar!</h2>
          <p className="text-muted-foreground">
            Manage your assigned groups and review submissions.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Assigned Groups"
            value={4}
            description="Active this semester"
            icon={Users}
            variant="primary"
          />
          <StatsCard
            title="Pending Reviews"
            value={3}
            description="Awaiting action"
            icon={ClipboardCheck}
            variant="warning"
          />
          <StatsCard
            title="Diary Entries"
            value={28}
            description="To review this week"
            icon={BookOpen}
          />
          <StatsCard
            title="Attention Needed"
            value={2}
            description="Groups behind schedule"
            icon={AlertCircle}
            variant="warning"
          />
        </div>

        {/* Assigned Groups */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Assigned Groups</CardTitle>
                <CardDescription>Quick overview of all your project groups</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {mockAssignedGroups.map((group) => {
                const StatusIcon = statusConfig[group.status].icon;
                return (
                  <div
                    key={group.id}
                    className="p-4 rounded-lg border hover:shadow-card transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary">{group.id}</Badge>
                      <Badge variant={statusConfig[group.status].variant}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[group.status].label}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-foreground mb-2 line-clamp-2">
                      {group.projectTitle}
                    </h4>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {group.members} members
                      </span>
                      <span>Phase {group.currentPhase}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last activity: {group.lastActivity}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Pending Reviews */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pending Reviews</CardTitle>
                <Badge variant="warning">{mockPendingReviews.length} pending</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockPendingReviews.map((review, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      review.priority === "high" ? "bg-destructive" :
                      review.priority === "medium" ? "bg-warning" : "bg-muted-foreground"
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{review.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {review.group} • {review.submittedAt}
                      </p>
                    </div>
                  </div>
                  <Button size="sm">Review</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <ClipboardCheck className="h-4 w-4 mr-3" />
                Review Phase Submissions
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-3" />
                Check Project Diaries
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-3" />
                Schedule Meeting
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertCircle className="h-4 w-4 mr-3" />
                Send Announcement
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
