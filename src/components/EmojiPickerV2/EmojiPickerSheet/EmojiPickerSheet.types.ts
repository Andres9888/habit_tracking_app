/**
 * EmojiPickerSheet Types
 */

export interface EmojiPickerSheetProps {
  visible: boolean;
  habitName: string;
  selectedEmoji: string | null;
  onSelect: (emoji: string | null) => void;
  onClose: () => void;
}
