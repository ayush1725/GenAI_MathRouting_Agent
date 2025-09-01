import { CheckCircle, Info, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Step {
  step: number;
  title: string;
  content: string;
  explanation: string;
}

interface Solution {
  steps: Step[];
  finalAnswer: string;
  sources?: Array<{ title: string; url: string }>;
}

interface SolutionDisplayProps {
  solution: {
    problem: string;
    solution: Solution;
    source: 'knowledge_base' | 'web_search';
    responseTime: number;
    category?: string;
    problemId: string;
  };
  isLoading: boolean;
}

export default function SolutionDisplay({ solution, isLoading }: SolutionDisplayProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-3 py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground loading-dots">Processing your mathematical problem</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { solution: solutionData, source, responseTime, category } = solution;

  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold gradient-text">Solution</h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full pulse-indicator ${source === 'knowledge_base' ? 'bg-primary' : 'bg-secondary'}`}></div>
              <span className={`text-xs font-medium ${source === 'knowledge_base' ? 'text-primary' : 'text-secondary'}`}>
                {source === 'knowledge_base' ? 'Knowledge Base' : 'Web Search'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">
              Response time: {(responseTime / 1000).toFixed(1)}s
            </span>
          </div>
        </div>

        {/* Web Search Notice */}
        {source === 'web_search' && (
          <div className="glass-card border border-yellow-500/20 p-4 rounded-lg mb-6">
            <div className="flex items-start space-x-3">
              <Info className="text-yellow-400 w-4 h-4 mt-0.5 pulse-indicator" />
              <div>
                <h4 className="text-sm font-medium text-yellow-400 mb-1">Advanced Topic</h4>
                <p className="text-sm text-muted-foreground">
                  This problem wasn't found in our knowledge base. I've searched the web to provide you with the most current information.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Solution Steps */}
        <div className="space-y-6" data-testid="solution-steps">
          {solutionData.steps.map((step: Step) => (
            <div key={step.step} className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="step-number w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                  {step.step}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-2">{step.title}</h4>
                <div className="bg-muted p-4 rounded-lg mb-3">
                  <div className="math-expression text-foreground whitespace-pre-line">
                    {step.content}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{step.explanation}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Final Answer */}
        <div className="mt-6">
          <div className="glass-card border border-green-500/20 p-4 rounded-lg glow-border">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="text-green-400 w-4 h-4 pulse-indicator" />
              <span className="text-sm font-medium text-green-400">Final Answer</span>
            </div>
            <div className="math-expression text-foreground text-lg font-mono" data-testid="text-final-answer">
              {solutionData.finalAnswer}
            </div>
          </div>
        </div>

        {/* Sources (for web search) */}
        {solutionData.sources && solutionData.sources.length > 0 && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-2">Sources</h4>
            <div className="space-y-1">
              {solutionData.sources.map((source, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                  {source.title}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Verification Note */}
        <div className="mt-6 p-4 glass-card border border-blue-500/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="text-blue-400 w-4 h-4 mt-0.5 pulse-indicator" />
            <div>
              <h4 className="text-sm font-medium text-blue-400 mb-1">Verification</h4>
              <p className="text-sm text-muted-foreground">
                Always verify mathematical solutions by substituting back into the original equation or checking the logic of each step.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
