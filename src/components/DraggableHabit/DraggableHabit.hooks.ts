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

// Figma design accent colors - blue and orange primary
const ACCENT_COLORS = [
  '#3b82f6', // blue-500 (Exercise in Figma)
  '#f97316', // orange-500 (Japanese in Figma)
  '#10b981', // emerald-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#ec4899', // pink-500
  '#eab308', // yellow-500
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
