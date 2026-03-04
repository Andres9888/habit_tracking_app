/**
 * Convex Schema Definition
 *
 * Defines all database tables for the Chain Day habit tracking app.
 * Tables include:
 * - habits: Core habit data with tracking entries
 * - users: User profiles and preferences
 * - templates: Pre-built habit templates
 * - affirmations: Positive self-talk cards
 * - letters: Future self letters
 * - visionBoardImages: Vision board images
 * - And various supporting tables for subscriptions, analytics, etc.
 *
 * Each table includes indexes for efficient querying.
 */

import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// Subscription status type for type safety
const subscriptionStatus = v.union(
  v.literal('active'),
  v.literal('trialing'),
  v.literal('past_due'),
  v.literal('cancelled'),
  v.literal('expired'),
  v.literal('unknown')
);

// Plan type for subscription products
const planType = v.union(v.literal('monthly'), v.literal('yearly'));

const applicationTables = {
  // Affirmations - Positive self-talk cards (Steele, 1988; Hatzigeorgiadis, 2011)
  // Story T13: Affirmations with scheduled delivery (premium)
  // Scientific Basis: Repetition builds neural pathways; timed delivery optimizes habit formation
  affirmations: defineTable({
    createdAt: v.number(),
    // Days of week for weekly frequency (0=Sunday, 6=Saturday)
    // Only used when frequency='weekly'
    daysOfWeek: v.optional(v.array(v.number())),

    // Delivery frequency: daily (every day) or weekly (specific days)
    frequency: v.optional(
      v.union(
        v.literal('daily'), // Every day at scheduledTime
        v.literal('weekly') // Only on selected daysOfWeek
      )
    ),

    habitId: v.id('habits'),

    // Toggle to enable/disable scheduled delivery without losing settings
    isScheduleEnabled: v.optional(v.boolean()),

    // Timestamp of last successful delivery (for tracking/analytics)
    lastDeliveredAt: v.optional(v.number()),

    // Expo notification identifier for cancellation
    notificationId: v.optional(v.string()),

    // === Scheduled Delivery Fields (Premium Feature) ===
    // Enables daily push notifications at specific times
    // Time of day for delivery in "HH:MM" 24-hour format (e.g., "08:30")
    scheduledTime: v.optional(v.string()),

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
  })
    .index('by_habit', ['habitId'])
    .index('by_user', ['userId'])
    .index('by_schedule', ['isScheduleEnabled', 'scheduledTime']),

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

    accessibilityAtPause: v.optional(v.number()),

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

    // "daily", "weekly", "custom"
    daysOfWeek: v.optional(v.array(v.number())),

    // "Regret, shame, broken promise"
    // Background color for icon
    frequency: v.optional(v.string()),

    // "default", etc.
    goalDuration: v.optional(v.number()),

    // Goal value
    goalUnit: v.optional(v.string()),

    // HDP - validated optimal: 0.15-0.2 (default: 0.175)
    habitDecayParam: v.optional(v.number()),

    // HGP - validated optimal: 0.1-0.2 (default: 0.15)
    habitGainParam: v.optional(v.number()),

    // Habit Edit Screen fields
    icon: v.optional(v.string()),

    // Accent color used for habit card border/icon background
    color: v.optional(v.string()),

    // Emoji icon background color (legacy, retained for compatibility)
    iconColor: v.optional(v.string()),

    // Identity - who you are becoming (James Clear's identity-based habits)
    // "I am a healthy person" vs "I want to lose weight"
    identity: v.optional(v.string()),

    lastCompletedDate: v.optional(v.string()),

    // Last time prediction was calculated
    lastPredictionAt: v.optional(v.number()),

    name: v.string(),

    notes: v.optional(v.string()),

    order: v.optional(v.number()),

    // "minutes", "hours", "times", etc.
    // Pause/Resume functionality
    paused: v.optional(v.boolean()),

    pausedAt: v.optional(v.number()),

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

    // "Proud, confident, capable"
    vizFailureBody: v.optional(v.string()),

    // "Foggy, making excuses"
    vizFailureEmotion: v.optional(v.string()),

    // "Heavy, sluggish, stuck"
    vizFailureMind: v.optional(v.string()),

    // Dual Visualization - Andrew Huberman Protocol (Stanford, Episode #55)
    // Key insight: Visualize FAILURE when unmotivated (fear drives action 2x)
    // Loss aversion (Kahneman & Tversky, Nobel Prize): Losses hurt 2x more
    vizSuccessBody: v.optional(v.string()),

    // "Clear, focused, accomplished"
    vizSuccessEmotion: v.optional(v.string()),

    // "Light, energized, powerful"
    vizSuccessMind: v.optional(v.string()),

    // Motivation - user-provided reason for building this habit
    why: v.optional(v.string()),

    woopObstacle: v.optional(v.string()),

    woopOutcome: v.optional(v.string()),

    woopPlan: v.optional(v.string()),

    // WOOP - Wish-Outcome-Obstacle-Plan (Oettingen, 2014)
    // Mental contrasting + implementation intentions = 2x goal achievement
    woopWish: v.optional(v.string()),
  }).index('by_userId', ['userId']),

  // Letters to Self - Time-locked messages from past self to future self
  // Scientific Basis:
  // - Temporal self-continuity: Connecting with future self increases self-control
  // - Delayed gratification psychology (Mischel's marshmallow studies)
  // Business Model:
  // - Creates anticipation, unique feature, emotional depth
  // - Users pay for emotional experiences (Calm model)
  // - Premium feature: unlocking creates anticipation and engagement
  // Story T11: Letters to Self
  letters: defineTable({
    // Letter content - the message to your future self
    content: v.string(),

    // Timestamp when letter was written
    createdAt: v.number(),

    // Associated habit
    habitId: v.id('habits'),

    // Whether the letter has been read after unlocking
    isRead: v.boolean(),

    // Title for the letter (optional, for organization)
    title: v.optional(v.string()),

    // Timestamp when the letter becomes readable
    unlockAt: v.number(),

    // Last updated timestamp
    updatedAt: v.optional(v.number()),

    // User who wrote the letter
    userId: v.optional(v.string()),
  })
    .index('by_habit', ['habitId'])
    .index('by_user', ['userId'])
    .index('by_unlock_date', ['unlockAt'])
    .index('by_habit_and_unlock', ['habitId', 'unlockAt']),

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
    .index('by_user', ['userId'])
    .index('by_user_and_date', ['userId', 'date']),

  // Quick Reflection - Post-habit completion feedback (BJ Fogg's Tiny Habits)
  // Celebration + journaling increases self-awareness and habit consistency
  // Scientific Basis: Daylio (50M+ downloads) business model validates reflection patterns
  reflections: defineTable({
    // Optional text note
    createdAt: v.number(),

    date: v.string(),

    // ISO date string (YYYY-MM-DD)
    // Emoji sentiment: 😤 frustrated | 😐 neutral | 😊 happy | 🔥 fire
    emoji: v.union(
      v.literal('frustrated'),
      v.literal('neutral'),
      v.literal('happy'),
      v.literal('fire')
    ),

    habitId: v.id('habits'),

    note: v.optional(v.string()),
    updatedAt: v.number(),
    userId: v.optional(v.string()),
  })
    .index('by_habit', ['habitId'])
    .index('by_habit_and_date', ['habitId', 'date'])
    .index('by_user', ['userId'])
    .index('by_user_and_date', ['userId', 'date']),

  // Subscriptions - RevenueCat webhook-driven subscription state
  // SEC-002: Server-side premium validation
  // This is the source of truth for subscription status, synced via webhooks
  subscriptions: defineTable({
    cancelledAt: v.optional(v.number()),

    // User identification
    clerkId: v.string(),

    // Audit fields
    createdAt: v.number(),

    expiresAt: v.optional(v.number()),

    // Billing status
    hasBillingIssue: v.optional(v.boolean()),

    lastWebhookAt: v.optional(v.number()),

    lastWebhookEvent: v.optional(v.string()),

    // Idempotency: tracks the last processed RevenueCat event ID to prevent
    // double-processing when RevenueCat retries on 5xx responses
    lastWebhookEventId: v.optional(v.string()),

    // e.g., "premium_monthly_699"
    planType: v.optional(planType),

    // Product info
    productId: v.optional(v.string()),

    // Primary identifier - matches Clerk user ID
    revenueCatId: v.optional(v.string()),

    // Important dates (timestamps in ms)
    startedAt: v.number(),

    // RevenueCat's internal user ID
    // Subscription state
    status: subscriptionStatus,
    trialEndsAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index('by_clerk_id', ['clerkId'])
    .index('by_revenuecat_id', ['revenueCatId'])
    .index('by_status', ['status']),

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
  })
    .index('by_category', ['category'])
    .index('by_createdAt', ['createdAt']),
  // PERF: Added by_createdAt index to avoid full table scans when listing all templates

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
  })
    .index('by_habit_and_date', ['habitId', 'date'])
    .index('by_user_and_date', ['userId', 'date']),

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

    celebrationsEnabled: v.optional(v.boolean()),

    // Completion sound settings (Premium feature)
    completionSoundEnabled: v.optional(v.boolean()),
    completionSoundType: v.optional(
      v.union(v.literal('chime'), v.literal('pop'), v.literal('success'))
    ),

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

    showGradientFill: v.optional(v.boolean()),

    showMotivationalMessages: v.boolean(),

    showNotesStats: v.optional(v.boolean()),

    showStreaks: v.boolean(),

    showWeekCompletionBar: v.optional(v.boolean()),
    sortHabitsAlphabetically: v.optional(v.boolean()),
    // Streak reminder notifications
    streakRemindersEnabled: v.optional(v.boolean()),
    // "20:00" (24h format) — default 8 PM
    streakReminderTime: v.optional(v.string()),
    textSize: v.optional(v.string()),
    // Backwards compatibility
    useDyslexicFont: v.optional(v.boolean()),
    userId: v.optional(v.string()),
  }).index('by_userId', ['userId']),

  // Vision Board Images - Photo grid of motivational images (Story T12)
  // Scientific Basis:
  // - Visual motivation reinforces goals through mental imagery
  // - Personal images > stock images for emotional connection
  // - Mirror neurons activate when viewing goal-related imagery
  // Business Model:
  // - Premium feature: storage costs, personalization, high perceived value
  // - Users pay for customization (Notion model)
  visionBoardImages: defineTable({
    // Optional description of what the image represents
    caption: v.optional(v.string()),

    // Timestamp when image was added
    createdAt: v.number(),

    // Associated habit
    habitId: v.id('habits'),

    // Cached image URL for convenience (may expire)
    imageUrl: v.optional(v.string()),

    // Display order in grid (0-based, for drag-to-reorder)
    order: v.number(),

    // Convex file storage ID (use storage.getUrl to get URL)
    storageId: v.id('_storage'),

    // Last updated timestamp
    updatedAt: v.optional(v.number()),

    // User who added the image
    userId: v.optional(v.string()),
  })
    .index('by_habit', ['habitId'])
    .index('by_user', ['userId'])
    .index('by_habit_and_order', ['habitId', 'order']),

  // Legacy text-based vision board items (kept for backwards compatibility)
  visionBoardItems: defineTable({
    body: v.optional(v.string()),
    createdAt: v.number(),
    habitId: v.id('habits'),
    title: v.string(),
    updatedAt: v.number(),
    userId: v.optional(v.string()),
  }).index('by_habit', ['habitId']),

  // Voice Notes - Audio recordings of motivation, progress, and emotional states
  // Scientific Basis: Voice has 40% higher emotional recall than text (cognitive psychology)
  // Hearing your own voice from Day 1 creates powerful emotional anchor
  // Business Model: Reflectly ($2M ARR) built business on voice journaling - premium feature
  voiceNotes: defineTable({
    audioUrl: v.string(),

    // Flag for Day 1 recording (featured in Rescue Mode)
    createdAt: v.number(),

    // Convex file storage URL
    duration: v.number(),

    habitId: v.id('habits'),

    // User-provided description (e.g., "Day 1 motivation")
    isDay1: v.optional(v.boolean()),

    // Duration in seconds
    label: v.optional(v.string()),

    updatedAt: v.optional(v.number()),
    userId: v.optional(v.string()),
  })
    .index('by_habit', ['habitId'])
    .index('by_user', ['userId'])
    .index('by_habit_and_date', ['habitId', 'createdAt']),
};

export default defineSchema({
  ...applicationTables,
});
