import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, UserCheck, Settings, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type UserRole = "student" | "mentor" | "admin";

const roleIcons = {
  student: GraduationCap,
  mentor: UserCheck,
  admin: Settings,
};

const roleLabels = {
  student: "Student",
  mentor: "Mentor",
  admin: "Admin",
};

const roleDescriptions = {
  student: "Access your project dashboard, phases, and diary",
  mentor: "Review assigned groups and approve submissions",
  admin: "Manage groups, mentors, and academic settings",
};

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login - in production, this would call your auth API
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login successful",
        description: `Welcome back! Redirecting to ${roleLabels[selectedRole]} dashboard...`,
      });
      
      // Navigate to the appropriate dashboard
      navigate(`/dashboard/${selectedRole}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-hero mb-4">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">ProjectMentorHub</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
          </div>

          <Card variant="elevated">
            <CardHeader className="text-center pb-4">
              <CardTitle>Select Your Role</CardTitle>
              <CardDescription>Choose how you want to sign in</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Role Selection Tabs */}
              <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)} className="mb-6">
                <TabsList className="grid w-full grid-cols-3">
                  {(Object.keys(roleLabels) as UserRole[]).map((role) => {
                    const Icon = roleIcons[role];
                    return (
                      <TabsTrigger 
                        key={role} 
                        value={role}
                        className="flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{roleLabels[role]}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                  <TabsContent key={role} value={role} className="mt-4">
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      {roleDescriptions[role]}
                    </p>
                  </TabsContent>
                ))}
              </Tabs>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {selectedRole === "student" ? "USN / Email" : "Email"}
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder={selectedRole === "student" ? "Enter your USN or email" : "Enter your email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link 
                      to="/forgot-password" 
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="hero"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : `Sign in as ${roleLabels[selectedRole]}`}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  Contact your Project Coordinator if you need access to the platform.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
