import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, UserCheck, Settings } from "lucide-react";

const roles = [
  {
    icon: GraduationCap,
    title: "Students",
    badge: "Team Members",
    features: [
      "View group overview and project details",
      "Track progress through project phases",
      "Maintain weekly project diary",
      "Upload and manage documents",
      "View meeting schedules and deadlines",
    ],
  },
  {
    icon: UserCheck,
    title: "Mentors",
    badge: "Faculty Guides",
    features: [
      "View assigned groups (4-5 per mentor)",
      "Review phase submissions",
      "Add remarks and approve phases",
      "Review weekly project diaries",
      "Send group announcements",
    ],
  },
  {
    icon: Settings,
    title: "Project Coordinator",
    badge: "Admin",
    features: [
      "Configure academic year and batches",
      "Create groups and assign mentors",
      "Define phase deadlines",
      "Monitor overall progress",
      "Generate reports and analytics",
    ],
  },
];

export function RolesSection() {
  return (
    <section id="roles" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Roles Supported
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each role has a dedicated dashboard with specific features 
            designed for their responsibilities in the project workflow.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {roles.map((role, index) => (
            <Card 
              key={role.title} 
              variant="elevated"
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-hero">
                    <role.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
                <Badge variant="secondary" className="w-fit mx-auto mb-2">
                  {role.badge}
                </Badge>
                <CardTitle className="text-2xl">{role.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {role.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
