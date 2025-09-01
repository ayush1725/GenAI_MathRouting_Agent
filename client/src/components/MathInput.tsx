import { useState } from "react";
import { Play, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface MathInputProps {
  onSolutionReceived: (solution: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function MathInput({ onSolutionReceived, isLoading, setIsLoading }: MathInputProps) {
  const [problem, setProblem] = useState("");
  const [showSteps, setShowSteps] = useState(true);
  const [includeExplanations, setIncludeExplanations] = useState(true);
  const { toast } = useToast();

  const handleSolveProblem = async () => {
    if (!problem.trim()) {
      toast({
        title: "Error",
        description: "Please enter a mathematical problem",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/solve", {
        problem: problem.trim(),
        showSteps,
        includeExplanations,
      });

      const solution = await response.json();
      onSolutionReceived(solution);
      
      toast({
        title: "Solution Found",
        description: `Solved using ${solution.source === 'knowledge_base' ? 'Knowledge Base' : 'Web Search'}`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to solve problem";
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
    <Card className="glass-card border-2 border-transparent hover:border-primary/20 transition-all duration-300">
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold gradient-text">Enter Mathematical Problem</h2>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Powered by</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full pulse-indicator"></div>
              <span className="text-xs font-medium text-primary">Vector DB</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-secondary rounded-full pulse-indicator" style={{animationDelay: '1s'}}></div>
              <span className="text-xs font-medium text-secondary">Web Search</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Problem Statement
            </label>
            <Textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Enter your mathematical problem here... (e.g., 'Solve the quadratic equation x² + 5x + 6 = 0')"
              className="resize-none"
              rows={4}
              data-testid="input-problem"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stepByStep"
                  checked={showSteps}
                  onCheckedChange={setShowSteps}
                  data-testid="checkbox-steps"
                />
                <label htmlFor="stepByStep" className="text-sm text-foreground">
                  Show step-by-step solution
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="explanation"
                  checked={includeExplanations}
                  onCheckedChange={setIncludeExplanations}
                  data-testid="checkbox-explanations"
                />
                <label htmlFor="explanation" className="text-sm text-foreground">
                  Include explanations
                </label>
              </div>
            </div>
            <Button
              onClick={handleSolveProblem}
              disabled={isLoading || !problem.trim()}
              className="enhanced-button flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              data-testid="button-solve"
            >
              <Play className="w-4 h-4" />
              <span>{isLoading ? "Solving..." : "Solve Problem"}</span>
            </Button>
          </div>
        </div>

        {/* Guardrails Status */}
        <div className="mt-6 p-4 glass-card rounded-lg border border-green-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center pulse-indicator">
              <Shield className="text-green-400 w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">AI Guardrails Active</h4>
              <p className="text-xs text-muted-foreground">
                Content filtered for educational mathematics only. Privacy protection enabled.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
