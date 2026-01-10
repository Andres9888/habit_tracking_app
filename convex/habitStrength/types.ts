/**
 * Habit Strength Types
 * Type definitions for strength calculations
 */

/**
 * Strength levels based on psychological research
 * - Starting (0.0-0.3): Initial phase, high intervention needed
 * - Building (0.3-0.6): Early formation, frequent reminders helpful
 * - Strong (0.6-0.85): Well-established, minimal support needed
 * - Automatic (0.85-1.0): Fully habitual, automatic execution
 */
export type StrengthLevel =
  | 'starting'
  | 'building'
  | 'developing'
  | 'strong'
  | 'automatic';

export interface HabitTrackingRecord {
  date: string;
  completed: boolean;
}

export interface HabitStrengthSnapshot {
  strength: number;
  strengthLevel: StrengthLevel;
  baseline: number;
  compliance: number;
  complianceSuccesses: number;
  complianceDaysConsidered: number;
  daysSinceCreation: number;
  lastEvaluatedDate: Date;
}

export interface StrengthLevelInfo {
  level: StrengthLevel;
  emoji: string;
  label: string;
  description: string;
  color: string;
}

export const STRENGTH_LEVELS: Record<StrengthLevel, StrengthLevelInfo> = {
  automatic: {
    color: '#15803d',
    description: 'Fully automatic - amazing!',
    emoji: '⚡',
    label: 'Automatic',
    level: 'automatic',
  },
  building: {
    color: '#4ade80',
    description: 'Making progress - keep it up!',
    emoji: '🌿',
    label: 'Building',
    level: 'building',
  },
  developing: {
    color: '#22c55e',
    description: 'Getting stronger each day!',
    emoji: '🌳',
    label: 'Developing',
    level: 'developing',
  },
  starting: {
    color: '#86efac',
    description: 'Just beginning - stay focused!',
    emoji: '🌱',
    label: 'Starting Out',
    level: 'starting',
  },
  strong: {
    color: '#22c55e',
    description: 'Habit is well-established!',
    emoji: '💪',
    label: 'Strong',
    level: 'strong',
  },
};
