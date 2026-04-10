import type { LucideIcon } from 'lucide-react-native';

import type { HabitSortMode } from '../../types';

/** Card-based sort category with optional direction toggle */
export interface SortCardConfig {
  label: string;
  description: string;
  Icon: LucideIcon;
  iconBgColors: [string, string];
  /** Single mode (manual) or asc/desc pair */
  mode: HabitSortMode;
  /** If present, this card has a direction toggle */
  altMode?: HabitSortMode;
  ascLabel?: string;
  descLabel?: string;
}

export interface SortBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  sortMode: HabitSortMode;
  onSelectSortMode: (mode: HabitSortMode) => void;
  reduceMotion?: boolean;
}
