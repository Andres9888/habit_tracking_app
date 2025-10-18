import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const applicationTables = {
  articles: defineTable({
    category: v.string(),
    content: v.string(),
    createdAt: v.number(),
    title: v.string(),
  }).index('by_category', ['category']),

  habits: defineTable({
    archived: v.optional(v.boolean()),
    archivedAt: v.optional(v.number()),
    consecutiveDays: v.optional(v.number()),
    createdAt: v.number(),
    name: v.string(),
    notes: v.optional(v.string()),
    order: v.optional(v.number()),

    // Habit Strength System (Klein et al., 2011; Zhang et al., 2021)
    strength: v.optional(v.number()), // Computed habit strength (0-1)
    strengthLevel: v.optional(v.string()), // "starting", "building", "developing", "strong", "automatic"
    strengthUpdatedAt: v.optional(v.number()), // Last time strength was calculated
    habitDecayParam: v.optional(v.number()), // HDP - validated optimal: 0.15-0.2 (default: 0.175)
    habitGainParam: v.optional(v.number()), // HGP - validated optimal: 0.1-0.2 (default: 0.15)

    // Memory Accessibility System (Tobias, 2009; Zhang et al., 2021)
    accessibility: v.optional(v.number()), // Memory accessibility (0-1), starts at 1.0
    accessibilityUpdatedAt: v.optional(v.number()),
    accessibilityDecayParam: v.optional(v.number()), // ADP - how fast memory fades
    accessibilityGainBehavior: v.optional(v.number()), // AGP_beh - boost from behavior
    accessibilityGainReminder: v.optional(v.number()), // AGP_rem - boost from reminders

    // Behavior Prediction
    predictedCompletionProb: v.optional(v.number()), // Predicted probability of next completion
    lastPredictionAt: v.optional(v.number()),

    tags: v.optional(v.array(v.string())),
    totalCompletions: v.optional(v.number()),
    totalMisses: v.optional(v.number()),
    userId: v.optional(v.string()),
  }),

  tracking: defineTable({
    completed: v.boolean(),
    date: v.string(),
    habitId: v.id('habits'),
    userId: v.optional(v.string()),
  }).index('by_habit_and_date', ['habitId', 'date']),

  userSettings: defineTable({
    catTheme: v.boolean(),
    darkMode: v.boolean(),
    showCalendarView: v.boolean(),
    showCharacterScreen: v.optional(v.boolean()),
    showConsistency: v.boolean(),
    showEmojis: v.boolean(),
    showMotivationalMessages: v.boolean(),
    showNotesStats: v.optional(v.boolean()),
    showStreaks: v.boolean(),
    userId: v.optional(v.string()),
  }),

  notes: defineTable({
    body: v.string(),
    createdAt: v.number(),
    date: v.string(),
    habitId: v.optional(v.id('habits')),
    updatedAt: v.number(),
    userId: v.optional(v.string()),
  })
    .index('by_date', ['date'])
    .index('by_habit', ['habitId'])
    .index('by_user_and_date', ['userId', 'date']),
};

export default defineSchema({
  ...applicationTables,
});
