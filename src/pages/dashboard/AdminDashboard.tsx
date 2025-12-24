import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  FolderKanban,
  UserCheck,
  Building2,
  ArrowRight,
  Plus,
  Download,
  AlertTriangle
} from "lucide-react";
import { useAdminStats } from "@/hooks/useAdminStats";

const mockDepartmentStats = [
  { name: "Computer Science", groups: 15, progress: 68, onTrack: 12, delayed: 3 },
  { name: "Electronics", groups: 10, progress: 72, onTrack: 8, delayed: 2 },
  { name: "Mechanical", groups: 8, progress: 55, onTrack: 5, delayed: 3 },
  { name: "Civil", groups: 6, progress: 80, onTrack: 6, delayed: 0 },
];

const mockDelayedGroups = [
  { id: "G-2024-CSE-021", project: "IoT Energy Monitoring", mentor: "Dr. Rajesh Kumar", daysDelayed: 5 },
  { id: "G-2024-ECE-008", project: "Drone Navigation System", mentor: "Prof. Meena Sharma", daysDelayed: 7 },
  { id: "G-2024-MECH-003", project: "Automated Assembly Line", mentor: "Dr. Suresh Patil", daysDelayed: 3 },
];

const mockRecentActivity = [
  { action: "New group created", detail: "G-2024-CSE-025", time: "2 hours ago" },
  { action: "Mentor assigned", detail: "Dr. Anil Deshmukh → G-2024-ECE-012", time: "5 hours ago" },
  { action: "Phase 2 deadline extended", detail: "CSE Department", time: "1 day ago" },
  { action: "External reviewer added", detail: "Prof. John Smith", time: "2 days ago" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useAdminStats();

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Admin Dashboard</h2>
            <p className="text-muted-foreground">
              Academic Year 2024-25 • Semester II
            </p>
          </div>
          <div className="flex gap-3">

            <Button variant="hero" onClick={() => navigate("/dashboard/admin/groups")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Groups"
            value={isLoading ? "..." : stats?.totalGroups || 0}
            description="Active this semester"
            icon={FolderKanban}
            variant="primary"
          />
          <StatsCard
            title="Total Students"
            value={isLoading ? "..." : stats?.totalStudents || 0}
            description="Across all groups"
            icon={Users}
          />
          <StatsCard
            title="Mentors"
            value={isLoading ? "..." : stats?.totalMentors || 0}
            description="Faculty assigned"
            icon={UserCheck}
            variant="success"
          />
          <StatsCard
            title="Departments"
            value={isLoading ? "..." : stats?.totalDepartments || 0}
            description="Participating"
            icon={Building2}
          />
        </div>

        {/* Department Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Department Progress Overview</CardTitle>
                <CardDescription>Project completion status by department</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View Details
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockDepartmentStats.map((dept) => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{dept.name}</span>
                      <Badge variant="secondary">{dept.groups} groups</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-success">{dept.onTrack} on track</span>
                      {dept.delayed > 0 && (
                        <span className="text-warning">{dept.delayed} delayed</span>
                      )}
                      <span className="font-medium">{dept.progress}%</span>
                    </div>
                  </div>
                  <Progress value={dept.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Delayed Groups */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Delayed Groups
                </CardTitle>
                <Badge variant="warning">{stats?.delayedGroups?.length || 0} groups</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats?.delayedGroups?.length === 0 && (
                <p className="text-sm text-muted-foreground">No groups are currently marked as delayed.</p>
              )}
              {stats?.delayedGroups?.map((group: any) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-warning/20 bg-warning/5"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">{group.id}</Badge>
                      <span className="text-xs text-warning font-medium">
                        Attention Needed
                      </span>
                    </div>
                    <p className="text-sm font-medium">{group.project}</p>
                    <p className="text-xs text-muted-foreground">{group.mentor}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Contact
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockRecentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
              <Button variant="ghost" className="w-full" size="sm">
                View All Activity
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/dashboard/admin/groups")}>
                <Users className="h-5 w-5" />
                <span>Manage Groups</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/dashboard/admin/groups")}>
                <UserCheck className="h-5 w-5" />
                <span>Assign Mentors</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/dashboard/admin/phases")}>
                <FolderKanban className="h-5 w-5" />
                <span>Phase Settings</span>
              </Button>

            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
