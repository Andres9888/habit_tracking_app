import type { CategoryFilter } from './types';

export const DEFAULT_EMOJI = '💪';
export const DEFAULT_COLOR = '#DBEAFE';

export const EMOJIS = '💪 🧘 📖 💧 🎨 🏃 🍎 🥗 ☕ 💤 🎯 ✍️ 🚴 🧠 🎵 🌞 🌙 ⚡ 🔥 🌱 🏋️ 🚶 🧘‍♀️ 🎨 📝 💼 📚 🎓 💡 🏆'.split(
  ' '
);

export const COLORS = ['#DBEAFE', '#FFEDD5', '#DCFCE7', '#F3E8FF', '#FCE7F3', '#CCFBF1'];

export const CATEGORIES: CategoryFilter[] = [
  { icon: '✨', id: 'all', label: 'All' },
  { icon: '🌅', id: 'morning_routine', label: 'Morning' },
  { icon: '💪', id: 'health_fitness', label: 'Health' },
  { icon: '🎯', id: 'productivity', label: 'Productivity' },
  { icon: '🧘', id: 'mindfulness', label: 'Mindfulness' },
  { icon: '🔬', id: 'andrew_huberman', label: 'Huberman' },
];

export const HABIT_NAME_REGEX = /^(\p{Emoji})\s+(.+)$/u;
