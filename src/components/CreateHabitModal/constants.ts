export const DEFAULT_EMOJI = '💪';
export const DEFAULT_COLOR = '#DBEAFE';

export const EMOJIS = Array.from(
  new Set(
    '💪 🧘 📖 💧 🎨 🏃 🍎 🥗 ☕ 💤 🎯 ✍️ 🚴 🧠 🎵 🌞 🌙 ⚡ 🔥 🌱 🏋️ 🚶 🧘‍♀️ 🎨 📝 💼 📚 🎓 💡 🏆'.split(
      ' '
    )
  )
);

export const COLORS = ['#DBEAFE', '#FFEDD5', '#DCFCE7', '#F3E8FF', '#FCE7F3', '#CCFBF1'];

export const HABIT_NAME_REGEX = /^(\p{Emoji})\s+(.+)$/u;

export const MAX_HABIT_NAME_LENGTH = 40;
export const MIN_HABIT_NAME_LENGTH = 3;
