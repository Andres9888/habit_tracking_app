/**
 * Default emoji shown when creating a new habit
 * Represents strength and building habits
 */
export const DEFAULT_EMOJI = '💪';

/**
 * Default habit color (Emerald green)
 * Emerald is the brand color and V8 default
 */
export const DEFAULT_COLOR = '#10B981'; // Emerald - V8 default

/**
 * Available emoji picker options for habit icons
 * Covers common habit categories: health, productivity, mindfulness, learning
 * Uses Set to remove duplicates from the space-separated string
 */
export const EMOJIS = [
  ...new Set(
    '💪 🧘 📖 💧 🎨 🏃 🍎 🥗 ☕ 💤 🎯 ✍️ 🚴 🧠 🎵 🌞 🌙 ⚡ 🔥 🌱 🏋️ 🚶 🧘‍♀️ 🎨 📝 💼 📚 🎓 💡 🏆'.split(
      ' '
    )
  ),
];

/**
 * Habit colors - predefined 10-color palette for customization
 * Order matches design spec for visual flow
 */
export const HABIT_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#FBBF24', // Amber
  '#10B981', // Emerald (default)
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#78716C', // Stone
] as const;

/**
 * Human-readable color names for accessibility (VoiceOver)
 * Maps hex values to descriptive names
 */
export const COLOR_NAMES: Record<string, string> = {
  '#06B6D4': 'Cyan',
  '#3B82F6': 'Blue',
  '#8B5CF6': 'Violet',
  '#10B981': 'Emerald',
  '#14B8A6': 'Teal',
  '#78716C': 'Stone',
  '#EF4444': 'Red',
  '#EC4899': 'Pink',
  '#F97316': 'Orange',
  '#FBBF24': 'Amber',
} as const;

/**
 * Get human-readable color name for accessibility
 * Returns the hex value if no name is found
 */
export const getColorName = (hex: string): string => {
  return COLOR_NAMES[hex.toUpperCase()] || COLOR_NAMES[hex] || hex;
};

/**
 * @deprecated Use HABIT_COLORS instead - kept for backward compatibility
 * Legacy export that will be removed in a future version
 */
export const COLORS = HABIT_COLORS;

/**
 * Regular expression to extract emoji and name from full habit name
 *
 * @example
 * "💪 Morning workout" → ["💪 Morning workout", "💪", "Morning workout"]
 * "Read daily" → null (no emoji prefix)
 *
 * @pattern Matches: (emoji) + (space) + (any text)
 * Uses Unicode emoji property to match any emoji character
 */
export const HABIT_NAME_REGEX = /^(\p{Emoji})\s+(.+)$/u;
