import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  habits: defineTable({
    userId: v.id("users"),
    name: v.string(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    order: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  }).index("by_user", ["userId"]).index("by_user_and_name", ["userId", "name"]),

  tracking: defineTable({
    habitId: v.id("habits"),
    userId: v.id("users"),
    date: v.string(),
    completed: v.boolean(),
  }).index("by_habit_and_date", ["habitId", "date"])
    .index("by_user_and_date", ["userId", "date"]),

  userSettings: defineTable({
    userId: v.id("users"),
    showStreaks: v.boolean(),
    showConsistency: v.boolean(),
    showMotivationalMessages: v.boolean(),
    showEmojis: v.boolean(),
    showCalendarView: v.boolean(),
    catTheme: v.boolean(),
    darkMode: v.boolean(),
  }).index("by_user", ["userId"]),

  articles: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.string(),
    createdAt: v.number(),
  }).index("by_category", ["category"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
