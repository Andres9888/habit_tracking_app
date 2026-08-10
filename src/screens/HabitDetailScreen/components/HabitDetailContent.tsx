/**
 * HabitDetailContent — hero wash → Progress → noticing → month → note.
 */
import { useCallback, useState } from 'react';
import {
  ScrollView,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import type { Habit } from '../../../features/habits/types';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import { useHabitInsights } from '../insights';
import { useInsightPalette } from '../insightPalette';
import { HabitDetailScrollBody } from './HabitDetailScrollBody';

const PIN_OFFSET = 96;

interface HabitDetailContentProps {
  completedDates: Set<string>;
  habit: Habit;
  isCompletedToday: boolean;
  isMinimalToday?: boolean;
  pendingToggleDate?: string | null;
  visible?: boolean;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  onMinimalToday: () => void;
  onEdit?: () => void;
  onPinnedChange?: (pinned: boolean) => void;
}

export function HabitDetailContent({
  completedDates,
  habit,
  isCompletedToday,
  isMinimalToday = false,
  pendingToggleDate = null,
  visible = true,
  onDayPress,
  onMinimalToday,
  onEdit,
  onPinnedChange,
}: HabitDetailContentProps) {
  const palette = useInsightPalette();
  const today = getLocalDateString();
  const [selectedNoteDate, setSelectedNoteDate] = useState(today);
  const wash = isCompletedToday
    ? palette.bandGradientDone
    : palette.bandGradient;
  const insights = useHabitInsights({
    daysOfWeek: habit.daysOfWeek,
    enabled: visible,
    habitCreatedAt: habit.createdAt,
    habitId: habit._id,
    reminderTime: habit.reminderTime,
  });

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onPinnedChange?.(event.nativeEvent.contentOffset.y > PIN_OFFSET);
    },
    [onPinnedChange]
  );

  const handleDayPress = useCallback(
    (date: string, isCompleted: boolean) => {
      setSelectedNoteDate(date);
      onDayPress(date, isCompleted);
    },
    [onDayPress]
  );

  return (
    <ScrollView
      bounces
      className='flex-1'
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: wash[0] }}
      onScroll={handleScroll}
    >
      <HabitDetailScrollBody
        habit={habit}
        insights={insights}
        isCompletedToday={isCompletedToday}
        isMinimalToday={isMinimalToday}
        noteDates={new Set([...completedDates, ...insights.doneDates])}
        pendingToggleDate={pendingToggleDate}
        selectedNoteDate={selectedNoteDate}
        today={today}
        washEnd={palette.bandGradient[2]}
        onDayPress={handleDayPress}
        onEdit={onEdit}
        onMinimalToday={onMinimalToday}
      />
    </ScrollView>
  );
}
