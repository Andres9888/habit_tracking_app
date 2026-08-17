/* eslint-disable max-lines */
import { Text, View } from 'react-native';
import type { Habit } from '../../../../features/habits/types';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { useHabitInsights } from '../../insights';
import { useInsightPalette } from '../../insightPalette';
import { FlowPage } from '../FlowPage';
import { FlowSectionLabel } from '../FlowSectionLabel';
import {
  adjacentDay,
  dayRelativeLabel,
  dayStatusCopy,
  formatDayTitle,
} from './dayCopy';
import { DayCorrectRows } from './DayCorrectRows';
import { DayNoteCard } from './DayNoteCard';
import { DayStatusCard } from './DayStatusCard';
import { DayStepper } from './DayStepper';

interface DayDetailScreenProps {
  focusDate?: string;
  habit: Habit;
  note?: string;
  pendingToggleDate?: string | null;
  onOpenDay: (date: string) => void;
  onOpenNote: () => void;
  onToggleDay: (date: string, isCompleted: boolean) => void;
}

export function DayDetailScreen({
  focusDate,
  habit,
  note = '',
  pendingToggleDate = null,
  onOpenDay,
  onOpenNote,
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
      ? new Date(insights.todayCompletedAt).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })
      : undefined;
  const status = dayStatusCopy(done, isToday, timeLabel);
  const earliest = habit.createdAt
    ? getLocalDateString(new Date(habit.createdAt))
    : `${today.slice(0, 4)}-01-01`;

  return (
    <FlowPage footnote='Edits are saved to your history and change the numbers you see on Analytics.'>
      <View>
        <Text
          style={{
            color: palette.textPrimary,
            fontFamily: fontFamilies.primary.display,
            fontSize: 26,
            fontWeight: fontWeights.medium,
            letterSpacing: -0.4,
          }}
        >
          {formatDayTitle(date)}
        </Text>
        <Text
          style={{ color: palette.textTertiary, fontSize: 13, marginTop: 6 }}
        >
          {dayRelativeLabel(date, today)}
        </Text>
      </View>
      <DayStatusCard
        done={done}
        subtitle={status.subtitle}
        title={status.title}
      />
      <DayNoteCard note={note} />
      <FlowSectionLabel>Correct this day</FlowSectionLabel>
      <DayCorrectRows
        done={done}
        hasNote={Boolean(note)}
        onOpenNote={onOpenNote}
        onToggle={() => {
          if (pendingToggleDate === date) return;
          onToggleDay(date, done);
        }}
      />
      <DayStepper
        nextDate={adjacentDay(date, 1, earliest, today)}
        prevDate={adjacentDay(date, -1, earliest, today)}
        onStep={onOpenDay}
      />
    </FlowPage>
  );
}
