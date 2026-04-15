/**
 * Habit domain types shared across the habits feature.
 *
 * Organised into three sections:
 *   1. Core entities — Habit, HabitId, tracking entries
 *   2. Enums / unions — status codes, sort modes
 *   3. Compound types — settings, share cards, reward toasts
 */

import type { Doc, Id } from '../../../convex/_generated/dataModel';
import type { CompletionSoundType } from '../../../convex/settings/types';

// ---------------------------------------------------------------------------
// 1. Core entities
// ---------------------------------------------------------------------------

/** A single habit document from the Convex `habits` table. */
export type Habit = Doc<'habits'>;

/** Typed Convex ID for a habit. */
export type HabitId = Id<'habits'>;

/** A single tracking entry (date × habit completion). */
export type HabitTrackingEntry = Doc<'tracking'>;

// ---------------------------------------------------------------------------
// 2. Enums / unions
// ---------------------------------------------------------------------------

/** Visual status of a habit for a given day cell. */
export type HabitStatus = 'done' | 'missed' | 'planned';

/** Available sort orders for the habit list. */
export type HabitSortMode =
  | 'manual'
  | 'name_asc'
  | 'name_desc'
  | 'strength_asc'
  | 'strength_desc'
  | 'streak_asc'
  | 'streak_desc';

// ---------------------------------------------------------------------------
// 3. Compound types
// ---------------------------------------------------------------------------

/** Payload for the streak reward toast notification. */
export interface RewardToastData {
  habitId: HabitId;
  habitName: string;
  message: string;
  streak: number;
}

/** Full user-facing settings document (mirrors Convex `settings` table). */
export interface HabitSettings {
  appIcon: string;
  catTheme: boolean;
  compactView: boolean;
  completionSoundEnabled: boolean;
  completionSoundType: CompletionSoundType;
  darkMode: 'system' | 'light' | 'dark';
  dayShape: 'circle' | 'square';
  habitCompletionIcon: 'chain' | 'checkbox';
  habitSortMode: HabitSortMode;
  hasPremium: boolean;
  highContrastMode: boolean;
  reduceMotion: boolean;
  showCalendarView: boolean;
  showCharacterScreen: boolean;
  showConsistency: boolean;
  showEmojis: boolean;
  showMotivationalMessages: boolean;
  showStreaks: boolean;
  stickyCalendarHeader: boolean;
  showWeekCompletionBar: boolean;
  useDyslexicFont: boolean;
}

/** Alias kept for call-sites that update settings (same shape). */
export type HabitSettingsUpdate = HabitSettings;

/** Alias kept for call-sites that read the raw Convex document. */
export type SettingsDocument = HabitSettings;
