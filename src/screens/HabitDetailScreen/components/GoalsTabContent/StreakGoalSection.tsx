/**
 * StreakGoalSection — Streak-target card (header + StreakGoalCard + coach line + adjust sheet).
 * Extracted from the former GoalTabContent so it can sit alongside time goals
 * inside the consolidated GoalsTabContent.
 */
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { StreakGoalCard } from '../../../../components/ProgressSectionConsolidated/StreakGoalCard';
import { shadows } from '../../../../theme/spacing';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../../theme/typography';
import { GoalAdjustSheet } from '../GoalAdjustSheet';
import { GoalCoachLine } from '../GoalCoachLine';
import { GoalTabEmptyState } from '../GoalTabEmptyState';
import type { StreakGoalSectionProps } from './GoalsTabContent.types';

export function StreakGoalSection({ habit, completionRate }: StreakGoalSectionProps) {
  const { colors } = useThemeColors();
  const [adjustOpen, setAdjustOpen] = useState(false);
  const hasGoal = (habit.goalDuration ?? 0) > 0;
  const cardStyle = { ...shadows.card, backgroundColor: colors.card };

  if (!hasGoal) {
    return (
      <Animated.View
        className='overflow-hidden rounded-2xl shadow-sm'
        entering={FadeIn.duration(180)}
        style={cardStyle}
      >
        <View className='p-5'>
          <GoalTabEmptyState habitId={habit._id} />
        </View>
      </Animated.View>
    );
  }

  const currentStreak = habit.currentStreak ?? 0;
  const bestStreak = habit.bestStreak ?? currentStreak;
  const goalDuration = habit.goalDuration ?? 0;

  return (
    <Animated.View
      className='overflow-hidden rounded-2xl shadow-sm'
      entering={FadeIn.duration(180)}
      style={cardStyle}
    >
      <View className='p-5'>
        <View className='mb-4 flex-row items-center justify-between'>
          <Text style={{ ...typography.heading3, color: colors.text.primary }}>
            Streak goal
          </Text>
          <Pressable accessibilityRole='button' onPress={() => setAdjustOpen(true)}>
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
        <GoalAdjustSheet
          currentGoal={goalDuration}
          habitId={habit._id}
          visible={adjustOpen}
          onClose={() => setAdjustOpen(false)}
        />
      </View>
    </Animated.View>
  );
}
