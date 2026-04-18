/**
 * ProgressEmojiPicker types
 */

import type { StyleProp, ViewStyle } from 'react-native';

import type {
  ProgressEmojiSet,
  StrengthLevelKey,
} from '@/utils/progressEmojis';

export interface ProgressEmojiPickerProps {
  /** Currently selected per-stage emoji set, or undefined to use defaults. */
  value: ProgressEmojiSet | undefined;
  /** Called with a complete set, or undefined to clear the override. */
  onChange: (next: ProgressEmojiSet | undefined) => void;
  /** Resolved set used for preview when value is undefined (fallback chain). */
  fallback: ProgressEmojiSet;
  /** Optional caption above the preview row. */
  label?: string;
  /** Style applied to the always-visible preview/toggle row. */
  toggleRowStyle?: StyleProp<ViewStyle>;
  /** Style applied to the expanded customization panel. */
  expandedPanelStyle?: StyleProp<ViewStyle>;
}

export interface ProgressEmojiSlotRowProps {
  stageKey: StrengthLevelKey;
  stageLabel: string;
  emoji: string;
  onPress: (stageKey: StrengthLevelKey) => void;
}
