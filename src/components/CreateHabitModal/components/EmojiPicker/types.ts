/**
 * EmojiPicker Types
 * Type definitions for the EmojiPicker component and its sub-components
 */

export interface EmojiPickerProps {
  emojis?: string[]; // kept for backwards compatibility but not used
  selectedEmoji: string | null;
  onSelect: (emoji: string | null) => void;
  habitName?: string;
  hideLabel?: boolean; // Hide section label for cleaner centered modal design
  /** When true, suggestions freeze — used once user engages with the grid */
  isLocked?: boolean;
}

export interface EmojiChipProps {
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
  reduceMotion: boolean;
}
