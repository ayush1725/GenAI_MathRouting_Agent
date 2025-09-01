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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Calculator className="text-primary-foreground w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Math Routing Agent</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Mathematical Problem Solver</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>AI Gateway Active</span>
                </div>
              </div>
              <button 
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <MathInput 
              onSolutionReceived={setCurrentSolution}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
            
            {currentSolution && (
              <SolutionDisplay 
                solution={currentSolution}
                isLoading={isLoading}
              />
            )}
          </div>

          <div className="space-y-6">
            {currentSolution && (
              <FeedbackPanel problemId={currentSolution.problemId} />
            )}
            <SystemStatus />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">© 2024 Math Routing Agent</p>
              <span className="text-muted-foreground">•</span>
              <p className="text-sm text-muted-foreground">Powered by AI Gateway & Vector Search</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
