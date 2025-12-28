import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const applicationTables = {
  // Affirmations - Positive self-talk cards (Steele, 1988; Hatzigeorgiadis, 2011)
  affirmations: defineTable({
    createdAt: v.number(),
    habitId: v.id('habits'),
    text: v.string(),
    type: v.optional(
      v.union(
        v.literal('identity'), // "I am someone who..."
        v.literal('motivational'), // "I can do hard things"
        v.literal('instructional') // "Progress, not perfection"
      )
    ),
    updatedAt: v.number(),
    userId: v.optional(v.string()),
  }).index('by_habit', ['habitId']),

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

    bestStreak: v.optional(v.number()),

    // ISO date string (YYYY-MM-DD)
    consecutiveDays: v.optional(v.number()),

    createdAt: v.number(),

    // Cue - Implementation Intention (Gollwitzer, 1999: 2-3x follow-through)
    // "After I pour my morning coffee"
    cueAfterBehavior: v.optional(v.string()),
    // "Kitchen"
    cueLocation: v.optional(v.string()),
    // "7:00 AM" or "Morning"
    cueTime: v.optional(v.string()),

    // Streak Tracking System (Story 1.3)
    currentStreak: v.optional(v.number()),
    // HDP - validated optimal: 0.15-0.2 (default: 0.175)
    habitDecayParam: v.optional(v.number()),

    // HGP - validated optimal: 0.1-0.2 (default: 0.15)
    habitGainParam: v.optional(v.number()),

    // Habit Edit Screen fields
    icon: v.optional(v.string()),

    // Identity - who you are becoming (James Clear's identity-based habits)
    // "I am a healthy person" vs "I want to lose weight"
    identity: v.optional(v.string()),

    lastCompletedDate: v.optional(v.string()),

    // Last time prediction was calculated
    lastPredictionAt: v.optional(v.number()),

    name: v.string(),

    notes: v.optional(v.string()),

    // "Proud, confident, capable"
    vizFailureBody: v.optional(v.string()),

    // Dual Visualization - Andrew Huberman Protocol (Stanford, Episode #55)
    // Key insight: Visualize FAILURE when unmotivated (fear drives action 2x)
    // Loss aversion (Kahneman & Tversky, Nobel Prize): Losses hurt 2x more
    vizSuccessBody: v.optional(v.string()),

    // "Foggy, making excuses"
    vizFailureEmotion: v.optional(v.string()),

    // "Clear, focused, accomplished"
    vizSuccessEmotion: v.optional(v.string()),

    // "Regret, shame, broken promise"
    // Background color for icon
    frequency: v.optional(v.string()),

    // Motivation - user-provided reason for building this habit
    why: v.optional(v.string()),

    // "daily", "weekly", "custom"
    daysOfWeek: v.optional(v.array(v.number())),

    woopObstacle: v.optional(v.string()),

    // Emoji icon
    iconColor: v.optional(v.string()),

    woopOutcome: v.optional(v.string()),

    order: v.optional(v.number()),

    // WOOP - Wish-Outcome-Obstacle-Plan (Oettingen, 2014)
    // Mental contrasting + implementation intentions = 2x goal achievement
    woopWish: v.optional(v.string()),

    // "default", etc.
    goalDuration: v.optional(v.number()),

    // Goal value
    goalUnit: v.optional(v.string()),

    woopPlan: v.optional(v.string()),

    // "minutes", "hours", "times", etc.
    // Pause/Resume functionality
    paused: v.optional(v.boolean()),

    // "Light, energized, powerful"
    vizSuccessMind: v.optional(v.string()),

    accessibilityAtPause: v.optional(v.number()),

    pausedAt: v.optional(v.number()),

    // "Heavy, sluggish, stuck"
    vizFailureMind: v.optional(v.string()),

    // Behavior Prediction - Predicted probability of next completion
    predictedCompletionProb: v.optional(v.number()),

    // 0-6 for Sunday-Saturday
    preferredTime: v.optional(v.string()),

    // "morning", "afternoon", "evening"
    remindersEnabled: v.optional(v.boolean()),

    // "2:00 PM" format
    reminderSound: v.optional(v.string()),

    reminderTime: v.optional(v.string()),

    resumedAt: v.optional(v.number()),

    // Habit Strength System (Klein et al., 2011; Zhang et al., 2021)
    // Computed habit strength (0-1)
    strength: v.optional(v.number()),

    strengthAtPause: v.optional(v.number()),

    // "starting", "building", "developing", "strong", "automatic"
    strengthLevel: v.optional(v.string()),

    // Last time strength was calculated
    strengthUpdatedAt: v.optional(v.number()),

    tags: v.optional(v.array(v.string())),
    totalCompletions: v.optional(v.number()),
    totalMisses: v.optional(v.number()),
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

  // Quick Reflection - Post-habit completion feedback (BJ Fogg's Tiny Habits)
  // Celebration + journaling increases self-awareness and habit consistency
  // Scientific Basis: Daylio (50M+ downloads) business model validates reflection patterns
  reflections: defineTable({
    habitId: v.id('habits'),
    userId: v.optional(v.string()),
    date: v.string(), // ISO date string (YYYY-MM-DD)
    // Emoji sentiment: 😤 frustrated | 😐 neutral | 😊 happy | 🔥 fire
    emoji: v.union(
      v.literal('frustrated'),
      v.literal('neutral'),
      v.literal('happy'),
      v.literal('fire')
    ),
    note: v.optional(v.string()), // Optional text note
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_habit', ['habitId'])
    .index('by_habit_and_date', ['habitId', 'date'])
    .index('by_user_and_date', ['userId', 'date']),

  // Template Library (Phase 3 Feature)
  templates: defineTable({
    category: v.union(
      v.literal('morning_routine'),
      v.literal('health_fitness'),
      v.literal('productivity'),
      v.literal('mindfulness'),
      v.literal('andrew_huberman'),
      v.literal('learning'),
      v.literal('social'),
      v.literal('financial'),
      v.literal('creativity'),
      v.literal('sleep'),
      // New science-backed categories
      v.literal('longevity'),
      v.literal('mental_health'),
      v.literal('recovery'),
      v.literal('breathing')
    ),
    // For sorting popular templates
    createdAt: v.number(),

    description: v.string(),

    // Background color for icon
    frequency: v.string(),

    icon: v.string(),

    // Emoji icon
    iconColor: v.string(),

    name: v.string(),

    // Optional link to research
    popularityScore: v.optional(v.number()),

    // Research citation
    scientificLink: v.optional(v.string()),

    // "daily", "weekly", "custom"
    scientificReference: v.string(),

    // Tips for success - actionable advice for building this habit
    tips: v.optional(v.array(v.string())),

    // Optional YouTube video link
    youtubeLink: v.optional(v.string()),
  }).index('by_category', ['category']),

  // Track template usage analytics
  templateUsage: defineTable({
    habitId: v.optional(v.id('habits')),
    importedAt: v.number(),
    templateId: v.id('templates'),
    userId: v.optional(v.string()), // Reference to created habit
  }).index('by_template', ['templateId']),

  tracking: defineTable({
    completed: v.boolean(),
    date: v.string(),
    habitId: v.id('habits'),
    userId: v.optional(v.string()),
  }).index('by_habit_and_date', ['habitId', 'date']),

  // Users table for Clerk authentication integration
  // Note: Fields are optional for backwards compatibility with existing anonymous users
  users: defineTable({
    clerkId: v.optional(v.string()),
    createdAt: v.optional(v.number()),
    // Clerk user ID (subject from JWT)
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    lastLoginAt: v.optional(v.number()),
    name: v.optional(v.string()), // Legacy field for anonymous users
  })
    .index('by_clerk_id', ['clerkId'])
    .index('by_email', ['email']),

  userSettings: defineTable({
    // New settings from Figma design
    appIcon: v.optional(v.string()),

    catTheme: v.boolean(),

    darkMode: v.optional(
      v.union(
        v.boolean(), // Backwards compatibility
        v.literal('system'),
        v.literal('light'),
        v.literal('dark')
      )
    ),
    dayShape: v.optional(v.union(v.literal('circle'), v.literal('square'))),
    habitCompletionIcon: v.optional(
      v.union(v.literal('chain'), v.literal('checkbox'))
    ),
    habitSortMode: v.optional(
      v.union(
        v.literal('manual'),
        v.literal('day_phase'),
        v.literal('name_asc'),
        v.literal('name_desc'),
        v.literal('strength_asc'),
        v.literal('strength_desc'),
        v.literal('streak_asc'),
        v.literal('streak_desc')
      )
    ),

    hasPremium: v.optional(v.boolean()),
    highContrastMode: v.optional(v.boolean()),
    reduceMotion: v.optional(v.boolean()),

    showCalendarView: v.boolean(),

    showCharacterScreen: v.optional(v.boolean()),

    showConsistency: v.boolean(),

    showEmojis: v.boolean(),

    showMotivationalMessages: v.boolean(),

    showNotesStats: v.optional(v.boolean()),

    showStreaks: v.boolean(),

    showWeekCompletionBar: v.optional(v.boolean()),
    sortHabitsAlphabetically: v.optional(v.boolean()),
    textSize: v.optional(v.string()),
    // Backwards compatibility
    useDyslexicFont: v.optional(v.boolean()),
    userId: v.optional(v.string()),
  }),

  visionBoardItems: defineTable({
    body: v.optional(v.string()),
    createdAt: v.number(),
    habitId: v.id('habits'),
    title: v.string(),
    updatedAt: v.number(),
    userId: v.optional(v.string()),
  }).index('by_habit', ['habitId']),
};

export default defineSchema({
  ...applicationTables,
});
