import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  const benefits = [
    "Organized mentoring workflow",
    "Transparent progress tracking",
    "Simplified evaluation process",
  ];

  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-accent/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6 animate-fade-in">
            Engineering Project Management
          </Badge>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-fade-in text-balance" style={{ animationDelay: "0.1s" }}>
            Centralized Major Project{" "}
            <span className="text-primary">Monitoring & Mentorship</span>{" "}
            Platform
          </h1>
          
          <p className="mb-8 text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            A college-internal platform that digitally manages project groups, 
            mentor allocation, phased progress tracking, documentation, 
            reviews, and external evaluation in one structured system.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-secondary-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-success" />
                {benefit}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button size="xl" variant="hero" asChild>
              <Link to="/login">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
