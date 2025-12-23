export const DEFAULT_EMOJI = '💪';
export const DEFAULT_COLOR = '#DBEAFE';

export const EMOJIS = Array.from(
  new Set(
    '💪 🧘 📖 💧 🎨 🏃 🍎 🥗 ☕ 💤 🎯 ✍️ 🚴 🧠 🎵 🌞 🌙 ⚡ 🔥 🌱 🏋️ 🚶 🧘‍♀️ 🎨 📝 💼 📚 🎓 💡 🏆'.split(
      ' '
    )
  )
);

export const COLORS = [
  // Row 1: Core vibrant colors (8 colors)
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#1E293B', // Slate (dark)

  // Row 2: Softer/alternative tones (8 colors)
  '#06B6D4', // Cyan
  '#F472B6', // Light Pink
  '#FB923C', // Light Orange
  '#4ADE80', // Light Green
  '#A78BFA', // Light Purple
  '#78716C', // Stone (neutral)
  '#0EA5E9', // Sky Blue
  '#FBBF24', // Amber

  // Row 3: Additional variety (8 colors)
  '#DC2626', // Dark Red
  '#C2410C', // Burnt Orange
  '#84CC16', // Lime
  '#14B8A6', // Teal
  '#6366F1', // Indigo
  '#D946EF', // Fuchsia
  '#F43F5E', // Rose
  '#57534e', // Slate Gray
];

export const HABIT_NAME_REGEX = /^(\p{Emoji})\s+(.+)$/u;
