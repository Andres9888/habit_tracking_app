/**
 * GoalTabContent — Motivation-first composition around StreakGoalCard.
 * Adds: WhyAnchor (above), CoachLine (below hero), Adjust sheet + trigger.
 */
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { StreakGoalCard } from '../../../components/ProgressSectionConsolidated/StreakGoalCard';
import type { Habit } from '../../../features/habits/types';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../theme/typography';
import { GoalTabEmptyState } from './GoalTabEmptyState';
import { GoalWhyAnchor } from './GoalWhyAnchor';
import { GoalCoachLine } from './GoalCoachLine';
import { GoalAdjustSheet } from './GoalAdjustSheet';

interface GoalTabContentProps {
  habit: Habit;
  completionRate: number;
}

export function GoalTabContent({ habit, completionRate }: GoalTabContentProps) {
  const { colors } = useThemeColors();
  const [adjustOpen, setAdjustOpen] = useState(false);
  const hasGoal = (habit.goalDuration ?? 0) > 0;

  if (!hasGoal) {
    return (
      <Animated.View entering={FadeInDown.duration(300).easing(Easing.out(Easing.cubic))}>
        <ErrorBoundary>
          <GoalTabEmptyState habitId={habit._id} />
        </ErrorBoundary>
      </Animated.View>
    );
  }

  const currentStreak = habit.currentStreak ?? 0;
  const bestStreak = habit.bestStreak ?? currentStreak;
  const goalDuration = habit.goalDuration ?? 0;

  return (
    <Animated.View
      className='px-5'
      entering={FadeInDown.duration(300).easing(Easing.out(Easing.cubic))}
    >
      <ErrorBoundary>
        <GoalWhyAnchor habit={habit} />

        <StreakGoalCard
          bestStreak={bestStreak}
          completionRate={completionRate}
          currentStreak={currentStreak}
          streakGoal={goalDuration}
        />

        <GoalCoachLine
          bestStreak={bestStreak}
          currentStreak={currentStreak}
          streakGoal={goalDuration}
        />

        <View className='items-center pt-3'>
          <Pressable
            accessibilityRole='button'
            className='px-4 py-2'
            onPress={() => setAdjustOpen(true)}
          >
            <Text
              style={{
                ...typography.bodySmall,
                color: colors.text.secondary,
                fontWeight: fontWeights.semibold,
                textDecorationLine: 'underline',
              }}
            >
              Adjust goal
            </Text>
          </Pressable>
        </View>

        <GoalAdjustSheet
          currentGoal={goalDuration}
          habitId={habit._id}
          visible={adjustOpen}
          onClose={() => setAdjustOpen(false)}
        />
      </ErrorBoundary>
    </Animated.View>
  );
}
