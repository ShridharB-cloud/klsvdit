import { Badge } from "@/components/ui/badge";

const phases = [
  {
    phase: "Phase 1",
    completion: "25%",
    variant: "phase1" as const,
    description: "Project proposal and initial documentation",
  },
  {
    phase: "Phase 2",
    completion: "50%",
    variant: "phase2" as const,
    description: "Design and architecture finalization",
  },
  {
    phase: "Phase 3",
    completion: "75%",
    variant: "phase3" as const,
    description: "Implementation and testing",
  },
  {
    phase: "Phase 4",
    completion: "100%",
    variant: "phase4" as const,
    description: "Final report and documentation",
  },
  {
    phase: "External Review",
    completion: "Final",
    variant: "external" as const,
    description: "External evaluation and grading",
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Project Phases
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Structured progress tracking through VTU-aligned project phases 
            ensures systematic completion and evaluation.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Progress line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
          
          <div className="space-y-6">
            {phases.map((phase, index) => (
              <div 
                key={phase.phase}
                className="relative flex gap-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Timeline dot */}
                <div className="hidden md:flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card border-4 border-border shadow-card z-10">
                    <Badge variant={phase.variant} className="text-xs font-bold">
                      {phase.completion}
                    </Badge>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 bg-card rounded-xl p-6 shadow-card border">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {phase.phase}
                    </h3>
                    <Badge variant={phase.variant} className="md:hidden">
                      {phase.completion}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {phase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
