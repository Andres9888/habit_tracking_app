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
import type { MilestoneAchievement } from '../../hooks/useMilestoneDetection';

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
  | 'day_phase'
  | 'name_asc'
  | 'name_desc'
  | 'strength_asc'
  | 'strength_desc'
  | 'streak_asc'
  | 'streak_desc';

// ---------------------------------------------------------------------------
// 3. Compound types
// ---------------------------------------------------------------------------

/** Data needed to render a shareable milestone card. */
export type ShareCardData = {
  habitName: string;
  milestoneLevel: MilestoneAchievement['level'];
  strengthPercentage: number;
  userName?: string;
};

/** Payload for the streak reward toast notification. */
export interface RewardToastData {
  habitId: HabitId;
  habitName: string;
  message: string;
  streak: number;
}

export type CompletionSound = 'chime' | 'pop' | 'success';

export interface HabitSettings {
  appIcon: string;
  catTheme: boolean;
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
  showNotesStats: boolean;
  showStreaks: boolean;
  showWeekCompletionBar: boolean;
  useDyslexicFont: boolean;
  // Completion sounds (premium feature)
  completionSoundEnabled: boolean;
  completionSoundSelected: CompletionSound;
}

/** Alias kept for call-sites that update settings (same shape). */
export type HabitSettingsUpdate = HabitSettings;

/** Alias kept for call-sites that read the raw Convex document. */
export type SettingsDocument = HabitSettings;
