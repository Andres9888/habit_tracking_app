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
    id: 'fitness',
    name: 'Fitness',
    icon: '💪',
    emojis: [
      '💪', '🏃', '🚴', '🧘', '🏋️', '🏊', '🚶', '🤸',
      '⚽', '🏀', '🎾', '🏈', '🥊', '🎯', '🛹', '🏇',
      '🥋', '🏌️', '🤾', '🏄', '🧗', '🏂', '⛷️', '🚵',
      '⛹️', '🤼', '🤽', '🤺', '🥏', '🏓', '🏸', '🥌',
    ],
  },
  {
    id: 'learning',
    name: 'Learning',
    icon: '📚',
    emojis: [
      '📖', '📚', '✏️', '🎓', '💡', '🧠', '📝', '🔬',
      '✍️', '🖊️', '📓', '📔', '🔍', '🧪', '📐', '📏',
      '🖋️', '📑', '🗒️', '💻', '🎯', '📊', '📈', '🧮',
    ],
  },
  {
    id: 'wellness',
    name: 'Wellness',
    icon: '🧘',
    emojis: [
      '🧘', '💆', '😴', '💤', '🌅', '🌿', '💚', '🛁',
      '🧖', '🌸', '🌺', '🪷', '☮️', '🌙', '⭐', '✨',
      '🌈', '🦋', '🕯️', '🪴', '🍃', '🌾', '💫', '☯️',
    ],
  },
  {
    id: 'health',
    name: 'Health',
    icon: '🍎',
    emojis: [
      '🥗', '🍎', '💧', '🥦', '🍳', '🥤', '💊', '🩺',
      '🥑', '🍌', '🍊', '🥕', '🍇', '🍓', '🍵', '🥛',
      '☕', '🧃', '🫖', '🌽', '🥬', '🫐', '🍒', '🧈',
    ],
  },
  {
    id: 'work',
    name: 'Work',
    icon: '💼',
    emojis: [
      '💼', '📋', '✅', '📅', '⏰', '🎯', '📈', '💻',
      '📧', '📞', '🗓️', '📌', '📎', '🖇️', '📁', '📂',
      '🗄️', '💵', '💰', '🏦', '📊', '📉', '⌛', '⏳',
    ],
  },
  {
    id: 'creative',
    name: 'Creative',
    icon: '🎨',
    emojis: [
      '🎨', '🎵', '🎸', '📷', '✍️', '🎭', '🖌️', '🎹',
      '🎺', '🎻', '🥁', '🎤', '🎬', '🎥', '📹', '🎞️',
      '✂️', '🧵', '🧶', '🪡', '🎪', '🖼️', '🎧', '🎶',
    ],
  },
  {
    id: 'home',
    name: 'Home',
    icon: '🏠',
    emojis: [
      '🏠', '🧹', '🌱', '🛏️', '🧺', '🍳', '👕', '🧼',
      '🚿', '🛋️', '🪑', '🖼️', '🛍️', '🧴', '🧽', '🪣',
      '🗑️', '📦', '🔧', '🔨', '🪛', '🧰', '🪴', '🌻',
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: '💰',
    emojis: [
      '💰', '💵', '📊', '🏦', '💳', '📉', '💎', '🪙',
      '💲', '💸', '🤑', '📈', '🧾', '💴', '💶', '💷',
      '🏧', '💱', '⚖️', '🎰', '📅', '📋', '✅', '🎯',
    ],
  },
  {
    id: 'social',
    name: 'Social',
    icon: '❤️',
    emojis: [
      '❤️', '👨‍👩‍👧', '📞', '💬', '🤝', '👋', '😊', '🎉',
      '💌', '🥳', '🤗', '💕', '💖', '👪', '👫', '👭',
      '👬', '🙌', '👏', '🎊', '🎁', '💝', '💓', '💗',
    ],
  },
  {
    id: 'all',
    name: 'All',
    icon: '⭐',
    emojis: [], // Empty - will load full library from emojiData
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
