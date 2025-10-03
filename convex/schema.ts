import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  habits: defineTable({
    name: v.string(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    order: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    userId: v.optional(v.string()),
    archived: v.optional(v.boolean()),
    archivedAt: v.optional(v.number()),
    consecutiveDays: v.optional(v.number()),
    strength: v.optional(v.number()),
    totalCompletions: v.optional(v.number()),
    totalMisses: v.optional(v.number()),
  }),

  tracking: defineTable({
    habitId: v.id("habits"),
    date: v.string(),
    completed: v.boolean(),
    userId: v.optional(v.string()),
  }).index("by_habit_and_date", ["habitId", "date"]),

  userSettings: defineTable({
    showStreaks: v.boolean(),
    showConsistency: v.boolean(),
    showMotivationalMessages: v.boolean(),
    showEmojis: v.boolean(),
    showCalendarView: v.boolean(),
    catTheme: v.boolean(),
    darkMode: v.boolean(),
    userId: v.optional(v.string()),
  }),

  articles: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.string(),
    createdAt: v.number(),
  }).index("by_category", ["category"]),
};

export default defineSchema({
  ...applicationTables,
});
