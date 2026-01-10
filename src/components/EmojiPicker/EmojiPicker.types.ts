import type { RefObject } from 'react';
import type { View } from 'react-native';

export interface EmojiPickerProps {
  onClose: () => void;
  onSelect: (emoji: string | null) => void;
  selectedEmoji?: string | null;
  visible: boolean;
  /** Ref to the trigger element for focus management on modal close */
  triggerRef?: RefObject<View>;
  /** Optional habit name to generate emoji suggestions */
  habitName?: string;
}

export interface EmojiItemProps {
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
}

export interface QuickAccessEmojiItemProps {
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
  accessibilityLabelSuffix?: string;
}
