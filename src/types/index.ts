/**
 * Central Types Index
 *
 * This file provides a single import point for commonly used types across the application.
 * Component-specific types remain with their components for co-location benefits.
 */

// Re-export domain types from features
export type {
  Habit,
  HabitId,
  HabitTrackingEntry,
  HabitStatus,
  HabitSortMode,
  ShareCardData,
  RewardToastData,
  HabitSettings,
  HabitSettingsUpdate,
  SettingsDocument,
} from '../features/habits/types';

// Re-export Convex types for convenience
export type { Doc, Id } from '../../convex/_generated/dataModel';
