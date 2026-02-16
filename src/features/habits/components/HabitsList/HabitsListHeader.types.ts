/**
 * HabitsListHeader Types — props accepted by the memoised header component.
 *
 * Animated values are passed as `Animated.Value` refs so the header can
 * participate in the parent's staggered entrance sequence without owning
 * the animation lifecycle.
 */

import type { Animated } from 'react-native';

export interface HabitsListHeaderProps {
  habits: Array<{ _id: string }>;
  weekDateStrings: string[];
  weekDates: Date[];
  canNavigateForward: boolean;
  isPremiumUser: boolean;
  justCreatedHabitId: string | null;
  reduceMotionPreference: boolean;
  showWeekCompletionBar: boolean;
  headerOpacity: Animated.Value;
  headerTranslateY: Animated.Value;
  calendarOpacity: Animated.Value;
  calendarTranslateY: Animated.Value;
  searchQuery: string;
  showSearchBar: boolean;
  getHabitStatus: (habitId: string, dateString: string) => string;
  onAddHabitPress: () => void;
  onClearSearch: () => void;
  onDayPress: (date: Date) => void;
  onNextWeek: () => void;
  onPreviousWeek: () => void;
  onOpenSortSheet: () => void;
  onSearchChange: (query: string) => void;
  onUpgradePress: () => void;
  openSettings: () => void;
  openTemplatesScreen: () => void;
}
