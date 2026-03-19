/**
 * HabitsEmptyStateMinimal - Constants
 *
 * Ultra-minimal empty state design focused on a single question flow.
 * Reference: docs/specs/empty-habit-screen/minimal-redesign.md
 */

import { colors } from '../../../../theme/colors';
import type { SuggestionChip } from './types';

/**
 * 6 universal habits that work at any time of day.
 * Each chip includes emoji, short label, and full habit name for creation.
 */
export const SUGGESTION_CHIPS: SuggestionChip[] = [
  { emoji: '💧', fullName: 'Drink water', label: 'Water' },
  { emoji: '🚶', fullName: 'Walk 5 minutes', label: 'Walk' },
  { emoji: '📝', fullName: 'Write one line', label: 'Write' },
  { emoji: '🧘', fullName: 'Breathe for 2 minutes', label: 'Breathe' },
  { emoji: '📚', fullName: 'Read 5 pages', label: 'Read' },
  { emoji: '🤸', fullName: 'Stretch for 5 minutes', label: 'Stretch' },
];

/**
 * Morning chip suggestions (5am - 11am)
 * Focus: Energy-building and day-starting habits
 */
export const MORNING_CHIPS: SuggestionChip[] = [
  { emoji: '☕', fullName: 'Morning coffee', label: 'Coffee' },
  { emoji: '🏃', fullName: 'Morning run', label: 'Run' },
  { emoji: '🧘', fullName: 'Morning meditation', label: 'Meditate' },
  { emoji: '📝', fullName: 'Journal 5 minutes', label: 'Journal' },
  { emoji: '💧', fullName: 'Drink water', label: 'Water' },
  { emoji: '📚', fullName: 'Read 5 pages', label: 'Read' },
];

/**
 * Afternoon chip suggestions (11am - 5pm)
 * Focus: Energy maintenance and productivity breaks
 */
export const AFTERNOON_CHIPS: SuggestionChip[] = [
  { emoji: '💧', fullName: 'Drink water', label: 'Water' },
  { emoji: '🚶', fullName: 'Walk 10 minutes', label: 'Walk' },
  { emoji: '🥗', fullName: 'Healthy lunch', label: 'Lunch' },
  { emoji: '🧘', fullName: 'Breathe for 2 minutes', label: 'Breathe' },
  { emoji: '👀', fullName: 'Eye rest break', label: 'Eye rest' },
  { emoji: '🧠', fullName: 'Learn something new', label: 'Learn' },
];

/**
 * Evening chip suggestions (5pm - 10pm)
 * Focus: Unwinding and reflection
 */
export const EVENING_CHIPS: SuggestionChip[] = [
  { emoji: '📚', fullName: 'Read 10 pages', label: 'Read' },
  { emoji: '🌙', fullName: 'Wind down routine', label: 'Wind down' },
  { emoji: '🧘', fullName: 'Evening stretch', label: 'Stretch' },
  { emoji: '📝', fullName: 'Write one line', label: 'Write' },
  { emoji: '🎨', fullName: 'Creative time', label: 'Create' },
  { emoji: '🤸', fullName: 'Light exercise', label: 'Move' },
];

/**
 * Night chip suggestions (10pm - 5am)
 * Focus: Sleep preparation and completion
 */
export const NIGHT_CHIPS: SuggestionChip[] = [
  { emoji: '📝', fullName: 'Journal', label: 'Journal' },
  { emoji: '🌙', fullName: 'Sleep routine', label: 'Sleep prep' },
  { emoji: '📱', fullName: 'Phone off', label: 'Phone off' },
  { emoji: '🧘', fullName: 'Breathe for 5 minutes', label: 'Breathe' },
  { emoji: '📖', fullName: 'Gratitude practice', label: 'Gratitude' },
  { emoji: '🛌', fullName: 'Bedtime prep', label: 'Bedtime' },
];

/**
 * Legacy static chips (fallback)
 * Kept for backward compatibility and testing
 */
export const STATIC_CHIPS: SuggestionChip[] = SUGGESTION_CHIPS;

/**
 * Copy strings for the minimal empty state
 */
export const COPY = {
  addAnother: 'Add another habit',

  // Secondary links
  browseTemplates: 'Browse templates',

  // Templates bridge CTA
  browseTemplatesCard: 'Not sure where to start? Browse 50+ habit templates →',

  createCustom: 'Create custom habit',

  // Primary CTA
  ctaButton: 'Start Building →',

  // Dynamic CTA when chip/input is filled
  ctaButtonDynamic: (habitName: string) => `Add "${habitName}" →`,

  // Question headline - line break after "thing" for rhythm
  headline: "What's one small thing\nyou want to do daily?",

  // Input placeholder - motivating and descriptive
  inputPlaceholder: 'What habit do you want to build?',

  // Success state
  successHeadline: "You're growing!",
  successSubtext: (habitName: string) =>
    `"${habitName}" added — your chain starts now!`,
} as const;

/**
 * Design system color tokens aligned with app patterns.
 * References `colors` from `@/theme/colors` wherever a match exists.
 */
export const COLORS = {
  // Character counter warning/error colors
  amber500: colors.warning,

  // Input focus color (per app pattern)
  blue500: colors.secondary[500],

  emerald100: colors.primary[100],

  // Primary action color (used for indicators/accents)
  emerald500: colors.primary[500],

  // WCAG AA compliant primary action (5.21:1 contrast with white)
  emerald700: colors.primary[700],

  // Caret color
  emeraldCaret: colors.primary[500],

  green50: '#F0FDF4', // No exact match in design system

  // Character counter error color
  red500: colors.error,

  stone200: colors.gray[200],

  stone300: colors.gray[300],

  stone400: colors.gray[400],

  stone500: colors.gray[500],

  stone600: colors.gray[600],

  stone700: colors.gray[700],

  // Text colors - Stone palette
  stone800: colors.gray[900],

  // Success state
  successBackground: colors.primary[100],

  // Text on dark/colored backgrounds
  textInverse: colors.text.inverse,
} as const;

/**
 * Touch target sizes (minimum 44pt per accessibility guidelines)
 */
export const TOUCH_TARGETS = {
  chipHeight: 44,
  ctaHeight: 56,
  inputHeight: 52,
  minSize: 44,
} as const;

/**
 * Border radius values consistent with app design system
 */
export const BORDER_RADIUS = {
  chip: 9999,
  cta: 16,

  heroIcon: 24,
  // Pill/full rounded
  input: 16,
} as const;

/**
 * Character limit configuration for habit name input
 * Shows visual warning at warningThreshold, error color at errorThreshold
 */
export const CHARACTER_LIMIT = {
  errorThreshold: 45,
  max: 50,
  warningThreshold: 35,
} as const;
