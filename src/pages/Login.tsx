import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) throw new Error("No user found");

      // Fetch user roles
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authData.user.id);

      if (roleError) throw roleError;

      const userRoles = roleData?.map(r => r.role) || [];

      // DEV BYPASS: Allow 'shridhar' email to access ALL roles
      if (email.toLowerCase().includes("shridhar")) {
        if (!userRoles.includes("mentor")) userRoles.push("mentor");
        if (!userRoles.includes("admin")) userRoles.push("admin");
        if (!userRoles.includes("student")) userRoles.push("student");
        console.log("Dev Bypass: Granting all roles to", email);
      }

      if (userRoles.length === 0) {
        toast({
          title: "Login successful",
          description: "No role assigned. Please contact administrator.",
          variant: "destructive",
        });
        return;
      }

      // Check if the user has the selected role
      if (userRoles.includes(selectedRole)) {
        console.log(`Login successful. Redirecting to /dashboard/${selectedRole}`);
        toast({
          title: "Login successful",
          description: `Welcome back! Redirecting to ${roleLabels[selectedRole]} dashboard...`,
        });
        setTimeout(() => navigate(`/dashboard/${selectedRole}`), 500);
      } else {
        // User has roles, but not the one selected.
        // Redirect to the first available role or warn?
        // Let's redirect to their primary role (first one found)
        const primaryRole = userRoles[0] as UserRole;
        console.log(`Role mismatch: User has [${userRoles.join(', ')}] but selected ${selectedRole}. Redirecting to ${primaryRole}`);
        toast({
          title: "Access Denied for Selected Role",
          description: `You are registered as a ${roleLabels[primaryRole]}. Redirecting...`,
        });
        setTimeout(() => navigate(`/dashboard/${primaryRole}`), 500);
      }
    } catch (error: unknown) {
      let errorMessage = "Invalid credentials";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      }
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            <p className="text-sm text-muted-foreground mt-1">Sign in or create an account</p>
          </div>

          <Card variant="elevated">
            <CardHeader className="text-center pb-4">
              <CardTitle>Select Your Role</CardTitle>
              <CardDescription>Choose how you want to access the platform</CardDescription>
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

              {/* Login/Signup Form */}
              <AuthForm selectedRole={selectedRole} />

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

function AuthForm({ selectedRole }: { selectedRole: UserRole }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [usn, setUsn] = useState(""); // Only for students
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("No user found");

        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", authData.user.id);

        if (roleError) throw roleError;

        const userRoles = roleData?.map(r => r.role) || [];

        // DEV BYPASS: Allow 'shridhar' email to access ALL roles
        if (email.toLowerCase().includes("shridhar")) {
          if (!userRoles.includes("mentor")) userRoles.push("mentor");
          if (!userRoles.includes("admin")) userRoles.push("admin");
          if (!userRoles.includes("student")) userRoles.push("student");
          console.log("Dev Bypass: Granting all roles to", email);
        }

        // If no roles found, default to student for new/legacy users
        if (userRoles.length === 0) {
          userRoles.push("student");
          toast({
            title: "Verifying Role",
            description: "Defaulting to Student access as role verification is pending.",
          });
        }

        if (userRoles.includes(selectedRole)) {
          console.log(`Login successful. Redirecting to /dashboard/${selectedRole}`);
          toast({ title: "Login successful", description: "Welcome back!" });
          setTimeout(() => navigate(`/dashboard/${selectedRole}`), 500);
        } else {
          const primaryRole = userRoles[0] as UserRole;
          console.log(`Role mismatch: User has [${userRoles.join(', ')}] but selected ${selectedRole}. Redirecting to ${primaryRole}`);
          toast({ title: "Role Mismatch", description: `You have access as ${primaryRole}. Redirecting...` });
          setTimeout(() => navigate(`/dashboard/${primaryRole}`), 500);
        }

      } else {
        // --- SIGNUP LOGIC ---
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              // For students, we might want to store USN in metadata or profile immediately,
              // but the trigger only handles full_name. We'll update profile manually if needed.
            },
          },
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("Signup failed");

        // Insert into user_roles
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: authData.user.id,
          role: selectedRole,
        });

        if (roleError) {
          // Verify if it's a duplicate or RLS issue. 
          // For now, assume success if auth worked, but warn about role.
          console.error("Role assignment failed:", roleError);
          toast({ title: "Signup incomplete", description: "Account created but role assignment failed. Contact admin.", variant: "destructive" });
          return;
        }

        // If student, update profile with USN
        if (selectedRole === "student" && usn) {
          await supabase.from("profiles").update({ usn }).eq("user_id", authData.user.id);
        }

        toast({ title: "Signup successful", description: "Please check your email to confirm your account (if email verification is enabled), or log in." });
        setIsLogin(true); // Switch to login view
      }

    } catch (error: unknown) {
      let errorMessage = "Authentication failed";
      if (error instanceof Error) {
        errorMessage = error.message;
        if (errorMessage.includes("Email not confirmed")) {
          errorMessage = "Please verify your email address before logging in.";
        }
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      }

      console.error("Auth error:", error);

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAuth} className="space-y-4">
      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
      )}

      {!isLogin && selectedRole === "student" && (
        <div className="space-y-2">
          <Label htmlFor="usn">USN</Label>
          <Input id="usn" placeholder="University Seat Number" value={usn} onChange={(e) => setUsn(e.target.value)} required />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">{selectedRole === "student" ? "Email" : "Email"}</Label>
        <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {isLogin && <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>}
        </div>
        <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <Button type="submit" className="w-full" variant="hero" disabled={isLoading}>
        {isLoading ? "Processing..." : (isLogin ? `Sign in as ${selectedRole}` : `Sign up as ${selectedRole}`)}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">{isLogin ? "Don't have an account?" : "Already have an account?"}</span>{" "}
        <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-medium">
          {isLogin ? "Sign up" : "Sign in"}
        </button>
      </div>
    </form>
  );
}
