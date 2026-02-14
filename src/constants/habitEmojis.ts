export interface HabitCategory {
  id: string;
  name: string;
  icon: string;
  emojis: string[];
}

/**
 * Habit-focused emoji categories for the emoji picker
 * Replaces generic categories with ones contextually relevant to habits
 */
export const HABIT_CATEGORIES: HabitCategory[] = [
  {
    emojis: [
      '💪', '🏃', '🚴', '🧘', '🏋️', '🏊', '🚶', '🤸',
      '⚽', '🏀', '🎾', '🏈', '🥊', '🎯', '🛹', '🏇',
      '🥋', '🏌️', '🤾', '🏄', '🧗', '🏂', '⛷️', '🚵',
      '⛹️', '🤼', '🤽', '🤺', '🥏', '🏓', '🏸', '🥌',
    ],
    icon: '💪',
    id: 'fitness',
    name: 'Fitness',
  },
  {
    emojis: [
      '📖', '📚', '✏️', '🎓', '💡', '🧠', '📝', '🔬',
      '✍️', '🖊️', '📓', '📔', '🔍', '🧪', '📐', '📏',
      '🖋️', '📑', '🗒️', '💻', '🎯', '📊', '📈', '🧮',
    ],
    icon: '📚',
    id: 'learning',
    name: 'Learning',
  },
  {
    emojis: [
      '🧘', '💆', '😴', '💤', '🌅', '🌿', '💚', '🛁',
      '🧖', '🌸', '🌺', '🪷', '☮️', '🌙', '⭐', '✨',
      '🌈', '🦋', '🕯️', '🪴', '🍃', '🌾', '💫', '☯️',
    ],
    icon: '🧘',
    id: 'wellness',
    name: 'Wellness',
  },
  {
    emojis: [
      '🥗', '🍎', '💧', '🥦', '🍳', '🥤', '💊', '🩺',
      '🥑', '🍌', '🍊', '🥕', '🍇', '🍓', '🍵', '🥛',
      '☕', '🧃', '🫖', '🌽', '🥬', '🫐', '🍒', '🧈',
    ],
    icon: '🍎',
    id: 'health',
    name: 'Health',
  },
  {
    emojis: [
      '💼', '📋', '✅', '📅', '⏰', '🎯', '📈', '💻',
      '📧', '📞', '🗓️', '📌', '📎', '🖇️', '📁', '📂',
      '🗄️', '💵', '💰', '🏦', '📊', '📉', '⌛', '⏳',
    ],
    icon: '💼',
    id: 'work',
    name: 'Work',
  },
  {
    emojis: [
      '🎨', '🎵', '🎸', '📷', '✍️', '🎭', '🖌️', '🎹',
      '🎺', '🎻', '🥁', '🎤', '🎬', '🎥', '📹', '🎞️',
      '✂️', '🧵', '🧶', '🪡', '🎪', '🖼️', '🎧', '🎶',
    ],
    icon: '🎨',
    id: 'creative',
    name: 'Creative',
  },
  {
    emojis: [
      '🏠', '🧹', '🌱', '🛏️', '🧺', '🍳', '👕', '🧼',
      '🚿', '🛋️', '🪑', '🖼️', '🛍️', '🧴', '🧽', '🪣',
      '🗑️', '📦', '🔧', '🔨', '🪛', '🧰', '🪴', '🌻',
    ],
    icon: '🏠',
    id: 'home',
    name: 'Home',
  },
  {
    emojis: [
      '💰', '💵', '📊', '🏦', '💳', '📉', '💎', '🪙',
      '💲', '💸', '🤑', '📈', '🧾', '💴', '💶', '💷',
      '🏧', '💱', '⚖️', '🎰', '📅', '📋', '✅', '🎯',
    ],
    icon: '💰',
    id: 'finance',
    name: 'Finance',
  },
  {
    emojis: [
      '❤️', '👨‍👩‍👧', '📞', '💬', '🤝', '👋', '😊', '🎉',
      '💌', '🥳', '🤗', '💕', '💖', '👪', '👫', '👭',
      '👬', '🙌', '👏', '🎊', '🎁', '💝', '💓', '💗',
    ],
    icon: '❤️',
    id: 'social',
    name: 'Social',
  },
  {
    emojis: [],
    icon: '⭐',
    id: 'all',
    name: 'All', // Empty - will load full library from emojiData
  },
];

/**
 * Get emojis for a specific habit category
 * @param categoryId - The category ID to get emojis for
 * @returns Array of emoji strings for the category
 */
export function getHabitCategoryEmojis(categoryId: string): string[] {
  const category = HABIT_CATEGORIES.find((cat) => cat.id === categoryId);
  return category?.emojis ?? [];
}
