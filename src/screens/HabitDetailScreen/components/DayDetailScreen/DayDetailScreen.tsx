import { format } from 'date-fns';
import { Text, View } from 'react-native';
import type { Habit } from '../../../../features/habits/types';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { useHabitInsights } from '../../insights';
import { useInsightPalette } from '../../insightPalette';
import { FlowPage } from '../FlowPage';
import { FlowRow, FlowRowGroup } from '../FlowRow';
import { FlowSectionLabel } from '../FlowSectionLabel';
import {
  adjacentDay,
  dayRelativeLabel,
  dayStatusCopy,
  formatDayTitle,
} from './dayCopy';
import { DayStatusCard } from './DayStatusCard';
import { DayStepper } from './DayStepper';

interface DayDetailScreenProps {
  focusDate?: string;
  habit: Habit;
  pendingToggleDate?: string | null;
  onOpenDay: (date: string) => void;
  onToggleDay: (date: string, isCompleted: boolean) => void;
}

export function DayDetailScreen({
  focusDate,
  habit,
  pendingToggleDate = null,
  onOpenDay,
  onToggleDay,
}: DayDetailScreenProps) {
  const palette = useInsightPalette();
  const today = getLocalDateString();
  const date = focusDate && focusDate <= today ? focusDate : today;
  const insights = useHabitInsights({
    daysOfWeek: habit.daysOfWeek,
    habitCreatedAt: habit.createdAt,
    habitId: habit._id,
  });
  const done = insights.doneDates.has(date);
  const isToday = date === today;
  const timeLabel =
    isToday && insights.todayCompletedAt
      ? format(new Date(insights.todayCompletedAt), 'h:mm a')
      : undefined;
  const status = dayStatusCopy(done, isToday, timeLabel);
  const earliest = habit.createdAt
    ? getLocalDateString(new Date(habit.createdAt))
    : `${today.slice(0, 4)}-01-01`;

  return (
    <FlowPage footnote='Edits are saved to your history and change the numbers you see on Analytics. Notes for a single day are not stored yet — the habit note lives on History.'>
      <View>
        <Text
          style={{
            color: palette.textPrimary,
            fontFamily: fontFamilies.primary.display,
            fontSize: 26,
            fontWeight: fontWeights.semibold,
          }}
        >
          {formatDayTitle(date)}
        </Text>
        <Text
          style={{ color: palette.textSecondary, fontSize: 14, marginTop: 4 }}
        >
          {dayRelativeLabel(date, today)}
        </Text>
      </View>
      <DayStatusCard
        done={done}
        subtitle={status.subtitle}
        title={status.title}
      />
      <FlowSectionLabel>Correct this day</FlowSectionLabel>
      <FlowRowGroup>
        <FlowRow
          accessibilityHint='Toggles whether this day is logged'
          subtitle='This updates History and Analytics.'
          title={done ? 'Undo completion' : 'Mark as completed'}
          onPress={() => {
            if (pendingToggleDate === date) return;
            onToggleDay(date, done);
          }}
        />
      </FlowRowGroup>
      <DayStepper
        nextDate={adjacentDay(date, 1, earliest, today)}
        prevDate={adjacentDay(date, -1, earliest, today)}
        onStep={onOpenDay}
      />
    </FlowPage>
  );
}
