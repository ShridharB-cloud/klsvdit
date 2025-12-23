import { GraduationCap } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-card py-12">
      <div className="container">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              ProjectMentorHub
            </span>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              KLS Vishwanathrao Deshpande Institute of Technology
            </p>
            <p className="text-xs text-muted-foreground">
              Academic Year {currentYear}-{currentYear + 1}
            </p>
          </div>
          
          <div className="w-full max-w-2xl border-t pt-6">
            <p className="text-xs text-center text-muted-foreground">
              This platform is designed for internal use by the institution to manage 
              major project activities as per VTU guidelines. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
