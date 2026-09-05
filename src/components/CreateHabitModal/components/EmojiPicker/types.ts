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
  /**
   * 'triangle' (default) = legacy 5+4 centered rows, used by the template
   * preview. 'grid' = 5-column square tiles with a trailing dashed "+" tile.
   */
  layout?: 'triangle' | 'grid';
  /**
   * When provided, the picker does NOT own the browse sheet — the "+" tile and
   * the browse link call this instead (the parent renders EmojiBrowseSheet).
   */
  onBrowse?: () => void;
}

export interface EmojiChipProps {
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
  reduceMotion: boolean;
  /** Grid layout only — exact square edge, measured by EmojiTileGrid. */
  size?: number;
}
