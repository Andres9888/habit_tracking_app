/**
 * GoalTabContent — Streak-target focused view for the Goal tab.
 * Wraps the simple streak hero in a theme-aware card.
 */
import { useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import ErrorBoundary from '../../../components/ErrorBoundary';
import type { Habit } from '../../../features/habits/types';
import { colors as palette } from '../../../theme/colors';
import { durations, enterEasing } from '../../../theme/animations';
import { shadows } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography } from '../../../theme/typography';
import { GoalAdjustButton } from './GoalAdjustButton';
import { GoalAdjustSheet } from './GoalAdjustSheet';
import { GoalTabEmptyState } from './GoalTabEmptyState';
import { GoalWhyAnchor } from './GoalWhyAnchor';
import { readableHabitAccent } from './goalColorUtils';
import { SimpleStreakGoalHero } from './SimpleStreakGoalHero';

interface GoalTabContentProps {
  habit: Habit;
}

export function GoalTabContent({ habit }: GoalTabContentProps) {
  const { colors, isDark } = useThemeColors();
  const [adjustOpen, setAdjustOpen] = useState(false);
  const goalDuration = habit.goalDuration ?? 0;
  const hasGoal = goalDuration > 0;
  const currentStreak = habit.currentStreak ?? 0;
  const tabEnter = FadeIn.duration(durations.standard).easing(enterEasing);
  const cardStyle = {
    ...shadows.subtle,
    backgroundColor: isDark ? colors.card : palette.light.cardElevated,
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
  const controlAccent = readableHabitAccent(
    habitColor,
    colors.card,
    colors.primary[700]
  );
  return (
    <Animated.View
      className='overflow-hidden rounded-2xl'
      entering={tabEnter}
      style={cardStyle}
    >
      <View className='p-4'>
        <View className='mb-3 flex-row items-center justify-between'>
          <Text style={{ ...typography.overline, color: controlAccent }}>
            Streak goal
          </Text>
          <GoalAdjustButton
            accent={controlAccent}
            onPress={() => setAdjustOpen(true)}
          />
        </View>

        <ErrorBoundary>
          <GoalWhyAnchor habit={habit} />
          <SimpleStreakGoalHero
            bestStreak={habit.bestStreak ?? 0}
            currentStreak={currentStreak}
            habitColor={habitColor}
            streakGoal={goalDuration}
            onExtend={() => setAdjustOpen(true)}
          />
          <GoalAdjustSheet
            currentGoal={goalDuration}
            currentStreak={currentStreak}
            habitColor={habitColor}
            habitId={habit._id}
            visible={adjustOpen}
            onClose={() => setAdjustOpen(false)}
          />
        </ErrorBoundary>
      </View>
    </Animated.View>
  );
}
