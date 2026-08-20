/**
 * HabitDetailContent — recommitment surface:
 *   current state/action → strength snapshot → week → record doors → insight
 */
import { useCallback, useMemo } from 'react';
import {
  ScrollView,
  View,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import type { Habit } from '../../../features/habits/types';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import {
  isScheduledWeekday,
  missedLastScheduledDate,
  parseLocalDate,
  recoveryMissedDayLabel,
  scheduledWeekdays,
  useHabitInsights,
} from '../insights';
import { useInsightPalette } from '../insightPalette';
import type { InsightId } from '../useDetailFlow';
import { DetailHeroBanner } from './DetailHeroBanner';
import { HabitDetailSections } from './HabitDetailSections';

/** Pin only after the hero name has left — avoids two titles on screen. */
const PIN_OFFSET = 160;

interface HabitDetailContentProps {
  completedDates: Set<string>;
  habit: Habit;
  isCompletedToday: boolean;
  pendingToggleDate?: string | null;
  visible?: boolean;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  onOpenAnalytics?: () => void;
  onOpenDay?: (date: string) => void;
  onOpenHistory?: () => void;
  onOpenInsight?: (id: InsightId) => void;
  onOpenNote?: () => void;
  onPinnedChange?: (pinned: boolean) => void;
  todayNote?: string;
}

export function HabitDetailContent({
  completedDates,
  habit,
  isCompletedToday,
  pendingToggleDate = null,
  visible = true,
  onDayPress,
  onOpenAnalytics,
  onOpenDay,
  onOpenHistory,
  onOpenInsight,
  onOpenNote,
  onPinnedChange,
  todayNote,
}: HabitDetailContentProps) {
  const palette = useInsightPalette();
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
  const today = getLocalDateString();
  const effectiveCompletedDates = useMemo(() => {
    const merged = new Set([...completedDates, ...insights.doneDates]);
    if (isCompletedToday) merged.add(today);
    else merged.delete(today);
    return merged;
  }, [completedDates, insights.doneDates, isCompletedToday, today]);
  const isScheduledToday = isScheduledWeekday(
    scheduledWeekdays({ daysOfWeek: habit.daysOfWeek }),
    parseLocalDate(today).getDay()
  );
  const missedScheduledDate = missedLastScheduledDate({
    completedDates: effectiveCompletedDates,
    daysOfWeek: habit.daysOfWeek,
    isCompletedToday,
    today,
  });

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onPinnedChange?.(event.nativeEvent.contentOffset.y > PIN_OFFSET);
    },
    [onPinnedChange]
  );

  return (
    // The ScrollView takes the hero's FIRST gradient stop, and the sections
    // below take the page background. Without this, bouncing at the top exposes
    // the background behind the tinted hero — the seam that
    // FullsizeTemplatePreview/components/PreviewContent.tsx:29-30 warns about.
    // This is also why every band stop must be opaque hex, never withAlpha:
    // the header tint, hero stop 0 and this overscroll tint all read wash[0].
    <ScrollView
      bounces
      className='flex-1'
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: wash[0] }}
      onScroll={handleScroll}
    >
      <DetailHeroBanner
        habit={habit}
        isCompletedToday={isCompletedToday}
        isScheduledToday={isScheduledToday}
        isToggling={pendingToggleDate === today}
        recoveryDayLabel={
          missedScheduledDate
            ? recoveryMissedDayLabel(missedScheduledDate, today)
            : undefined
        }
        todayNote={todayNote}
        onDayPress={onDayPress}
        onOpenNote={onOpenNote ?? (() => {})}
      />
      <View style={{ backgroundColor: palette.bandGradient[2] }}>
        <HabitDetailSections
          completedDates={effectiveCompletedDates}
          habit={habit}
          insights={insights}
          onDayPress={onDayPress}
          onOpenAnalytics={onOpenAnalytics ?? (() => {})}
          onOpenDay={onOpenDay ?? (() => {})}
          onOpenHistory={onOpenHistory ?? (() => {})}
          onOpenInsight={onOpenInsight ?? (() => {})}
        />
      </View>
    </ScrollView>
  );
}
