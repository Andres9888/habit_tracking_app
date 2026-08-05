/**
 * Convex Schema Definition
 *
 * Defines all database tables for the Chain Day habit tracking app.
 * Tables include:
 * - habits: Core habit data with tracking entries
 * - users: User profiles and preferences
 * - templates: Pre-built habit templates
 * - And various supporting tables for subscriptions, analytics, etc.
 *
 * Each table includes indexes for efficient querying.
 */

import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

import { progressEmojisValidator } from './lib/progressEmojisValidator';
import { templateCategoryValidator } from './templateCategories';

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

    // Free-text "benefits" list captured during habit setup (legacy field, still in DB)
    benefits: v.optional(v.array(v.string())),

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

    // User-estimated effort for one completion, in minutes.
    effortMinutes: v.optional(v.number()),

    // "default", etc.
    goalDuration: v.optional(v.number()),

    // Goal value
    goalUnit: v.optional(v.string()),

    // Template difficulty estimate copied from imported templates.
    growthType: v.optional(
      v.union(v.literal('simple'), v.literal('average'), v.literal('complex'))
    ),

    // Legacy fields retained on older docs; not written by current code
    dailyMinutesGoal: v.optional(v.number()),
    weeklyMinutesGoal: v.optional(v.number()),

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

    pendingStrengthRecalcId: v.optional(v.id('_scheduled_functions')),

    pendingStrengthRecalcRequestedAt: v.optional(v.number()),

    // Behavior Prediction - Predicted probability of next completion
    predictedCompletionProb: v.optional(v.number()),

    // 0-6 for Sunday-Saturday
    preferredTime: v.optional(v.string()),

    // Per-habit override of the 5-stage growth emoji set.
    // Falls back to userSettings.progressEmojis, then built-in defaults.
    progressEmojis: v.optional(progressEmojisValidator),

    // "morning", "afternoon", "evening"
    remindersEnabled: v.optional(v.boolean()),

    // "2:00 PM" format
    reminderSound: v.optional(v.string()),

    reminderTime: v.optional(v.string()),

    resumedAt: v.optional(v.number()),

    // Free-text science note captured during habit setup (legacy field, still in DB)
    scienceNote: v.optional(v.string()),

    // Habit Strength System (Klein et al., 2011; Zhang et al., 2021)
    // Computed habit strength (0-1)
    strength: v.optional(v.number()),

    strengthAtPause: v.optional(v.number()),

    // "forgiving", "balanced", "strict" — per-habit override (falls back to user setting)
    strengthAlgorithm: v.optional(
      v.union(
        v.literal('forgiving'),
        v.literal('balanced'),
        v.literal('strict')
      )
    ),

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
  })
    .index('by_strengthUpdatedAt', ['strengthUpdatedAt'])
    .index('by_userId', ['userId']),

  deletedHabits: defineTable({
    createdAt: v.number(),
    expiresAt: v.number(),
    payload: v.string(),
    userId: v.string(),
  })
    .index('by_expiresAt', ['expiresAt'])
    .index('by_userId', ['userId']),

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
    lastWebhookEventTimestamp: v.optional(v.number()),

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
    category: templateCategoryValidator,
    // For sorting popular templates
    createdAt: v.number(),

    description: v.string(),

    // Legacy educational benefits list present on existing template rows.
    benefits: v.optional(v.array(v.string())),

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

    // Best-guess time to do this habit, in minutes. Used to derive the
    // suggested strength algorithm at habit-creation time.
    estimatedMinutes: v.optional(v.number()),

    // Growth type — how hard / long the habit is to build.
    // Maps to a "days to automate" estimate (Lally et al. 2010, median 66 days, range 18-254).
    growthType: v.optional(
      v.union(v.literal('simple'), v.literal('average'), v.literal('complex'))
    ),

    // Suggested psychology fields for post-import setup
    suggestedCue: v.optional(v.string()),
    suggestedIdentity: v.optional(v.string()),
    suggestedWhy: v.optional(v.string()),

    // Tips for success - actionable advice for building this habit
    tips: v.optional(v.array(v.string())),

    // Tiny "start small" version of the habit (BJ Fogg / Atomic Habits floor) —
    // shown inline in template preview as the laughably-easy entry version.
    startSmallVersion: v.optional(v.string()),

    // Optional YouTube video link
    youtubeLink: v.optional(v.string()),

    // ── Science drill-down (pre-add detail) — all optional, graceful fallback ──
    // Short one-line hero subtitle shown under the name.
    tagline: v.optional(v.string()),
    // Literata "why it works" lead paragraph (richer than description).
    lead: v.optional(v.string()),
    // One cited statistic sentence backing the lead.
    evidence: v.optional(v.string()),
    // Suggested cadence label, e.g. "Daily · 5 min · after dinner".
    cadenceLabel: v.optional(v.string()),
    // "What you'll feel" — concrete benefits with an icon key + copy.
    benefitDetails: v.optional(
      v.array(
        v.object({
          icon: v.string(),
          title: v.string(),
          description: v.string(),
        })
      )
    ),
    // "What to expect" — progression timeline; peak marks the automaticity node.
    timeline: v.optional(
      v.array(
        v.object({
          when: v.string(),
          title: v.string(),
          description: v.string(),
          peak: v.optional(v.boolean()),
        })
      )
    ),
    // "How to start" — ordered concrete steps (distinct from generic tips).
    howToStart: v.optional(v.array(v.string())),
    // "The research" — multiple cited sources.
    sources: v.optional(
      v.array(
        v.object({
          authors: v.string(),
          title: v.string(),
          journal: v.string(),
          year: v.string(),
          link: v.optional(v.string()),
        })
      )
    ),
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
  })
    .index('by_template', ['templateId'])
    .index('by_habit', ['habitId'])
    .index('by_user', ['userId'])
    .index('by_user_template', ['userId', 'templateId']),

  tracking: defineTable({
    completed: v.boolean(),
    date: v.string(),
    habitId: v.id('habits'),
    // Legacy minutes completion value from removed minutes-goal feature.
    minutes: v.optional(v.number()),
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
    profileImageStorageId: v.optional(v.id('_storage')),
    isAnonymous: v.optional(v.boolean()),
    lastLoginAt: v.optional(v.number()),
    name: v.optional(v.string()), // Legacy field for anonymous users
  })
    .index('by_clerk_id', ['clerkId'])
    .index('by_email', ['email']),

  // Server-side ownership records for uploaded blobs. Convex storage IDs are
  // not inherently user-scoped, so every app-managed upload must be claimed
  // before it can be attached to a user profile.
  storageOwnership: defineTable({
    createdAt: v.number(),
    storageId: v.id('_storage'),
    userId: v.string(),
  })
    .index('by_storage_id', ['storageId'])
    .index('by_user_id', ['userId']),

  userSettings: defineTable({
    // New settings from Figma design
    appIcon: v.optional(v.string()),

    catTheme: v.boolean(),

    celebrationsEnabled: v.optional(v.boolean()),
    chevronMode: v.optional(v.string()),
    compactView: v.optional(v.boolean()),

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
    // Legacy grouping preference still present in DB (e.g. "time_of_day")
    habitGroupBy: v.optional(v.string()),
    habitSortMode: v.optional(
      v.union(
        v.literal('manual'),
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
    // Global default for the 5-stage growth emoji set, overridable per habit.
    progressEmojis: v.optional(progressEmojisValidator),
    // User's saved "Custom" preset — auto-stored when slots are edited in
    // Settings, so tapping the Custom chip later restores this exact set.
    customProgressEmojis: v.optional(progressEmojisValidator),
    reduceMotion: v.optional(v.boolean()),

    showCalendarView: v.boolean(),

    showCharacterScreen: v.optional(v.boolean()),

    showConsistency: v.boolean(),

    showEmojis: v.boolean(),

    showGradientFill: v.optional(v.boolean()),

    // Draw connecting "chain ribbon" between consecutive completed calendar
    // days. Retained field, no longer read/written by app code — superseded
    // by connectorStyle below.
    showStreakConnections: v.optional(v.boolean()),

    // Replaces showStreakConnections: none/small/full connector between
    // consecutive completed calendar cells (month grid + year strip).
    connectorStyle: v.optional(
      v.union(v.literal('none'), v.literal('small'), v.literal('full'))
    ),

    showMotivationalMessages: v.boolean(),

    // Retained for backwards compatibility with existing user data
    showNotesStats: v.optional(v.boolean()),

    stickyCalendarHeader: v.optional(v.boolean()),

    showStreaks: v.boolean(),

    showWeekCompletionBar: v.optional(v.boolean()),
    sortHabitsAlphabetically: v.optional(v.boolean()),
    // Retained for backwards compatibility with existing user data — global
    // strength algorithm setting was removed; per-habit setting lives on `habits`.
    strengthAlgorithm: v.optional(
      v.union(
        v.literal('forgiving'),
        v.literal('balanced'),
        v.literal('strict')
      )
    ),
    // Streak reminder notifications
    streakRemindersEnabled: v.optional(v.boolean()),
    // "20:00" (24h format) — default 8 PM
    streakReminderTime: v.optional(v.string()),
    textSize: v.optional(v.string()),
    // Backwards compatibility
    useDyslexicFont: v.optional(v.boolean()),
    userId: v.optional(v.string()),
  }).index('by_userId', ['userId']),

  // SR-2026-04-17-09: per-user sliding-window rate limiter. One row
  // per (userId, action) pair; the row is reset when the window
  // elapses. See convex/lib/rateLimit.ts for the enforcement logic.
  rateLimits: defineTable({
    action: v.string(),
    count: v.number(),
    userId: v.string(),
    windowStartMs: v.number(),
  }).index('by_user_and_action', ['userId', 'action']),
};

export default defineSchema({
  ...applicationTables,
});
