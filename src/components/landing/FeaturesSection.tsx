import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  ClipboardCheck, 
  FileText, 
  Calendar, 
  Bell, 
  Shield 
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Group Management",
    description: "Create and manage project groups with up to 4 students per team, assign mentors, and track team dynamics.",
  },
  {
    icon: ClipboardCheck,
    title: "Phased Progress Tracking",
    description: "Monitor project completion through structured phases (25%, 50%, 75%, 100%) with clear milestones and deliverables.",
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Centralized repository for synopsis, SRS, design docs, PPTs, and reports with version control.",
  },
  {
    icon: Calendar,
    title: "Project Diary",
    description: "Weekly logs for work done, issues faced, and next plans with auto-timestamps and mentor review system.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Automated reminders for phase deadlines, submission alerts, mentor feedback, and evaluation announcements.",
  },
  {
    icon: Shield,
    title: "Academic Integrity",
    description: "Role-based access control, audit logs, data privacy, and no deletion after submission ensures academic standards.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Why This Platform Exists
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Traditional project tracking methods are fragmented and inefficient. 
            Our platform provides a unified solution for the entire project lifecycle.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              variant="interactive"
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
