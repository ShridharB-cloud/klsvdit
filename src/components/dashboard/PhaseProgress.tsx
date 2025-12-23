import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Lock } from "lucide-react";

interface Phase {
  id: number;
  name: string;
  completion: string;
  status: "completed" | "current" | "locked";
  variant: "phase1" | "phase2" | "phase3" | "phase4" | "external";
}

interface PhaseProgressProps {
  phases: Phase[];
  currentPhase: number;
}

export function PhaseProgress({ phases, currentPhase }: PhaseProgressProps) {
  return (
    <div className="space-y-3">
      {phases.map((phase, index) => {
        const isCompleted = phase.status === "completed";
        const isCurrent = phase.status === "current";
        const isLocked = phase.status === "locked";

        return (
          <div
            key={phase.id}
            className={cn(
              "flex items-center gap-4 p-4 rounded-lg border transition-all",
              isCompleted && "bg-success/5 border-success/20",
              isCurrent && "bg-primary/5 border-primary/20",
              isLocked && "bg-muted border-muted"
            )}
          >
            {/* Status icon */}
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
                isCompleted && "bg-success text-success-foreground",
                isCurrent && "bg-primary text-primary-foreground",
                isLocked && "bg-muted-foreground/20 text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : isCurrent ? (
                <Clock className="h-5 w-5" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </div>

            {/* Phase info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(
                  "font-medium",
                  isLocked && "text-muted-foreground"
                )}>
                  {phase.name}
                </span>
                <Badge variant={isLocked ? "secondary" : phase.variant}>
                  {phase.completion}
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all duration-500",
                    isCompleted && "bg-success",
                    isCurrent && "bg-primary",
                    isLocked && "bg-muted-foreground/20"
                  )}
                  style={{
                    width: isCompleted ? "100%" : isCurrent ? "50%" : "0%",
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
