import type { SemanticColors } from '../../../theme/darkColors';

export interface EmojiGridProps {
  emojis: string[];
  selectedEmoji: string | null;
  onEmojiSelect: (emoji: string) => void;
  categoryName?: string;
  showCategoryHeader?: boolean;
  themeColors?: SemanticColors;
}

export interface EmojiCellProps {
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
  themeColors?: SemanticColors;
}

export interface EmojiRowProps {
  emojis: string[];
  selectedEmoji: string | null;
  onEmojiSelect: (emoji: string) => void;
  themeColors?: SemanticColors;
}

export const EMOJIS_PER_ROW = 6;
