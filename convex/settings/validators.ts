/**
 * Convex validators for settings queries and mutations
 */
import { v } from 'convex/values';

import { progressEmojisValidator } from '../lib/progressEmojisValidator';

export const settingsReturnValidator = v.object({
  appIcon: v.string(),
  catTheme: v.boolean(),
  celebrationsEnabled: v.boolean(),
  compactView: v.boolean(),
  completionSoundEnabled: v.boolean(),
  completionSoundType: v.union(
    v.literal('chime'),
    v.literal('pop'),
    v.literal('success')
  ),
  darkMode: v.union(v.literal('system'), v.literal('light'), v.literal('dark')),
  dayShape: v.union(v.literal('circle'), v.literal('square')),
  habitCompletionIcon: v.union(v.literal('chain'), v.literal('checkbox')),
  habitSortMode: v.union(
    v.literal('manual'),
    v.literal('name_asc'),
    v.literal('name_desc'),
    v.literal('strength_asc'),
    v.literal('strength_desc'),
    v.literal('streak_asc'),
    v.literal('streak_desc')
  ),
  hasPremium: v.boolean(),
  progressEmojis: v.optional(progressEmojisValidator),
  customProgressEmojis: v.optional(progressEmojisValidator),
  reduceMotion: v.boolean(),
  showCalendarView: v.boolean(),
  showCharacterScreen: v.boolean(),
  showConsistency: v.boolean(),
  showEmojis: v.boolean(),
  showGradientFill: v.boolean(),
  connectorStyle: v.union(
    v.literal('none'),
    v.literal('small'),
    v.literal('full')
  ),
  showMotivationalMessages: v.boolean(),
  showStreaks: v.boolean(),
  stickyCalendarHeader: v.boolean(),
  showWeekCompletionBar: v.boolean(),
  streakRemindersEnabled: v.boolean(),
  streakReminderTime: v.string(),
  useDyslexicFont: v.boolean(),
});

export const updateArgsValidator = {
  appIcon: v.optional(v.string()),
  catTheme: v.optional(v.boolean()),
  celebrationsEnabled: v.optional(v.boolean()),
  compactView: v.optional(v.boolean()),
  completionSoundEnabled: v.optional(v.boolean()),
  completionSoundType: v.optional(
    v.union(v.literal('chime'), v.literal('pop'), v.literal('success'))
  ),
  darkMode: v.optional(
    v.union(
      v.literal('system'),
      v.literal('light'),
      v.literal('dark'),
      v.boolean()
    )
  ),
  dayShape: v.optional(v.union(v.literal('circle'), v.literal('square'))),
  habitCompletionIcon: v.optional(
    v.union(v.literal('chain'), v.literal('checkbox'))
  ),
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
  // SEC: hasPremium is an entitlement field — writable ONLY by the RevenueCat
  // webhook (subscriptions.grantPremium/revokePremium). It is intentionally
  // absent here so the public settings.update mutation cannot mass-assign it.
  // Do NOT re-add it. It remains in settingsReturnValidator (read shape) and
  // in schema.ts (storage).
  progressEmojis: v.optional(progressEmojisValidator),
  customProgressEmojis: v.optional(progressEmojisValidator),
  reduceMotion: v.optional(v.boolean()),
  showCalendarView: v.optional(v.boolean()),
  showCharacterScreen: v.optional(v.boolean()),
  showConsistency: v.optional(v.boolean()),
  showEmojis: v.optional(v.boolean()),
  showGradientFill: v.optional(v.boolean()),
  connectorStyle: v.optional(
    v.union(v.literal('none'), v.literal('small'), v.literal('full'))
  ),
  showMotivationalMessages: v.optional(v.boolean()),
  showStreaks: v.optional(v.boolean()),
  stickyCalendarHeader: v.optional(v.boolean()),
  showWeekCompletionBar: v.optional(v.boolean()),
  streakRemindersEnabled: v.optional(v.boolean()),
  streakReminderTime: v.optional(v.string()),
  useDyslexicFont: v.optional(v.boolean()),
};
