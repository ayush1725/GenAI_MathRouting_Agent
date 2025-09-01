import { vectorDB } from './vectorDB';
import { webSearch } from './webSearch';
import { guardRails } from './guardrails';
import { storage } from '../storage';

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

    // Step 1: Apply guardrails
    const validation = await guardRails.validateMathematicalContent(request.problem);
    if (!validation.isValid) {
      throw new Error(validation.reason || "Invalid mathematical content");
    }

    // Log activity
    await storage.createActivity({
      action: "Problem submitted",
      source: "user_input",
      details: request.problem.substring(0, 100)
    });

    try {
      // Step 2: Search knowledge base first
      const similarProblems = await vectorDB.searchSimilarProblems(request.problem, 3);
      
      if (similarProblems.length > 0 && similarProblems[0].similarity > this.similarityThreshold) {
        // Found similar problem in knowledge base
        const bestMatch = similarProblems[0];
        
        const problemRecord = await storage.createMathProblem({
          problem: request.problem,
          solution: bestMatch.solution,
          category: bestMatch.category,
          difficulty: "intermediate",
          source: "knowledge_base"
        });

        await storage.createActivity({
          action: "Solution found",
          source: "knowledge_base",
          details: `Similarity: ${bestMatch.similarity.toFixed(2)}`
        });

        return {
          problem: request.problem,
          solution: bestMatch.solution,
          source: 'knowledge_base',
          responseTime: Date.now() - startTime,
          category: bestMatch.category,
          problemId: problemRecord.id
        };
      }

      // Step 3: Fallback to web search
      const searchResults = await webSearch.searchMathematicalContent(request.problem);
      const webSolution = await webSearch.generateSolutionFromSearch(request.problem, searchResults);

      const problemRecord = await storage.createMathProblem({
        problem: request.problem,
        solution: webSolution,
        category: "advanced",
        difficulty: "advanced",
        source: "web_search"
      });

      await storage.createActivity({
        action: "Solution found",
        source: "web_search",
        details: `Sources: ${searchResults.length} found`
      });

      return {
        problem: request.problem,
        solution: webSolution,
        source: 'web_search',
        responseTime: Date.now() - startTime,
        category: "advanced",
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
