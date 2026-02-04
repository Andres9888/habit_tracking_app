/**
 * HabitDetailContent - Redesigned scrollable content area
 * 
 * Simplified 3-section layout:
 * 1. Progress Hero (streak + emoji)
 * 2. Quick Stats Strip
 * 3. Calendar Card (with inline milestones)
 * 4. Actions Card (Notes + Archive)
 * 
 * @see HABIT-DETAIL-AFTER-SPEC.md for design details
 */

import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { ProgressHeroCard } from './ProgressHeroCard';
import { QuickStatsStrip } from './QuickStatsStrip';
import { CalendarCard } from './CalendarCard';
import { ActionsCard } from './ActionsCard';
import type { Habit } from '../HabitDetailScreen.types';

interface HabitDetailContentProps {
  habit: Habit;
  completedDates: Set<string>;
  notesCount: number;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  onNotesPress: () => void;
  onArchivePress: () => void;
}

export function HabitDetailContent({
  habit,
  completedDates,
  notesCount,
  onDayPress,
  onNotesPress,
  onArchivePress,
}: HabitDetailContentProps) {
  const reduceMotion = useReduceMotion();

  // Calculate stats
  const currentStreak = habit.currentStreak ?? 0;
  const bestStreak = habit.bestStreak ?? currentStreak;
  const totalCompletions = habit.totalCompletions ?? completedDates.size;
  const strength = habit.strength ?? 0;

  // Calculate success rate
  const successRate = useMemo(() => {
    const total = (habit.totalCompletions ?? 0) + (habit.totalMisses ?? 0);
    if (total === 0) return 0;
    return ((habit.totalCompletions ?? 0) / total) * 100;
  }, [habit.totalCompletions, habit.totalMisses]);

  // Extract emoji from habit icon or name
  const emoji = habit.icon || '✨';
  // Strip leading emoji from name if icon is shown separately
  const habitName = habit.icon 
    ? (habit.name ?? '').replace(/^\p{Emoji}\s*/u, '') 
    : (habit.name ?? 'Habit');

  return (
    <ScrollView
      bounces
      className='flex-1'
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Section 1: Progress Hero Card */}
      <ProgressHeroCard
        currentStreak={currentStreak}
        bestStreak={bestStreak}
        emoji={emoji}
        habitName={habitName}
        reduceMotion={reduceMotion}
      />

      {/* 16px gap */}
      <View style={{ height: 16 }} />

      {/* Section 2: Quick Stats Strip */}
      <QuickStatsStrip
        totalCompletions={totalCompletions}
        successRate={successRate}
        strength={strength}
        reduceMotion={reduceMotion}
      />

      {/* 20px gap */}
      <View style={{ height: 20 }} />

      {/* Section 3: Calendar Card with Inline Milestones */}
      <CalendarCard
        habitId={habit._id}
        habitColor={habit.iconColor ?? '#10b981'}
        habitCreatedAt={habit.createdAt}
        completedDates={completedDates}
        currentStreak={currentStreak}
        totalCompletions={totalCompletions}
        reduceMotion={reduceMotion}
        onDayPress={onDayPress}
      />

      {/* 24px gap */}
      <View style={{ height: 24 }} />

      {/* Section 4: Actions Card */}
      <ActionsCard
        notesCount={notesCount}
        onNotesPress={onNotesPress}
        onArchivePress={onArchivePress}
      />
    </ScrollView>
  );
}
