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
    // Memory Accessibility System (Tobias, 2009; Zhang et al., 2021)
    // Memory accessibility (0-1), starts at 1.0
    accessibility: v.optional(v.number()),
    // ADP - how fast memory fades
    accessibilityDecayParam: v.optional(v.number()),
    // AGP_beh - boost from behavior
    accessibilityGainBehavior: v.optional(v.number()),
    // AGP_rem - boost from reminders
    accessibilityGainReminder: v.optional(v.number()),
    // Last time accessibility was updated
    accessibilityUpdatedAt: v.optional(v.number()),
    archived: v.optional(v.boolean()),
    archivedAt: v.optional(v.number()),
    // Streak Tracking System (Story 1.3)
    currentStreak: v.optional(v.number()),
    bestStreak: v.optional(v.number()),
    lastCompletedDate: v.optional(v.string()), // ISO date string (YYYY-MM-DD)
    consecutiveDays: v.optional(v.number()),
    createdAt: v.number(),
    // HDP - validated optimal: 0.15-0.2 (default: 0.175)
    habitDecayParam: v.optional(v.number()),
    // HGP - validated optimal: 0.1-0.2 (default: 0.15)
    habitGainParam: v.optional(v.number()),
    // Last time prediction was calculated
    lastPredictionAt: v.optional(v.number()),
    name: v.string(),
    notes: v.optional(v.string()),
    order: v.optional(v.number()),
    // Behavior Prediction - Predicted probability of next completion
    predictedCompletionProb: v.optional(v.number()),
    // Habit Strength System (Klein et al., 2011; Zhang et al., 2021)
    // Computed habit strength (0-1)
    strength: v.optional(v.number()),
    // "starting", "building", "developing", "strong", "automatic"
    strengthLevel: v.optional(v.string()),
    // Last time strength was calculated
    strengthUpdatedAt: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    totalCompletions: v.optional(v.number()),
    totalMisses: v.optional(v.number()),
    userId: v.optional(v.string()),
    // Habit Edit Screen fields
    icon: v.optional(v.string()), // Emoji icon
    iconColor: v.optional(v.string()), // Background color for icon
    frequency: v.optional(v.string()), // "daily", "weekly", "custom"
    daysOfWeek: v.optional(v.array(v.number())), // 0-6 for Sunday-Saturday
    preferredTime: v.optional(v.string()), // "morning", "afternoon", "evening"
    remindersEnabled: v.optional(v.boolean()),
    reminderTime: v.optional(v.string()), // "2:00 PM" format
    reminderSound: v.optional(v.string()), // "default", etc.
    goalDuration: v.optional(v.number()), // Goal value
    goalUnit: v.optional(v.string()), // "minutes", "hours", "times", etc.
    // Pause/Resume functionality
    paused: v.optional(v.boolean()),
    pausedAt: v.optional(v.number()),
    resumedAt: v.optional(v.number()),
    strengthAtPause: v.optional(v.number()),
    accessibilityAtPause: v.optional(v.number()),
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

  tracking: defineTable({
    completed: v.boolean(),
    date: v.string(),
    habitId: v.id('habits'),
    userId: v.optional(v.string()),
  }).index('by_habit_and_date', ['habitId', 'date']),

  userSettings: defineTable({
    catTheme: v.boolean(),
    darkMode: v.optional(
      v.union(
        v.boolean(), // Backwards compatibility
        v.literal('system'),
        v.literal('light'),
        v.literal('dark'),
      ),
    ),
    showCalendarView: v.boolean(),
    showCharacterScreen: v.optional(v.boolean()),
    showConsistency: v.boolean(),
    showEmojis: v.boolean(),
    showMotivationalMessages: v.boolean(),
    showNotesStats: v.optional(v.boolean()),
    showStreaks: v.boolean(),
    userId: v.optional(v.string()),
    // New settings from Figma design
    appIcon: v.optional(v.string()),
    highContrastMode: v.optional(v.boolean()),
    reduceMotion: v.optional(v.boolean()),
    textSize: v.optional(v.string()), // Backwards compatibility
    useDyslexicFont: v.optional(v.boolean()),
  }),

  // Template Library (Phase 3 Feature)
  templates: defineTable({
    name: v.string(),
    description: v.string(),
    category: v.union(
      v.literal('morning_routine'),
      v.literal('health_fitness'),
      v.literal('productivity'),
      v.literal('mindfulness'),
    ),
    icon: v.string(), // Emoji icon
    iconColor: v.string(), // Background color for icon
    frequency: v.string(), // "daily", "weekly", "custom"
    scientificReference: v.string(), // Research citation
    scientificLink: v.optional(v.string()), // Optional link to research
    popularityScore: v.optional(v.number()), // For sorting popular templates
    createdAt: v.number(),
  }).index('by_category', ['category']),

  // Track template usage analytics
  templateUsage: defineTable({
    templateId: v.id('templates'),
    userId: v.optional(v.string()),
    importedAt: v.number(),
    habitId: v.optional(v.id('habits')), // Reference to created habit
  }).index('by_template', ['templateId']),
};

export default defineSchema({
  ...applicationTables,
});
