import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { mathAgent } from "./services/mathAgent";
import { insertFeedbackSchema } from "@shared/schema";
import { z } from "zod";

const solveProblemSchema = z.object({
  problem: z.string().min(1, "Problem cannot be empty"),
  showSteps: z.boolean().default(true),
  includeExplanations: z.boolean().default(true),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Solve mathematical problem
  app.post("/api/solve", async (req, res) => {
    try {
      const validatedData = solveProblemSchema.parse(req.body);
      const solution = await mathAgent.solveProblem(validatedData);
      res.json(solution);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to solve problem";
      res.status(400).json({ error: message });
    }
  });

  // Submit feedback
  app.post("/api/feedback", async (req, res) => {
    try {
      const validatedFeedback = insertFeedbackSchema.parse(req.body);
      await mathAgent.submitFeedback(req.body.problemId, {
        ...validatedFeedback,
        comments: validatedFeedback.comments || undefined
      });
      res.json({ success: true, message: "Feedback submitted successfully" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit feedback";
      res.status(400).json({ error: message });
    }
  });

  // Get system status
  app.get("/api/status", async (req, res) => {
    try {
      const stats = await storage.getKnowledgeBaseStats();
      const recentActivity = await storage.getRecentActivity(5);
      
      res.json({
        vectorDatabase: "online",
        webSearch: "ready",
        aiGuardrails: "active",
        feedbackSystem: "learning",
        knowledgeBaseStats: stats,
        recentActivity: recentActivity.map(activity => ({
          action: activity.action,
          source: activity.source,
          details: activity.details,
          timestamp: activity.createdAt
        }))
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get system status" });
    }
  });

  // Get recent activity
  app.get("/api/activity", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const activities = await storage.getRecentActivity(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to get recent activity" });
    }
  });

  // Get math problems history
  app.get("/api/history", async (req, res) => {
    try {
      const category = req.query.category as string;
      let problems;
      
      if (category && category !== 'all') {
        problems = await storage.getMathProblemsByCategory(category);
      } else {
        // Get all problems by getting each category
        const categories = ['algebra', 'calculus', 'geometry', 'statistics', 'trigonometry'];
        const allProblems = await Promise.all(
          categories.map(cat => storage.getMathProblemsByCategory(cat))
        );
        problems = allProblems.flat();
      }
      
      // Sort by creation date (newest first)
      problems.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      
      res.json(problems);
    } catch (error) {
      res.status(500).json({ error: "Failed to get math problems history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
