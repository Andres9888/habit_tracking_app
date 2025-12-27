export const DEFAULT_EMOJI = '💪';
export const DEFAULT_COLOR = '#10B981'; // Emerald - V8 default

export const EMOJIS = [
  ...new Set(
    '💪 🧘 📖 💧 🎨 🏃 🍎 🥗 ☕ 💤 🎯 ✍️ 🚴 🧠 🎵 🌞 🌙 ⚡ 🔥 🌱 🏋️ 🚶 🧘‍♀️ 🎨 📝 💼 📚 🎓 💡 🏆'.split(
      ' '
    )
  ),
];

/**
 * V8 Habit Colors - 12 vibrant colors for the color picker
 * Order matches design spec for visual flow
 */
export const HABIT_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#FBBF24', // Amber
  '#84CC16', // Lime
  '#10B981', // Emerald (default)
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#A855F7', // Purple
  '#EC4899', // Pink
  '#78716C', // Stone
] as const;

/** @deprecated Use HABIT_COLORS instead - kept for backward compatibility */
export const COLORS = HABIT_COLORS;

export const HABIT_NAME_REGEX = /^(\p{Emoji})\s+(.+)$/u;
