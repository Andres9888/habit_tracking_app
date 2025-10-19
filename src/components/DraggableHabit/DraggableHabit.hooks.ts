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

const ACCENT_COLORS = [
  '#4ADE80',
  '#60A5FA',
  '#F59E0B',
  '#A855F7',
  '#F97316',
  '#38BDF8',
  '#F472B6',
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
