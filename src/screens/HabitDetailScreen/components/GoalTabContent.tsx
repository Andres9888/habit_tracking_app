/* eslint-disable max-lines -- goal summary, Why, and adjust sheet share one state */
/** GoalTabContent - Compact day-goal summary + Why, secondary to history. */
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import ErrorBoundary from '../../../components/ErrorBoundary';
import type { Habit } from '../../../features/habits/types';
import { useThemeColors } from '../../../theme';
import { durations, enterEasing } from '../../../theme/animations';
import { colors as palette, withAlpha } from '../../../theme/colors';
import { borderRadius, spacing } from '../../../theme/spacing';
import {
  fontFamilies,
  fontWeights,
  typography,
} from '../../../theme/typography';
import { GoalAdjustSheet } from './GoalAdjustSheet';
import { GoalTabEmptyState } from './GoalTabEmptyState';
import { useResolveWhy } from './GoalWhyAnchor/GoalWhyAnchor.hooks';

interface GoalTabContentProps {
  completedDates: Set<string>;
  habit: Habit;
}

export function GoalTabContent({ completedDates, habit }: GoalTabContentProps) {
  const { colors, isDark } = useThemeColors();
  const [adjustOpen, setAdjustOpen] = useState(false);
  const goalDuration = habit.goalDuration ?? 0;
  const hasGoal = goalDuration > 0;
  const resolvedWhy = useResolveWhy(habit);
  const current = Math.min(completedDates.size, goalDuration);
  const remaining = Math.max(0, goalDuration - current);
  const habitColor = habit.color ?? habit.iconColor ?? colors.primary[700];
  const surface = isDark ? colors.card : colors.surface;

  if (!hasGoal) {
    return (
      <Animated.View
        entering={FadeIn.duration(durations.standard).easing(enterEasing)}
        style={{
          backgroundColor: isDark ? colors.card : palette.light.cardElevated,
          borderColor: colors.border,
          borderRadius: borderRadius.large,
          borderWidth: 1,
          overflow: 'hidden',
          padding: spacing.base,
        }}
      >
        <ErrorBoundary>
          <GoalTabEmptyState habitId={habit._id} />
        </ErrorBoundary>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeIn.duration(durations.standard).easing(enterEasing)}
      style={{
        backgroundColor: surface,
        borderColor: colors.border,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        overflow: 'hidden',
      }}
    >
      <Pressable
        accessibilityLabel={`Day goal, ${current} of ${goalDuration} days, adjust`}
        accessibilityRole='button'
        className='flex-row items-end'
        style={{
          gap: spacing.md,
          paddingHorizontal: spacing.base,
          paddingTop: spacing.base,
        }}
        onPress={() => setAdjustOpen(true)}
      >
        <View className='flex-1'>
          <Text
            style={{
              ...typography.overline,
              color: colors.text.tertiary,
              fontWeight: fontWeights.bold,
            }}
          >
            Day goal
          </Text>
          <View className='mt-1 flex-row items-baseline' style={{ gap: 5 }}>
            <Text
              style={{
                color: colors.text.primary,
                fontFamily: fontFamilies.primary.display,
                fontSize: 26,
                fontWeight: fontWeights.bold,
                letterSpacing: -0.6,
              }}
            >
              {current}
            </Text>
            <Text style={{ ...typography.body, color: colors.text.secondary }}>
              /
            </Text>
            <Text
              style={{
                color: colors.text.primary,
                fontFamily: fontFamilies.primary.display,
                fontSize: 20,
                fontWeight: fontWeights.semibold,
              }}
            >
              {goalDuration}
            </Text>
            <Text
              style={{
                ...typography.bodySmall,
                color: colors.text.secondary,
                fontWeight: fontWeights.semibold,
              }}
            >
              days
            </Text>
          </View>
        </View>
        <Text
          style={{
            ...typography.bodySmall,
            color: colors.text.secondary,
            fontWeight: fontWeights.semibold,
            paddingBottom: 5,
          }}
        >
          {remaining === 0 ? 'Goal met' : `${remaining} to go`}
        </Text>
        <ChevronDown
          color={colors.text.secondary}
          size={18}
          style={{ marginBottom: 6 }}
        />
      </Pressable>

      <Text
        style={{
          ...typography.caption,
          color: colors.text.tertiary,
          fontWeight: fontWeights.semibold,
          paddingHorizontal: spacing.base,
          paddingTop: spacing.xs,
        }}
      >
        {goalDuration}-day aim · done days from calendar, not a streak clock
      </Text>

      {resolvedWhy ? (
        <View
          style={{
            backgroundColor: withAlpha(habitColor, isDark ? 0.14 : 0.08),
            borderColor: withAlpha(habitColor, 0.2),
            borderRadius: borderRadius.medium,
            borderWidth: 1,
            margin: spacing.base,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
          }}
        >
          <Text
            style={{
              ...typography.overline,
              color: colors.primary[700],
              fontSize: 11,
              fontWeight: fontWeights.bold,
            }}
          >
            Why
          </Text>
          <Text
            style={{
              ...typography.bodySmall,
              color: colors.text.secondary,
              lineHeight: 21,
              marginTop: spacing.xs,
            }}
          >
            {resolvedWhy.value}
          </Text>
        </View>
      ) : (
        <View style={{ height: spacing.base }} />
      )}

      <GoalAdjustSheet
        currentGoal={goalDuration}
        currentStreak={current}
        habitColor={habitColor}
        habitId={habit._id}
        visible={adjustOpen}
        onClose={() => setAdjustOpen(false)}
      />
    </Animated.View>
  );
}
