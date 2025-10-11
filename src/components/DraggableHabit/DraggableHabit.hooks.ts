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

  return { emoji: "", name: fullName };
};

interface Habit {
  name: string;
  [key: string]: any;
}

export const useDraggableHabitLogic = (habit: Habit) => {
  const { emoji, name } = getEmojiAndName(habit.name);

  return {
    emoji,
    name,
  };
};
