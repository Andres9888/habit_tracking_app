// Extract emoji from habit name (if present)
export const getEmojiAndName = (
  fullName: string
): { emoji: string; name: string } => {
  const emojiRegex = /\p{Emoji}/u;
  const match = fullName.match(emojiRegex);

  if (match && match.index === 0) {
    const emoji = match[0];
    const name = fullName.slice(emoji.length).trim();
    return { emoji, name };
  }

  return { emoji: '', name: fullName };
};

interface Habit {
  name: string;
  [key: string]: any;
}

// Premium accent colors - deeper, more sophisticated tones
const ACCENT_COLORS = [
  '#2563eb', // blue-600 - 20% deeper (was #3b82f6)
  '#ea580c', // orange-600 - richer (was #f97316)
  '#059669', // emerald-600 - deeper (was #10b981)
  '#7c3aed', // violet-600 - richer (was #8b5cf6)
  '#0891b2', // cyan-600 - deeper (was #06b6d4)
  '#db2777', // pink-600 - sophisticated (was #ec4899)
  '#ca8a04', // yellow-600 - golden (was #eab308)
];

const pickAccentColor = (input: string): string => {
  if (!input) {
    return ACCENT_COLORS[0];
  }

  const codeSum = [...input].reduce(
    (sum, char) => sum + (char.codePointAt(0) ?? 0),
    0
  );

  return ACCENT_COLORS[codeSum % ACCENT_COLORS.length];
};

export const useDraggableHabitLogic = (habit: Habit) => {
  const { emoji, name } = getEmojiAndName(habit.name);
  const accentColor = pickAccentColor(name || habit.name);

  return {
    accentColor,
    emoji,
    name,
  };
};
