/**
 * Curated Color Palette for Habit Themes
 * 
 * 16-color palette designed to work beautifully in both light and dark modes.
 * Each color is carefully selected for:
 * - Sufficient contrast against both light and dark backgrounds
 * - Visual harmony and variety
 * - Accessibility (WCAG AA compliance)
 * - Emotional resonance for habit tracking
 */

/**
 * Extended habit color palette - 16 vibrant, accessible colors
 * Organized by color family for visual flow in the picker
 */
export const EXTENDED_HABIT_COLORS = [
  // Warm reds & oranges
  '#EF4444', // Red - passion, energy
  '#F97316', // Orange - enthusiasm, creativity
  '#FB923C', // Light Orange - warmth, optimism
  '#FBBF24', // Amber - success, achievement
  
  // Greens & teals
  '#10B981', // Emerald (default) - growth, health
  '#14B8A6', // Teal - balance, calm
  '#22C55E', // Green - vitality, nature
  '#84CC16', // Lime - freshness, energy
  
  // Blues & purples
  '#06B6D4', // Cyan - clarity, focus
  '#3B82F6', // Blue - trust, stability
  '#6366F1', // Indigo - depth, wisdom
  '#8B5CF6', // Violet - creativity, spirituality
  
  // Pinks & neutrals
  '#EC4899', // Pink - compassion, love
  '#F43F5E', // Rose - passion, determination
  '#64748B', // Slate - sophistication, neutrality
  '#78716C', // Stone - grounding, stability
] as const;

/**
 * Human-readable color names for accessibility (VoiceOver, TalkBack)
 * Maps hex values to descriptive names for screen readers
 */
export const EXTENDED_COLOR_NAMES: Record<string, string> = {
  '#EF4444': 'Red',
  '#F97316': 'Orange',
  '#FB923C': 'Light Orange',
  '#FBBF24': 'Amber',
  '#10B981': 'Emerald',
  '#14B8A6': 'Teal',
  '#22C55E': 'Green',
  '#84CC16': 'Lime',
  '#06B6D4': 'Cyan',
  '#3B82F6': 'Blue',
  '#6366F1': 'Indigo',
  '#8B5CF6': 'Violet',
  '#EC4899': 'Pink',
  '#F43F5E': 'Rose',
  '#64748B': 'Slate',
  '#78716C': 'Stone',
} as const;

/**
 * Get human-readable color name for accessibility
 * Returns the hex value if no name is found
 */
export const getExtendedColorName = (hex: string): string => {
  return EXTENDED_COLOR_NAMES[hex.toUpperCase()] || EXTENDED_COLOR_NAMES[hex] || hex;
};

/**
 * Default habit color - Emerald green
 * Represents growth, health, and positive habits
 */
export const DEFAULT_HABIT_COLOR = '#10B981';
