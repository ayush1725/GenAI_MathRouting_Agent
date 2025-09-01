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
      await mathAgent.submitFeedback(req.body.problemId, validatedFeedback);
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

  const httpServer = createServer(app);
  return httpServer;
}
