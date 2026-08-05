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
  showStreakConnections: v.boolean(),
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
  // SECURITY: `hasPremium` is an entitlement field and is intentionally NOT
  // accepted by this client-facing mutation. It must be written ONLY by the
  // signature-verified RevenueCat webhook path (grantPremium/revokePremium ->
  // updateUserSettingsPremium). Re-adding it here would let any authenticated
  // user self-grant premium via `api.settings.update({ hasPremium: true })`.
  progressEmojis: v.optional(progressEmojisValidator),
  customProgressEmojis: v.optional(progressEmojisValidator),
  reduceMotion: v.optional(v.boolean()),
  showCalendarView: v.optional(v.boolean()),
  showCharacterScreen: v.optional(v.boolean()),
  showConsistency: v.optional(v.boolean()),
  showEmojis: v.optional(v.boolean()),
  showGradientFill: v.optional(v.boolean()),
  showStreakConnections: v.optional(v.boolean()),
  showMotivationalMessages: v.optional(v.boolean()),
  showStreaks: v.optional(v.boolean()),
  stickyCalendarHeader: v.optional(v.boolean()),
  showWeekCompletionBar: v.optional(v.boolean()),
  streakRemindersEnabled: v.optional(v.boolean()),
  streakReminderTime: v.optional(v.string()),
  useDyslexicFont: v.optional(v.boolean()),
};
