export interface EmojiGridProps {
  emojis: string[];
  selectedEmoji: string | null;
  onEmojiSelect: (emoji: string) => void;
  categoryName?: string;
  showCategoryHeader?: boolean;
}

export interface EmojiCellProps {
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
}

export interface EmojiRowProps {
  emojis: string[];
  selectedEmoji: string | null;
  onEmojiSelect: (emoji: string) => void;
}

export const EMOJIS_PER_ROW = 6;
