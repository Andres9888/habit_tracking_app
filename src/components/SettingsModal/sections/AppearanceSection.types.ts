/** AppearanceSection prop contract */
import type { ReactNode } from 'react';
import type { DarkModePreference } from '../../../../convex/settings/types';

export interface AppearanceSectionProps {
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
}
