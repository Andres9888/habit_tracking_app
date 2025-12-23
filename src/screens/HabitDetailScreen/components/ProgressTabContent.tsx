/**
 * ProgressTabContent Component
 * Displays calendar heatmap and consolidated progress section
 */

import React from 'react';
import { View, Alert } from 'react-native';
import { CalendarHeatmap } from '../../../components/CalendarHeatmap';
import { ProgressSection } from '../../../components/ProgressSection';
import type { Habit, HabitTrackingEntry } from './types';

interface ProgressTabContentProps {
  completedDates: Set<string>;
  habit: Habit;
  habitCreatedAt: number | undefined;
  strengthPercent: number;
  tracking: HabitTrackingEntry[];
}

export function ProgressTabContent({
  completedDates,
  habit,
  habitCreatedAt,
  strengthPercent,
  tracking,
}: ProgressTabContentProps) {
  return (
    <View className="gap-4">
      {/* Calendar Heatmap - visual history of completions */}
      <CalendarHeatmap
        habitId={habit._id}
        completedDates={completedDates}
        habitCreatedAt={habitCreatedAt}
        habitColor={habit.iconColor}
        onDayPress={(date, completed) => {
          // Future: Could open day detail or allow editing past dates
        }}
      />

      {/* Consolidated Progress Section - 3 always-visible cards */}
      <ProgressSection
        tracking={tracking}
        habitCreatedAt={habitCreatedAt}
        strength={strengthPercent}
        onInfoPress={() => {
          Alert.alert(
            'What is Habit Strength?',
            'Habit strength measures how automatic your habit has become. It\'s calculated based on:\n\n' +
            '🔥 Current Streak - Consecutive days completed\n\n' +
            '📊 Success Rate - % of days you\'ve completed\n\n' +
            '📅 Consistency - How regular your habit is\n\n' +
            'The stronger your habit, the easier it becomes to maintain!',
            [{ text: 'Got it' }]
          );
        }}
        onWorstDayPress={() => {
          Alert.alert(
            'Improve Your Weak Days',
            'Tips to boost your consistency:\n\n' +
            '⏰ Set a reminder for this specific day\n\n' +
            '📍 Stack it after an existing habit\n\n' +
            '🎯 Start with a smaller version on tough days\n\n' +
            '🤝 Find an accountability partner',
            [{ text: 'Got it' }]
          );
        }}
        onSeeAllPress={() => {
          // Future: Navigate to full analytics screen
        }}
      />
    </View>
  );
}
