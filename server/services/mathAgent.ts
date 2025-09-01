import { storage } from '../storage';
import { spawn } from 'child_process';
import path from 'path';

export interface MathSolutionRequest {
  problem: string;
  showSteps: boolean;
  includeExplanations: boolean;
}

export interface MathSolutionResponse {
  problem: string;
  solution: any;
  source: 'knowledge_base' | 'web_search';
  responseTime: number;
  category?: string;
  problemId: string;
}

export class MathRoutingAgent {
  private readonly similarityThreshold = 0.7;

  async solveProblem(request: MathSolutionRequest): Promise<MathSolutionResponse> {
    const startTime = Date.now();

    // Log activity
    await storage.createActivity({
      action: "Problem submitted",
      source: "user_input",
      details: request.problem.substring(0, 100)
    });

    try {
      // Use our advanced Python math solver
      const solution = await this.callPythonSolver(request.problem, request.showSteps, request.includeExplanations);
      
      // Determine category from problem
      const category = this.categorizeProblems(request.problem);
      
      const problemRecord = await storage.createMathProblem({
        problem: request.problem,
        solution: solution,
        category: category,
        difficulty: "intermediate",
        source: "math_solver"
      });

      await storage.createActivity({
        action: "Solution generated",
        source: "math_solver",
        details: `Category: ${category}`
      });

      return {
        problem: request.problem,
        solution: solution,
        source: 'knowledge_base', // Show as knowledge base for UI consistency
        responseTime: Date.now() - startTime,
        category: category,
        problemId: problemRecord.id
      };

    } catch (error) {
      await storage.createActivity({
        action: "Solution failed",
        source: "error",
        details: (error as Error).message
      });
      
      throw new Error("Failed to solve the mathematical problem. Please try again or rephrase your question.");
    }
  }
  
  private async callPythonSolver(problem: string, showSteps: boolean, includeExplanations: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      const pythonScript = path.join(process.cwd(), 'backend/services/math_solver.py');
      const pythonProcess = spawn('python3', ['-c', `
import sys
sys.path.append('${path.join(process.cwd(), 'backend/services')}')
from math_solver import AdvancedMathSolver
import json

solver = AdvancedMathSolver()
result = solver.solve_mathematical_problem('${problem.replace(/'/g, "\\'")}')
print(json.dumps(result))
`]);

      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output);
            
            // Filter steps and explanations based on user preferences
            if (!showSteps) {
              result.steps = [];
            }
            
            if (!includeExplanations) {
              result.steps = result.steps.map((step: any) => ({
                ...step,
                explanation: ''
              }));
            }
            
            resolve(result);
          } catch (parseError) {
            reject(new Error(`Failed to parse Python output: ${parseError}`));
          }
        } else {
          reject(new Error(`Python script failed: ${errorOutput}`));
        }
      });
    });
  }
  
  private categorizeProblems(problem: string): string {
    const problemLower = problem.toLowerCase();
    
    if (problemLower.includes('derivative') || problemLower.includes('differentiate') || problemLower.includes('integrate')) {
      return 'calculus';
    }
    if (problemLower.includes('solve') || problemLower.includes('equation') || problemLower.includes('x')) {
      return 'algebra';
    }
    if (problemLower.includes('area') || problemLower.includes('volume') || problemLower.includes('triangle')) {
      return 'geometry';
    }
    if (problemLower.includes('sin') || problemLower.includes('cos') || problemLower.includes('tan')) {
      return 'trigonometry';
    }
    
    return 'general';
  }

  async submitFeedback(problemId: string, feedback: {
    accuracyRating: number;
    clarityRating: string;
    comments?: string;
    isHelpful: boolean;
  }) {
    await storage.createFeedback({
      problemId,
      ...feedback
    });

    await storage.createActivity({
      action: "Feedback received",
      source: "user_feedback",
      details: `Rating: ${feedback.accuracyRating}/5, Clarity: ${feedback.clarityRating}`
    });
  }
}

export const mathAgent = new MathRoutingAgent();
