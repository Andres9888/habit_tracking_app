import {
  DEFAULT_HABIT_COLOR,
  EXTENDED_COLOR_NAMES,
  EXTENDED_HABIT_COLORS,
  getExtendedColorName,
} from './colorPalette';

export const DEFAULT_EMOJI = '💪';
export const DEFAULT_COLOR = DEFAULT_HABIT_COLOR; // Emerald - V8 default

export const EMOJIS = [
  ...new Set(
    '💪 🧘 📖 💧 🎨 🏃 🍎 🥗 ☕ 💤 🎯 ✍️ 🚴 🧠 🎵 🌞 🌙 ⚡ 🔥 🌱 🏋️ 🚶 🧘‍♀️ 🎨 📝 💼 📚 🎓 💡 🏆'.split(
      ' '
    )
  ),
];

/**
 * Habit colors - Extended 16-color palette for customization
 * Curated for both light and dark mode compatibility
 * @see colorPalette.ts for detailed color information
 */
export const HABIT_COLORS = EXTENDED_HABIT_COLORS;

/**
 * Human-readable color names for accessibility (VoiceOver)
 * Maps hex values to descriptive names
 */
export const COLOR_NAMES = EXTENDED_COLOR_NAMES;

/**
 * Get human-readable color name for accessibility
 * Returns the hex value if no name is found
 */
export const getColorName = getExtendedColorName;

/** @deprecated Use HABIT_COLORS instead - kept for backward compatibility */
export const COLORS = HABIT_COLORS;

export const HABIT_NAME_REGEX = /^(\p{Emoji})\s+(.+)$/u;
