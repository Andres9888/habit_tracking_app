/**
 * GoalTabContent — Streak-target focused view for the Goal tab.
 * Wraps the simple streak hero in a theme-aware card.
 */
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import ErrorBoundary from '../../../components/ErrorBoundary';
import type { Habit } from '../../../features/habits/types';
import { useDetailPressAnimation } from '../../../hooks/useDetailPressAnimation';
import { colors as palette } from '../../../theme/colors';
import { durations, enterEasing } from '../../../theme/animations';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../theme/typography';
import { GoalAdjustSheet } from './GoalAdjustSheet';
import { GoalTabEmptyState } from './GoalTabEmptyState';
import { GoalWhyAnchor } from './GoalWhyAnchor';
import { SimpleStreakGoalHero } from './SimpleStreakGoalHero';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GoalTabContentProps {
  habit: Habit;
}

export function GoalTabContent({ habit }: GoalTabContentProps) {
  const { colors, isDark } = useThemeColors();
  const [adjustOpen, setAdjustOpen] = useState(false);
  const { animatedStyle, pressHandlers } = useDetailPressAnimation();
  const goalDuration = habit.goalDuration ?? 0;
  const hasGoal = goalDuration > 0;
  const currentStreak = habit.currentStreak ?? 0;
  const isGoalReached = hasGoal && currentStreak >= goalDuration;
  const tabEnter = FadeIn.duration(durations.standard).easing(enterEasing);
  const cardStyle = {
    ...shadows.card,
    backgroundColor: isDark ? colors.card : palette.light.surfaceMuted,
    borderColor: colors.border,
    borderWidth: 1,
  };

  if (!hasGoal) {
    return (
      <Animated.View
        className='overflow-hidden rounded-2xl'
        entering={tabEnter}
        style={cardStyle}
      >
        <View className='p-4'>
          <ErrorBoundary>
            <GoalTabEmptyState habitId={habit._id} />
          </ErrorBoundary>
        </View>
      </Animated.View>
    );
  }

  const habitColor = habit.color ?? habit.iconColor ?? colors.primary[700];
  const title = `Aiming for ${goalDuration} ${goalDuration === 1 ? 'day' : 'days'}`;

  return (
    <Animated.View
      className='overflow-hidden rounded-2xl'
      entering={tabEnter}
      style={cardStyle}
    >
      <View className='p-4'>
        <View className='mb-4 flex-row items-center justify-between'>
          <Text style={{ ...typography.heading3, color: colors.text.primary }}>
            {title}
          </Text>
          <AnimatedPressable
            accessibilityRole='button'
            style={[
              animatedStyle,
              isGoalReached
                ? {
                    backgroundColor: colors.primary[700],
                    borderRadius: borderRadius.full,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs + 2,
                  }
                : undefined,
            ]}
            onPress={() => setAdjustOpen(true)}
            onPressIn={pressHandlers.onPressIn}
            onPressOut={pressHandlers.onPressOut}
          >
            <Text
              style={{
                ...typography.bodySmall,
                color: isGoalReached ? colors.text.inverse : colors.primary[700],
                fontWeight: fontWeights.semibold,
              }}
            >
              Adjust
            </Text>
          </AnimatedPressable>
        </View>

        <ErrorBoundary>
          <GoalWhyAnchor habit={habit} />
          <SimpleStreakGoalHero
            currentStreak={currentStreak}
            habitColor={habitColor}
            streakGoal={goalDuration}
          />
          <GoalAdjustSheet
            currentGoal={goalDuration}
            habitId={habit._id}
            visible={adjustOpen}
            onClose={() => setAdjustOpen(false)}
          />
        </ErrorBoundary>
      </View>
    </Animated.View>
  );
}
