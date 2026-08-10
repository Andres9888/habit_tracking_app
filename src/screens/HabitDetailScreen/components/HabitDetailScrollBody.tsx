/** Scroll body for HabitDetailContent — keeps the parent under max-lines. */
import { format } from 'date-fns';
import { View } from 'react-native';
import type { Habit } from '../../../features/habits/types';
import type { HabitInsights } from '../insights';
import { isMissedYesterday } from '../insights';
import { DetailHeroBanner } from './DetailHeroBanner';
import { HabitDetailSections } from './HabitDetailSections';

interface HabitDetailScrollBodyProps {
  habit: Habit;
  insights: HabitInsights;
  isCompletedToday: boolean;
  isMinimalToday: boolean;
  noteDates: Set<string>;
  pendingToggleDate: string | null;
  selectedNoteDate: string;
  today: string;
  washEnd: string;
  onDayPress: (date: string, isCompleted: boolean) => void;
  onEdit?: () => void;
  onMinimalToday: () => void;
}

export function HabitDetailScrollBody({
  habit,
  insights,
  isCompletedToday,
  isMinimalToday,
  noteDates,
  onDayPress,
  onEdit,
  onMinimalToday,
  pendingToggleDate,
  selectedNoteDate,
  today,
  washEnd,
}: HabitDetailScrollBodyProps) {
  return (
    <>
      <DetailHeroBanner
        completedAtLabel={
          insights.todayCompletedAt
            ? format(new Date(insights.todayCompletedAt), 'h:mm a')
            : undefined
        }
        daysDone={insights.yearCompletions}
        habit={habit}
        isCompletedToday={isCompletedToday}
        isMinimalToday={isMinimalToday}
        isMissedYesterday={isMissedYesterday({
          completedDates: insights.doneDates,
          daysOfWeek: habit.daysOfWeek,
          isCompletedToday,
        })}
        isToggling={pendingToggleDate === today}
        todayNote={insights.notesByDate[today]}
        onDayPress={onDayPress}
        onMinimalToday={onMinimalToday}
      />
      <View style={{ backgroundColor: washEnd }}>
        <HabitDetailSections
          completedDates={noteDates}
          habit={habit}
          insights={insights}
          isCompletedToday={isCompletedToday}
          pendingToggleDate={pendingToggleDate}
          selectedNoteDate={selectedNoteDate}
          onDayPress={onDayPress}
          onEdit={onEdit}
        />
      </View>
    </>
  );
}
