/**
 * SingleScreenCreateHabitModal Design Tokens
 * Based on habit-creation-redesign-spec.md
 */

// Sage green as default accent per spec
export const DEFAULT_SAGE_GREEN = '#6B8F71';

// Curated emoji set for random selection and icon grid
export const CURATED_EMOJIS = [
  '💪',
  '🧘',
  '📖',
  '💧',
  '🎨',
  '🏃',
  '🍎',
  '🥗',
  '☕',
  '💤',
  '🎯',
  '✍️',
  '🚴',
  '🧠',
  '🎵',
  '🌞',
  '🌙',
  '⚡',
  '🔥',
  '🌱',
] as const;

// 5 color swatches per spec (sage green first)
export const CUSTOMIZE_COLORS = [
  '#6B8F71', // Sage green (default)
  '#EF4444', // Red
  '#F97316', // Orange
  '#FBBF24', // Amber
  '#10B981', // Emerald
] as const;

// Typography from spec
export const TYPOGRAPHY = {
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 1.5,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: 0.065,
    lineHeight: 1.4, // +0.5%
  },
  h2: {
    fontSize: 28,
    fontWeight: '600' as const,
    letterSpacing: -0.56,
    lineHeight: 1.2, // -2%
  },
} as const;

// Color palette from spec
export const COLORS = {
  // Primary text, icons
  accent: '#6B8F71',

  // Tertiary labels, placeholders
  cardBackground: '#FFFFFF',

  dominant: '#F5F3EF',

  // Elevated surfaces, dividers
  mutedText: '#8A8A8A',

  // Primary action, selected states
  neutralBase: '#E8E4DD',

  // Primary background
  secondary: '#2D2D2D',
} as const;

// 8px spacing unit per spec
export const SPACING = {
  lg: 24,
  md: 16,
  sm: 8,
  xl: 32,
  xs: 4,
  xxl: 48,
} as const;

// Animation durations from spec
export const ANIMATION = {
  buttonRipple: 180,
  createSuccess: 320,
  customizeCollapse: 200,
  customizeExpand: 240,
  fieldFocus: 200,
  screenEntry: 280,
  selectionPop: 220,
} as const;

// Dimensions from spec
export const DIMENSIONS = {
  borderRadius: {
    button: 12,
    card: 16,
    iconChip: 6,
    input: 12,
  },
  buttonHeight: 56,
  colorChip: 24,
  customizeRowHeight: 48,
  iconChip: 24,
  inputHeight: 56,
} as const;

/**
 * Get a random emoji from the curated set
 */
export function getRandomEmoji(): string {
  const randomIndex = Math.floor(Math.random() * CURATED_EMOJIS.length);
  return CURATED_EMOJIS[randomIndex];
}
