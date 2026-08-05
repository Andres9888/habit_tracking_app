/**
 * HabitDetailContent — the redesigned detail stack (Claude Design, "Habit Flow
 * Prototype" in project "Habit insights page redesign"):
 *
 *   hero wash → Progress → What we're noticing → Your month → note → pause
 *
 * Insight-first rather than data-first: the raw calendar, strength curve and
 * goal card live behind "View history ›" (see HabitDetailHistory).
 */
import { useCallback } from 'react';
import {
  ScrollView,
  View,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { format } from 'date-fns';
import type { Habit } from '../../../features/habits/types';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import { useHabitInsights } from '../insights';
import { useInsightPalette } from '../insightPalette';
import { DetailHeroBanner } from './DetailHeroBanner';
import { HabitDetailSections } from './HabitDetailSections';

/** Scroll depth at which the header swaps to the pinned habit title. */
const PIN_OFFSET = 96;

interface HabitDetailContentProps {
  completedDates: Set<string>;
  habit: Habit;
  isCompletedToday: boolean;
  pendingToggleDate?: string | null;
  visible?: boolean;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  onEdit?: () => void;
  onPinnedChange?: (pinned: boolean) => void;
}

export function HabitDetailContent({
  completedDates,
  habit,
  isCompletedToday,
  pendingToggleDate = null,
  visible = true,
  onDayPress,
  onEdit,
  onPinnedChange,
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
        completedAtLabel={
          insights.todayCompletedAt
            ? format(new Date(insights.todayCompletedAt), 'h:mm a')
            : undefined
        }
        habit={habit}
        isCompletedToday={isCompletedToday}
        isToggling={pendingToggleDate === getLocalDateString()}
        onDayPress={onDayPress}
      />
      <View style={{ backgroundColor: palette.bandGradient[2] }}>
        <HabitDetailSections
          completedDates={completedDates}
          habit={habit}
          insights={insights}
          isCompletedToday={isCompletedToday}
          pendingToggleDate={pendingToggleDate}
          onDayPress={onDayPress}
          onEdit={onEdit}
        />
      </View>
    </ScrollView>
  );
}
