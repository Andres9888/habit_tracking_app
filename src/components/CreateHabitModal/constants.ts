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
  // 10 curated colors for V5 simplified color picker
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#14B8A6', // Teal
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#78716C', // Stone (neutral)
  '#1E293B', // Slate (dark)
];

export const HABIT_NAME_REGEX = /^(\p{Emoji})\s+(.+)$/u;
