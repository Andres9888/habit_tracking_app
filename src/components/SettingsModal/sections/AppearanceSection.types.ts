/** AppearanceSection prop contract */
import type { ReactNode } from 'react';
import type { DarkModePreference } from '../../../../convex/settings/types';

export interface AppearanceSectionProps {
  /** Active palette signal — round-trips through the parent's Convex query */
  highContrastMode: boolean;
  /** Optimistic setting value driving the High contrast switch position */
  highContrastEnabled: boolean;
  onChangeHighContrast: (value: boolean) => void | Promise<void>;
  darkModePreference: DarkModePreference;
  onChangeDarkModePreference: (
    value: DarkModePreference
  ) => void | Promise<void>;
  compactView: boolean;
  onChangeCompactView: (value: boolean) => void | Promise<void>;
  dayShape: 'circle' | 'square';
  onChangeDayShape: (value: 'circle' | 'square') => void | Promise<void>;
  showGradientFill: boolean;
  onChangeShowGradientFill: (value: boolean) => void | Promise<void>;
  showStreakConnections: boolean;
  onChangeShowStreakConnections: (value: boolean) => void | Promise<void>;
  habitCompletionIcon: 'chain' | 'checkbox';
  onChangeHabitCompletionIcon: (
    value: 'chain' | 'checkbox'
  ) => void | Promise<void>;
  icon?: ReactNode;
  isExpanded?: boolean;
  onToggleSection?: () => void;
}
