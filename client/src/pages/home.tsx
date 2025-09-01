import { useState } from "react";
import { Calculator, Settings, Shield } from "lucide-react";
import MathInput from "@/components/MathInput";
import SolutionDisplay from "@/components/SolutionDisplay";
import FeedbackPanel from "@/components/FeedbackPanel";
import SystemStatus from "@/components/SystemStatus";

export default function Home() {
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
      
      {/* Header */}
      <header className="glass-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 step-number rounded-lg flex items-center justify-center relative overflow-hidden">
                <Calculator className="text-primary-foreground w-5 h-5 relative z-10" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Math Routing Agent</h1>
                <p className="text-xs text-muted-foreground typing-animation">AI-Powered Mathematical Problem Solver</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full pulse-indicator"></div>
                  <span>AI Gateway Active</span>
                </div>
              </div>
              <button 
                className="enhanced-button p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
                data-testid="button-settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="floating-card">
              <MathInput 
                onSolutionReceived={setCurrentSolution}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
            
            {currentSolution && (
              <div className="floating-card glow-border">
                <SolutionDisplay 
                  solution={currentSolution}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>

          <div className="space-y-6">
            {currentSolution && (
              <div className="floating-card">
                <FeedbackPanel problemId={currentSolution.problemId} />
              </div>
            )}
            <div className="floating-card">
              <SystemStatus />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-card border-t border-border mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">© 2024 Math Routing Agent</p>
              <span className="text-muted-foreground">•</span>
              <p className="text-sm text-muted-foreground">Powered by AI Gateway & Vector Search</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button className="enhanced-button text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded">
                Privacy Policy
              </button>
              <button className="enhanced-button text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded">
                Terms of Service
              </button>
              <button className="enhanced-button text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded">
                Documentation
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
