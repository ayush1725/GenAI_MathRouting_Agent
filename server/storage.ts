import { type User, type InsertUser, type MathProblem, type InsertMathProblem, type FeedbackEntry, type InsertFeedback, type SystemActivity, type InsertActivity } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Math problem operations
  getMathProblem(id: string): Promise<MathProblem | undefined>;
  getMathProblemsByCategory(category: string): Promise<MathProblem[]>;
  searchMathProblems(query: string): Promise<MathProblem[]>;
  createMathProblem(problem: InsertMathProblem): Promise<MathProblem>;
  
  // Feedback operations
  createFeedback(feedback: InsertFeedback): Promise<FeedbackEntry>;
  getFeedbackByProblemId(problemId: string): Promise<FeedbackEntry[]>;
  
  // Activity operations
  createActivity(activity: InsertActivity): Promise<SystemActivity>;
  getRecentActivity(limit?: number): Promise<SystemActivity[]>;
  
  // Statistics
  getKnowledgeBaseStats(): Promise<{
    total: number;
    calculus: number;
    algebra: number;
    geometry: number;
    statistics: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private mathProblems: Map<string, MathProblem>;
  private feedbackEntries: Map<string, FeedbackEntry>;
  private systemActivities: Map<string, SystemActivity>;

  constructor() {
    this.users = new Map();
    this.mathProblems = new Map();
    this.feedbackEntries = new Map();
    this.systemActivities = new Map();
    
    // Initialize with sample math problems
    this.initializeSampleProblems();
  }

  private initializeSampleProblems() {
    const sampleProblems = [
      {
        id: randomUUID(),
        problem: "Solve the quadratic equation x² + 5x + 6 = 0",
        solution: {
          steps: [
            {
              step: 1,
              title: "Factor the quadratic expression",
              content: "x² + 5x + 6 = (x + 2)(x + 3)",
              explanation: "Find two numbers that multiply to 6 and add to 5: 2 and 3"
            },
            {
              step: 2,
              title: "Set each factor equal to zero",
              content: "x + 2 = 0  or  x + 3 = 0",
              explanation: "Use the zero product property"
            },
            {
              step: 3,
              title: "Solve for x",
              content: "x = -2  or  x = -3",
              explanation: "These are the roots of the quadratic equation"
            }
          ],
          finalAnswer: "x = -2 or x = -3"
        },
        category: "algebra",
        difficulty: "intermediate",
        source: "knowledge_base",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        problem: "Find the derivative of f(x) = 3x³ + 2x² - 5x + 1",
        solution: {
          steps: [
            {
              step: 1,
              title: "Identify the function and apply the power rule",
              content: "f(x) = 3x³ + 2x² - 5x + 1",
              explanation: "We'll differentiate each term separately using the power rule: d/dx[xⁿ] = n·xⁿ⁻¹"
            },
            {
              step: 2,
              title: "Differentiate each term",
              content: "d/dx[3x³] = 9x²\nd/dx[2x²] = 4x\nd/dx[-5x] = -5\nd/dx[1] = 0",
              explanation: "Apply the power rule to each term"
            },
            {
              step: 3,
              title: "Combine the results",
              content: "f'(x) = 9x² + 4x - 5",
              explanation: "Sum all the derivatives"
            }
          ],
          finalAnswer: "f'(x) = 9x² + 4x - 5"
        },
        category: "calculus",
        difficulty: "intermediate",
        source: "knowledge_base",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        problem: "Calculate the area of a triangle with sides 3, 4, and 5",
        solution: {
          steps: [
            {
              step: 1,
              title: "Identify triangle type",
              content: "3² + 4² = 9 + 16 = 25 = 5²",
              explanation: "This is a right triangle (Pythagorean theorem satisfied)"
            },
            {
              step: 2,
              title: "Apply area formula",
              content: "Area = ½ × base × height = ½ × 3 × 4 = 6",
              explanation: "For a right triangle, use the two perpendicular sides as base and height"
            }
          ],
          finalAnswer: "Area = 6 square units"
        },
        category: "geometry",
        difficulty: "basic",
        source: "knowledge_base",
        createdAt: new Date()
      }
    ];

    sampleProblems.forEach(problem => {
      this.mathProblems.set(problem.id, problem as MathProblem);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getMathProblem(id: string): Promise<MathProblem | undefined> {
    return this.mathProblems.get(id);
  }

  async getMathProblemsByCategory(category: string): Promise<MathProblem[]> {
    return Array.from(this.mathProblems.values()).filter(
      problem => problem.category === category
    );
  }

  async searchMathProblems(query: string): Promise<MathProblem[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.mathProblems.values()).filter(
      problem => problem.problem.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createMathProblem(insertProblem: InsertMathProblem): Promise<MathProblem> {
    const id = randomUUID();
    const problem: MathProblem = { 
      ...insertProblem, 
      id,
      createdAt: new Date()
    };
    this.mathProblems.set(id, problem);
    return problem;
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<FeedbackEntry> {
    const id = randomUUID();
    const feedback: FeedbackEntry = { 
      ...insertFeedback, 
      id,
      createdAt: new Date(),
      problemId: insertFeedback.problemId || null,
      comments: insertFeedback.comments || null
    };
    this.feedbackEntries.set(id, feedback);
    return feedback;
  }

  async getFeedbackByProblemId(problemId: string): Promise<FeedbackEntry[]> {
    return Array.from(this.feedbackEntries.values()).filter(
      feedback => feedback.problemId === problemId
    );
  }

  async createActivity(insertActivity: InsertActivity): Promise<SystemActivity> {
    const id = randomUUID();
    const activity: SystemActivity = { 
      ...insertActivity, 
      id,
      createdAt: new Date(),
      details: insertActivity.details || null
    };
    this.systemActivities.set(id, activity);
    return activity;
  }

  async getRecentActivity(limit: number = 10): Promise<SystemActivity[]> {
    const activities = Array.from(this.systemActivities.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
    return activities.slice(0, limit);
  }

  async getKnowledgeBaseStats(): Promise<{
    total: number;
    calculus: number;
    algebra: number;
    geometry: number;
    statistics: number;
  }> {
    const problems = Array.from(this.mathProblems.values());
    return {
      total: problems.length,
      calculus: problems.filter(p => p.category === 'calculus').length,
      algebra: problems.filter(p => p.category === 'algebra').length,
      geometry: problems.filter(p => p.category === 'geometry').length,
      statistics: problems.filter(p => p.category === 'statistics').length,
    };
  }
}

export const storage = new MemStorage();
