/**
 * ProgressEmojiPicker types
 */

import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';

import type {
  ProgressEmojiPreset,
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
  /** User's saved "Custom" preset. When present, appears as a 6th chip. */
  customPreset?: ProgressEmojiPreset | null;
}

export interface ProgressEmojiSlotRowProps {
  stageKey: StrengthLevelKey;
  stageLabel: string;
  emoji: string;
  onPress: (stageKey: StrengthLevelKey) => void;
}

export interface ProgressEmojiToggleRowProps {
  /** Resolved per-stage set rendered as the preview glyphs. */
  resolved: ProgressEmojiSet;
  /** Whether the customization panel is open. */
  expanded: boolean;
  /** Toggles the panel; fired by both the glyph row and the action label. */
  onToggle: () => void;
  /** Style applied to the row container. */
  toggleRowStyle?: StyleProp<ViewStyle>;
  /** Optional caption rendered above the row. */
  label?: string;
}

export interface ProgressEmojiPanelProps {
  resolved: ProgressEmojiSet;
  activePresetId: string | null;
  customPreset?: ProgressEmojiPreset | null;
  /** Whether to show the "Reset to default" affordance. */
  showReset: boolean;
  /** Style applied to the panel content container. */
  panelStyle?: StyleProp<ViewStyle>;
  onPreset: (next: ProgressEmojiSet) => void;
  onSlotPress: (stageKey: StrengthLevelKey) => void;
  onReset: () => void;
  /** Measures the panel's natural height for the expand animation. */
  onLayout: (event: LayoutChangeEvent) => void;
}
