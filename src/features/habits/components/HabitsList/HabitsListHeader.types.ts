/**
 * HabitsListHeader Types — props accepted by the memoised header component.
 *
 * Animated values are passed as `Animated.Value` refs so the header can
 * participate in the parent's staggered entrance sequence without owning
 * the animation lifecycle.
 *
 * Action callbacks (settings, templates, sort, add) have moved to BottomActionBar.
 */

import type { Animated } from 'react-native';

export interface HabitsListHeaderProps {
  habits: Array<{ _id: string }>;
  weekDateStrings: string[];
  weekDates: Date[];
  canNavigateForward: boolean;
  justCreatedHabitId: string | null;
  reduceMotionPreference: boolean;
  headerOpacity: Animated.Value;
  headerTranslateY: Animated.Value;
  calendarOpacity: Animated.Value;
  calendarTranslateY: Animated.Value;
  getHabitStatus: (habitId: string, dateString: string) => string;
  getStreak: (habitId: string) => number;
  onDayPress: (date: Date) => void;
  onJumpToToday: () => void;
  onNextWeek: () => void;
  onPreviousWeek: () => void;
  onUpgradePress: () => void;
}
