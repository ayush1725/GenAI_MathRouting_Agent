import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import MathInput from "@/components/MathInput";
import SolutionDisplay from "@/components/SolutionDisplay";
import FeedbackPanel from "@/components/FeedbackPanel";
import { Calculator, Brain, Sparkles } from "lucide-react";

export default function SolverPage() {
  const [currentSolution, setCurrentSolution] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Animated Background */}
      <div className="matrix-bg"></div>
      
      {/* Floating Particles */}
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>

      {/* Page Header */}
      <div className="relative z-10 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 glass-card rounded-full mb-6 border border-primary/20">
              <Brain className="w-4 h-4 text-accent mr-2" />
              <span className="text-sm gradient-text font-medium">AI Mathematical Solver</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Advanced Problem Solver
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Input any mathematical problem and watch our AI provide detailed, step-by-step solutions
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="floating-card">
              <MathInput 
                onSolutionReceived={setCurrentSolution}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
            
            {/* Solution Display */}
            {currentSolution && (
              <div className="floating-card glow-border">
                <SolutionDisplay 
                  solution={currentSolution}
                  isLoading={isLoading}
                />
              </div>
            )}

            {/* No Solution Placeholder */}
            {!currentSolution && !isLoading && (
              <Card className="glass-card border-2 border-dashed border-primary/20">
                <CardContent className="p-12 text-center">
                  <Calculator className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Ready to Solve
                  </h3>
                  <p className="text-muted-foreground">
                    Enter a mathematical problem above to see our AI in action
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Feedback Panel */}
            {currentSolution && (
              <div className="floating-card">
                <FeedbackPanel problemId={currentSolution.problemId} />
              </div>
            )}

            {/* Quick Examples */}
            <Card className="glass-card border border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-semibold gradient-text">Quick Examples</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 glass-card rounded-lg border border-primary/10 hover:border-primary/30 transition-colors cursor-pointer group">
                    <p className="text-sm font-mono text-foreground group-hover:gradient-text transition-all">
                      x² + 5x + 6 = 0
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Quadratic Equation</p>
                  </div>
                  
                  <div className="p-3 glass-card rounded-lg border border-primary/10 hover:border-primary/30 transition-colors cursor-pointer group">
                    <p className="text-sm font-mono text-foreground group-hover:gradient-text transition-all">
                      ∫(2x + 3)dx
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Integration</p>
                  </div>
                  
                  <div className="p-3 glass-card rounded-lg border border-primary/10 hover:border-primary/30 transition-colors cursor-pointer group">
                    <p className="text-sm font-mono text-foreground group-hover:gradient-text transition-all">
                      lim(x→0) sin(x)/x
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Limits</p>
                  </div>
                  
                  <div className="p-3 glass-card rounded-lg border border-primary/10 hover:border-primary/30 transition-colors cursor-pointer group">
                    <p className="text-sm font-mono text-foreground group-hover:gradient-text transition-all">
                      P(A∩B) = P(A)×P(B|A)
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Probability</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Status */}
            <Card className="glass-card border border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center pulse-indicator">
                    <Brain className="text-green-400 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-green-400">AI Systems Online</h4>
                    <p className="text-xs text-muted-foreground">
                      Vector DB • Web Search • Guardrails Active
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}