/**
 * HistoryMoreDisclosure — the pre-redesign surfaces, collapsed.
 *
 * The design's History frame is stats rail → year at a glance → month cards, and
 * nothing else. But the interactive calendar, the strength curve and the goal
 * card have no other route in the app, so rather than delete them they sit
 * behind one row here. History matches the design at rest; nothing is lost.
 */
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import ErrorBoundary from '../../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../../components/HabitStrengthSection';
import type { Habit } from '../../../../features/habits/types';
import { useProgressEmojis } from '../../../../hooks/useProgressEmojis';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';
import { durations, enterEasing } from '../../../../theme/animations';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';
import { CalendarTabContent } from '../CalendarTabContent';
import { GoalTabContent } from '../GoalTabContent';

interface HistoryMoreDisclosureProps {
  completedDates: Set<string>;
  habit: Habit;
  habitColor: string;
  palette: InsightPalette;
  pendingToggleDate?: string | null;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

export function HistoryMoreDisclosure({
  completedDates,
  habit,
  habitColor,
  palette,
  pendingToggleDate = null,
  onDayPress,
}: HistoryMoreDisclosureProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReduceMotion();
  const progressEmojis = useProgressEmojis(habit);

  return (
    <View style={{ gap: spacing.md }}>
      <Pressable
        accessibilityLabel='Calendar, strength and goal'
        accessibilityRole='button'
        accessibilityState={{ expanded: open }}
        style={{
          alignItems: 'center',
          borderColor: palette.cardBorder,
          borderRadius: borderRadius.large,
          borderWidth: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          minHeight: 48,
          paddingHorizontal: 18,
        }}
        onPress={() => setOpen((wasOpen) => !wasOpen)}
      >
        <Text
          style={{
            color: palette.textSecondary,
            fontSize: 13,
            fontWeight: fontWeights.semibold,
          }}
        >
          Calendar, strength and goal
        </Text>
        <Text style={{ color: palette.ctaGreen, fontSize: 13 }}>
          {open ? 'Hide' : 'Show'}
        </Text>
      </Pressable>

      {open ? (
        <Animated.View
          entering={
            reduceMotion
              ? undefined
              : FadeIn.duration(durations.standard).easing(enterEasing)
          }
          style={{ gap: spacing.md }}
        >
          <CalendarTabContent
            showYearSection={false}
            completedDates={completedDates}
            habit={habit}
            habitColor={habitColor}
            pendingToggleDate={pendingToggleDate}
            onDayPress={onDayPress}
          />
          {habit.createdAt ? (
            <ErrorBoundary>
              <HabitStrengthSection
                completedDates={completedDates}
                habitColor={habit.color ?? habit.iconColor}
                habitCreatedAt={habit.createdAt}
                habitId={habit._id}
                habitStrength={habit.strength}
                progressEmojis={progressEmojis}
              />
            </ErrorBoundary>
          ) : null}
          <GoalTabContent habit={habit} />
        </Animated.View>
      ) : null}
    </View>
  );
}
