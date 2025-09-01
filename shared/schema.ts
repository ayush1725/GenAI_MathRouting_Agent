import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const mathProblems = pgTable("math_problems", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  problem: text("problem").notNull(),
  solution: jsonb("solution").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  source: text("source").notNull(), // "knowledge_base" or "web_search"
  createdAt: timestamp("created_at").defaultNow(),
});

export const feedbackEntries = pgTable("feedback_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  problemId: varchar("problem_id").references(() => mathProblems.id),
  accuracyRating: integer("accuracy_rating").notNull(),
  clarityRating: text("clarity_rating").notNull(),
  comments: text("comments"),
  isHelpful: boolean("is_helpful").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const systemActivity = pgTable("system_activity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  action: text("action").notNull(),
  source: text("source").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMathProblemSchema = createInsertSchema(mathProblems).omit({
  id: true,
  createdAt: true,
});

export const insertFeedbackSchema = createInsertSchema(feedbackEntries).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(systemActivity).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type MathProblem = typeof mathProblems.$inferSelect;
export type InsertMathProblem = z.infer<typeof insertMathProblemSchema>;
export type FeedbackEntry = typeof feedbackEntries.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type SystemActivity = typeof systemActivity.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
