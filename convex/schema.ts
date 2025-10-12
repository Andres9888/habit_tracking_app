import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  articles: defineTable({
    category: v.string(),
    content: v.string(),
    createdAt: v.number(),
    title: v.string(),
  }).index("by_category", ["category"]),

  habits: defineTable({
    archived: v.optional(v.boolean()),
    archivedAt: v.optional(v.number()),
    consecutiveDays: v.optional(v.number()),
    createdAt: v.number(),
    name: v.string(),
    notes: v.optional(v.string()),
    order: v.optional(v.number()),
    strength: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    totalCompletions: v.optional(v.number()),
    totalMisses: v.optional(v.number()),
    userId: v.optional(v.string()),
  }),

  tracking: defineTable({
    completed: v.boolean(),
    date: v.string(),
    habitId: v.id("habits"),
    userId: v.optional(v.string()),
  }).index("by_habit_and_date", ["habitId", "date"]),

  userSettings: defineTable({
    catTheme: v.boolean(),
    darkMode: v.boolean(),
    showCalendarView: v.boolean(),
    showConsistency: v.boolean(),
    showEmojis: v.boolean(),
    showMotivationalMessages: v.boolean(),
    showStreaks: v.boolean(),
    userId: v.optional(v.string()),
  }),
};

export default defineSchema({
  ...applicationTables,
});
