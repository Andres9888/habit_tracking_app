/* eslint-disable max-lines */
import { Text, View } from 'react-native';
import { getHabitDayState } from '../../../../features/habits/habitDayState';
import type { Habit } from '../../../../features/habits/types';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { useHabitTrackingRange } from '../../insights';
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
  // Query this exact day rather than reading the insights window: that window
  // is a rolling 400 days, so an older day would read as never completed and
  // the correction rows below would toggle away a real completion.
  const rows = useHabitTrackingRange({
    endDate: date,
    habitId: habit._id,
    startDate: date,
  });
  const row = rows?.find((entry) => entry.date === date);
  const done = Boolean(row?.completed);
  const isToday = date === today;
  const dayState = getHabitDayState({
    completed: done,
    createdAt: habit.createdAt,
    date,
    daysOfWeek: habit.daysOfWeek,
    pausedAt: habit.pausedAt,
    resumedAt: habit.resumedAt,
    today,
  });
  const timeLabel =
    isToday && done && row
      ? new Date(row._creationTime).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })
      : undefined;
  const status = dayStatusCopy(dayState, timeLabel);
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
