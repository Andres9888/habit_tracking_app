/**
 * HabitsListHeader Types — props accepted by the memoised header component.
 *
 * Animated values are passed as Reanimated shared values so the header can
 * participate in the parent's staggered entrance sequence without owning
 * the animation lifecycle.
 *
 * Action callbacks (settings, templates, sort, add) have moved to BottomActionBar.
 */

import type { SharedValue } from 'react-native-reanimated';
import type { DayCompletionStatus } from '../../../../components/CalendarTimeline';

export interface HabitsListHeaderProps {
  averageStrengthPercent: number;
  completedToday: number;
  completionByDay: Record<string, DayCompletionStatus>;
  weekDateStrings: string[];
  weekDates: Date[];
  canNavigateForward: boolean;
  currentStreak: number;
  justCreatedHabitId: string | null;
  reduceMotionPreference: boolean;
  completionIcon?: 'chain' | 'checkbox';
  headerOpacity: SharedValue<number>;
  headerTranslateY: SharedValue<number>;
  calendarOpacity: SharedValue<number>;
  calendarTranslateY: SharedValue<number>;
  totalHabits: number;
  onDayPress: (date: Date) => void;
  onJumpToToday: () => void;
  onNextWeek: () => void;
  onPreviousWeek: () => void;
  onUpgradePress: () => void;
  compactView?: boolean;
}
