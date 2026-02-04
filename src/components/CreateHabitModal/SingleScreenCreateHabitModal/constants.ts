export const DEFAULT_SAGE_GREEN = '#6B8F71';

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

export const CUSTOMIZE_COLORS = [
  '#6B8F71',
  '#EF4444',
  '#F97316',
  '#FBBF24',
  '#10B981',
] as const;

export const TYPOGRAPHY = {
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 1.5 },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: 0.065,
    lineHeight: 1.4,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600' as const,
    letterSpacing: -0.56,
    lineHeight: 1.2,
  },
} as const;

export const COLORS = {
  accent: '#6B8F71',
  cardBackground: '#FFFFFF',
  dominant: '#F5F3EF',
  mutedText: '#8A8A8A',
  neutralBase: '#E8E4DD',
  secondary: '#2D2D2D',
} as const;

export const SPACING = {
  lg: 24,
  md: 16,
  sm: 8,
  xl: 32,
  xs: 4,
  xxl: 48,
} as const;

export const ANIMATION = {
  buttonRipple: 180,
  createSuccess: 320,
  customizeCollapse: 200,
  customizeExpand: 240,
  fieldFocus: 200,
  screenEntry: 280,
  selectionPop: 220,
} as const;

export const DIMENSIONS = {
  borderRadius: { button: 12, card: 16, iconChip: 6, input: 12 },
  buttonHeight: 56,
  colorChip: 24,
  customizeRowHeight: 48,
  iconChip: 24,
  inputHeight: 56,
} as const;

export function getRandomEmoji(): string {
  const randomIndex = Math.floor(Math.random() * CURATED_EMOJIS.length);
  return CURATED_EMOJIS[randomIndex];
}
