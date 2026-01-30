import type { SharedValue } from 'react-native-reanimated';

export interface HabitsHeaderProps {
  completedToday?: number;
  /** Force show header even when totalHabits is 0 (used during empty->list transition) */
  forceShow?: boolean;
  /** Whether user has premium subscription */
  isPremiumUser?: boolean;
  openCreateHabitScreen: () => void;
  openSettings: () => void;
  openSortSheet: () => void;
  openTemplatesScreen: () => void;
  /** Called when user taps PRO badge to upgrade */
  onUpgradePress?: () => void;
  reduceMotion?: boolean;
  showCompletionSummary?: boolean;
  totalHabits?: number;
}

export interface HeaderAnimations {
  addButtonScale: SharedValue<number>;
  addButtonAnimatedStyle: { transform: { scale: number }[] };
  sortButtonScale: SharedValue<number>;
  sortButtonAnimatedStyle: { transform: { scale: number }[] };
  templatesButtonScale: SharedValue<number>;
  templatesButtonAnimatedStyle: { transform: { scale: number }[] };
  settingsButtonScale: SharedValue<number>;
  settingsButtonAnimatedStyle: { transform: { scale: number }[] };
}

export interface HeaderHandlers {
  handleAddHabitPressIn: () => void;
  handleAddHabitPressOut: () => void;
  handleAddHabitPress: () => void;
  handleSortPressIn: () => void;
  handleSortPressOut: () => void;
  handleSortPress: () => void;
  handleTemplatesPressIn: () => void;
  handleTemplatesPressOut: () => void;
  handleTemplatesPress: () => void;
  handleSettingsPressIn: () => void;
  handleSettingsPressOut: () => void;
  handleSettingsPress: () => void;
}
