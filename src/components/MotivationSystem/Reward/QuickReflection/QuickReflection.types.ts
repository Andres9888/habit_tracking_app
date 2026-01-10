export type EmojiType = 'frustrated' | 'neutral' | 'happy' | 'fire';

export interface QuickReflectionProps {
  /** Current reflection emoji (undefined if not set) */
  selectedEmoji?: EmojiType;
  /** Current reflection note (undefined if not set) */
  note?: string;
  /** Callback when emoji is selected */
  onEmojiSelect: (emoji: EmojiType) => void;
  /** Callback when note is changed */
  onNoteChange?: (note: string) => void;
  /** Callback when the reflection is submitted */
  onSubmit?: () => void;
  /** Whether to show the note input field */
  showNoteInput?: boolean;
  /** Whether to run entrance animations */
  shouldAnimate?: boolean;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Section index for staggered animation timing */
  sectionIndex?: number;
  /** Whether the component is in compact mode (for inline use) */
  compact?: boolean;
}

export interface EmojiOption {
  emoji: string;
  type: EmojiType;
  label: string;
}
