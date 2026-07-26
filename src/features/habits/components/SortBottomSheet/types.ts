import type { LucideIcon } from 'lucide-react-native';

import type { HabitSortMode } from '../../types';

/**
 * Sort option configuration with icons, colors, and descriptions
 */
export interface SortOptionConfig {
  value: HabitSortMode;
  label: string;
  description: string;
  Icon: LucideIcon;
  iconBgColors: [string, string];
  /** Quick chip label (shorter version) */
  chipLabel?: string;
}

export interface SortBottomSheetProps {
  /** Whether the sheet is visible */
  visible: boolean;
  /** Callback when the sheet should close */
  onClose: () => void;
  /** Current sort mode */
  sortMode: HabitSortMode;
  /** Callback when a sort mode is selected */
  onSelectSortMode: (mode: HabitSortMode) => void;
  /** Optional reduce motion preference */
  reduceMotion?: boolean;
}

export interface UseSortBottomSheetOptions {
  visible: boolean;
  reduceMotion: boolean;
  onClose: () => void;
  onSelectSortMode: (mode: HabitSortMode) => void;
}
