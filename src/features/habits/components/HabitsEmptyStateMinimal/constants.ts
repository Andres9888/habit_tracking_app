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
  { emoji: '💧', fullName: 'Drink water', label: 'Water' },
  { emoji: '🚶', fullName: 'Walk 5 minutes', label: 'Walk' },
  { emoji: '📝', fullName: 'Write one line', label: 'Write' },
  { emoji: '🧘', fullName: 'Breathe for 2 minutes', label: 'Breathe' },
  { emoji: '📚', fullName: 'Read 5 pages', label: 'Read' },
  { emoji: '🤸', fullName: 'Stretch for 5 minutes', label: 'Stretch' },
];

/**
 * Copy strings for the minimal empty state
 */
export const COPY = {
  addAnother: 'Add another habit',

  // Secondary links
  browseTemplates: 'Browse templates',

  createCustom: 'Create custom habit',

  // Primary CTA
  ctaButton: 'Start my journey →',

  // Question headline - line break after "thing" for rhythm
  headline: "What's one small thing\nyou want to do daily?",

  // Input placeholder
  inputPlaceholder: 'Type your habit...',
  // Success state
  successHeadline: "You're growing!",
  successSubtext: (habitName: string) => `"${habitName}" added to your habits`,
} as const;

/**
 * Design system color tokens aligned with app patterns
 */
export const COLORS = {
  // Input focus color (per app pattern)
  blue500: '#3B82F6',

  emerald100: '#D1FAE5',

  // Primary action color (used for indicators/accents)
  emerald500: '#10B981',

  // WCAG AA compliant primary action (5.21:1 contrast with white)
  emerald700: '#047857',

  // Caret color
  emeraldCaret: '#10B981',

  green50: '#F0FDF4',

  stone200: '#E7E5E4',

  stone300: '#D6D3D1',

  stone400: '#A8A29E',

  stone500: '#78716C',

  stone700: '#44403C',

  // Text colors - Stone palette
  stone800: '#1C1917',

  // Success state
  successBackground: '#D1FAE5',
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
