/**
 * CalendarCard Component
 * Calendar with integrated inline milestones strip
 * 
 * @see HABIT-DETAIL-AFTER-SPEC.md for design details
 */

import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { InlineMilestonesStrip } from './InlineMilestonesStrip';
import type { Id } from '../../../../convex/_generated/dataModel';

interface CalendarCardProps {
  habitId: Id<'habits'>;
  habitColor: string;
  habitCreatedAt?: number;
  completedDates: Set<string>;
  currentStreak: number;
  totalCompletions: number;
  reduceMotion?: boolean;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

export function CalendarCard({
  habitId,
  habitColor,
  habitCreatedAt,
  completedDates,
  currentStreak,
  totalCompletions,
  reduceMotion = false,
  onDayPress,
}: CalendarCardProps) {
  const opacity = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      return;
    }

    opacity.value = withDelay(200, withTiming(1, { duration: 280, easing: Easing.out(Easing.ease) }));
  }, [reduceMotion, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[{
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e7e5e4',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      }, animatedStyle]}
    >
      <ErrorBoundary>
        <MonthlyCalendarGrid
          completedDates={completedDates}
          habitColor={habitColor ?? '#10b981'}
          habitCreatedAt={habitCreatedAt}
          habitId={habitId}
          onDayPress={onDayPress}
        />
      </ErrorBoundary>

      {/* Inline Milestones Strip */}
      <InlineMilestonesStrip
        currentStreak={currentStreak}
        totalCompletions={totalCompletions}
        reduceMotion={reduceMotion}
      />
    </Animated.View>
  );
}
