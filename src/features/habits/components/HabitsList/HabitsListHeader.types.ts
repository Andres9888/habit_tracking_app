/**
 * HabitsListHeader Types
 */

import type { SharedValue } from 'react-native-reanimated';

export interface HabitsListHeaderProps {
  habits: Array<{ _id: string }>;
  weekDateStrings: string[];
  weekDates: Date[];
  canNavigateForward: boolean;
  isPremiumUser: boolean;
  justCreatedHabitId: string | null;
  reduceMotionPreference: boolean;
  showWeekCompletionBar: boolean;
  headerOpacity: SharedValue<number>;
  headerTranslateY: SharedValue<number>;
  calendarOpacity: SharedValue<number>;
  calendarTranslateY: SharedValue<number>;
  getHabitStatus: (habitId: string, dateString: string) => string;
  onAddHabitPress: () => void;
  onDayPress: (date: Date) => void;
  onNextWeek: () => void;
  onPreviousWeek: () => void;
  onOpenSortSheet: () => void;
  onUpgradePress: () => void;
  openSettings: () => void;
  openTemplatesScreen: () => void;
}
