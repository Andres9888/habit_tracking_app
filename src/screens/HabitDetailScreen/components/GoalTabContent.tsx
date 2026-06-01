/**
 * GoalTabContent — Streak-target focused view for the Goal tab.
 * Wraps the simple streak hero in a theme-aware card.
 */
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import ErrorBoundary from '../../../components/ErrorBoundary';
import type { Habit } from '../../../features/habits/types';
import { colors as palette } from '../../../theme/colors';
import { shadows } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../theme/typography';
import { GoalAdjustSheet } from './GoalAdjustSheet';
import { GoalTabEmptyState } from './GoalTabEmptyState';
import { GoalWhyAnchor } from './GoalWhyAnchor';
import { SimpleStreakGoalHero } from './SimpleStreakGoalHero';

interface GoalTabContentProps {
  habit: Habit;
}

export function GoalTabContent({ habit }: GoalTabContentProps) {
  const { colors, isDark } = useThemeColors();
  const [adjustOpen, setAdjustOpen] = useState(false);
  const goalDuration = habit.goalDuration ?? 0;
  const hasGoal = goalDuration > 0;
  // Warm near-white card surface — same surface as the home HabitCard
  // (colors.light.surfaceMuted). Keep the theme card token in dark mode.
  const cardStyle = { ...shadows.card, backgroundColor: isDark ? colors.card : palette.light.surfaceMuted };

  if (!hasGoal) {
    return (
      <Animated.View
        className='overflow-hidden rounded-2xl shadow-sm'
        entering={FadeIn.duration(180)}
        style={cardStyle}
      >
        <View className='p-5'>
          <ErrorBoundary>
            <GoalTabEmptyState habitId={habit._id} />
          </ErrorBoundary>
        </View>
      </Animated.View>
    );
  }

  const currentStreak = habit.currentStreak ?? 0;
  const habitColor = habit.color ?? habit.iconColor ?? colors.primary[700];
  const title = `Aiming for ${goalDuration} ${goalDuration === 1 ? 'day' : 'days'}`;

  return (
    <Animated.View
      className='overflow-hidden rounded-2xl shadow-sm'
      entering={FadeIn.duration(180)}
      style={cardStyle}
    >
      <View className='p-5'>
        <View className='mb-4 flex-row items-center justify-between'>
          <Text style={{ ...typography.heading3, color: colors.text.primary }}>
            {title}
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
              Adjust
            </Text>
          </Pressable>
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
