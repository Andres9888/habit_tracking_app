/**
 * HabitsEmptyStateMinimal - Constants
 *
 * Ultra-minimal empty state design focused on a single question flow.
 * Reference: docs/specs/empty-habit-screen/minimal-redesign.md
 */

import type { SuggestionChip } from './types';

/**
 * 6 universal habits that work at any time of day.
 * Each chip includes emoji, short label, and full habit name for creation.
 */
export const SUGGESTION_CHIPS: SuggestionChip[] = [
  { emoji: '💧', label: 'Water', fullName: 'Drink water' },
  { emoji: '🚶', label: 'Walk', fullName: 'Walk 5 minutes' },
  { emoji: '📝', label: 'Write', fullName: 'Write one line' },
  { emoji: '🧘', label: 'Breathe', fullName: 'Breathe for 2 minutes' },
  { emoji: '📚', label: 'Read', fullName: 'Read 5 pages' },
  { emoji: '🤸', label: 'Stretch', fullName: 'Stretch for 5 minutes' },
];

/**
 * Copy strings for the minimal empty state
 */
export const COPY = {
  // Question headline - line break after "thing" for rhythm
  headline: "What's one small thing\nyou want to do daily?",

  // Input placeholder
  inputPlaceholder: 'Type your habit...',

  // Primary CTA
  ctaButton: 'Start my journey →',

  // Secondary links
  browseTemplates: 'Browse templates',
  createCustom: 'Create custom habit',

  // Success state
  successHeadline: "You're growing!",
  successSubtext: (habitName: string) => `"${habitName}" added to your habits`,
  addAnother: 'Add another habit',
} as const;

/**
 * Design system color tokens aligned with app patterns
 */
export const COLORS = {
  // Primary action color
  emerald500: '#10B981',
  emerald100: '#D1FAE5',
  green50: '#F0FDF4',

  // Input focus color (per app pattern)
  blue500: '#3B82F6',

  // Text colors - Stone palette
  stone800: '#1C1917',
  stone700: '#44403C',
  stone400: '#A8A29E',
  stone300: '#D6D3D1',
  stone200: '#E7E5E4',

  // Caret color
  emeraldCaret: '#10B981',

  // Success state
  successBackground: '#D1FAE5',
} as const;

/**
 * Touch target sizes (minimum 44pt per accessibility guidelines)
 */
export const TOUCH_TARGETS = {
  minSize: 44,
  chipHeight: 44,
  ctaHeight: 56,
  inputHeight: 52,
} as const;

/**
 * Border radius values consistent with app design system
 */
export const BORDER_RADIUS = {
  chip: 9999, // Pill/full rounded
  input: 16,
  cta: 16,
  heroIcon: 24,
} as const;
