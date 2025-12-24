import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  FileText,
  Calendar,
  Users,
  ClipboardCheck,
  MessageSquare,
  Settings,
  BarChart3,
  LogOut,
  Bell,
  UserCheck,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

type UserRole = "student" | "mentor" | "admin";

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
}

const studentNavItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard/student" },
  { icon: FolderKanban, label: "Project Phases", href: "/dashboard/student/phases" },
  { icon: BookOpen, label: "Project Diary", href: "/dashboard/student/diary" },
  { icon: FileText, label: "Documents", href: "/dashboard/student/documents" },
  { icon: Calendar, label: "Schedule", href: "/dashboard/student/schedule" },
];

const mentorNavItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard/mentor" },
  { icon: Users, label: "Assigned Groups", href: "/dashboard/mentor/groups" },
  { icon: ClipboardCheck, label: "Phase Reviews", href: "/dashboard/mentor/reviews" },
  { icon: BookOpen, label: "Diary Reviews", href: "/dashboard/mentor/diary-reviews" },
  { icon: MessageSquare, label: "Announcements", href: "/dashboard/mentor/announcements" },
];

const adminNavItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard/admin" },
  { icon: UserCheck, label: "User Management", href: "/dashboard/admin/users" },
  { icon: Users, label: "Group Management", href: "/dashboard/admin/groups" },
  { icon: Settings, label: "Academic Setup", href: "/dashboard/admin/setup" },
  { icon: FolderKanban, label: "Phase Config", href: "/dashboard/admin/phases" },

];

const navItemsByRole = {
  student: studentNavItems,
  mentor: mentorNavItems,
  admin: adminNavItems,
};

const roleTitles = {
  student: "Student Dashboard",
  mentor: "Mentor Dashboard",
  admin: "Admin Dashboard",
};

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = navItemsByRole[role];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-foreground">
            ProjectMentorHub
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b bg-card">
          <div className="flex items-center gap-4">
            {/* Mobile menu button would go here */}
            <h1 className="text-lg font-semibold text-foreground">
              {roleTitles[role]}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <ModeToggle />
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {role[0].toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
