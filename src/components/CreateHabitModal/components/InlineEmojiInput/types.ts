/**
 * Types for InlineEmojiInput component
 */

export interface InlineEmojiInputProps {
  emoji: string | null;
  color: string;
  value: string;
  onChange: (text: string) => void;
  onFocus: () => void;
  onEmojiPress: () => void;
  autoFocus: boolean;
}

export interface ValidationMessage {
  message: string;
  type: 'success' | 'tip' | 'warning';
}
