/**
 * FocusModeDemo - Demonstration screen for Focus Mode feature
 *
 * Shows how Focus Mode works with:
 * - Dark mode support
 * - Multiple sample habits
 * - Full focus mode experience
 *
 * This screen serves as both a demo and integration test for the feature.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FocusMode } from '../../components/FocusMode';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme';
import type { Id } from '../../../convex/_generated/dataModel';

interface SampleHabit {
  id: Id<'habits'>;
  name: string;
  icon: string;
  color: string;
  completed: boolean;
}

const SAMPLE_HABITS: SampleHabit[] = [
  {
    id: '1' as Id<'habits'>,
    name: 'Morning Meditation',
    icon: '🧘',
    color: '#059669',
    completed: false,
  },
  {
    id: '2' as Id<'habits'>,
    name: 'Read 30 Minutes',
    icon: '📚',
    color: '#0891b2',
    completed: false,
  },
  {
    id: '3' as Id<'habits'>,
    name: 'Exercise',
    icon: '💪',
    color: '#d97706',
    completed: false,
  },
  {
    id: '4' as Id<'habits'>,
    name: 'Write in Journal',
    icon: '📝',
    color: '#8b5cf6',
    completed: true,
  },
  {
    id: '5' as Id<'habits'>,
    name: 'Drink 8 Glasses Water',
    icon: '💧',
    color: '#06b6d4',
    completed: false,
  },
];

export function FocusModeDemo() {
  const { colors, isDark } = useThemeColors();
  const [selectedHabit, setSelectedHabit] = useState<SampleHabit | null>(null);
  const [habits, setHabits] = useState(SAMPLE_HABITS);

  const handleFocusHabit = (habit: SampleHabit) => {
    setSelectedHabit(habit);
  };

  const handleComplete = () => {
    if (selectedHabit) {
      // Update the habit to completed
      setHabits((prev) =>
        prev.map((h) =>
          h.id === selectedHabit.id ? { ...h, completed: true } : h
        )
      );
    }
  };

  const handleDismiss = () => {
    setSelectedHabit(null);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[
              typography.heading1,
              { color: colors.text.primary, marginBottom: spacing.xs },
            ]}
          >
            Focus Mode Demo
          </Text>
          <Text style={[typography.body, { color: colors.text.secondary }]}>
            Tap any habit to enter immersive focus mode
          </Text>
        </View>

        {/* Habits List */}
        <View style={styles.habitsList}>
          {habits.map((habit) => (
            <Pressable
              key={habit.id}
              style={({ pressed }) => [
                styles.habitCard,
                {
                  backgroundColor: colors.card,
                  borderColor: habit.color,
                  opacity: pressed ? 0.8 : 1,
                },
                shadows.card,
              ]}
              onPress={() => handleFocusHabit(habit)}
            >
              <View style={styles.habitCardContent}>
                <Text style={styles.habitIcon}>{habit.icon}</Text>
                <View style={styles.habitInfo}>
                  <Text
                    style={[typography.heading3, { color: colors.text.primary }]}
                  >
                    {habit.name}
                  </Text>
                  {habit.completed && (
                    <Text
                      style={[
                        typography.caption,
                        { color: '#047857', marginTop: 4 },
                      ]}
                    >
                      ✓ Completed today
                    </Text>
                  )}
                </View>
                <View
                  style={[
                    styles.focusButton,
                    { backgroundColor: habit.color + '20' },
                  ]}
                >
                  <Text style={[typography.button, { color: habit.color }]}>
                    Focus
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Feature Description */}
        <View style={styles.descriptionSection}>
          <Text
            style={[
              typography.heading2,
              { color: colors.text.primary, marginBottom: spacing.md },
            ]}
          >
            What is Focus Mode?
          </Text>

          <FeatureItem
            icon="🎯"
            title="Single Habit Focus"
            description="Dims everything except your chosen habit for distraction-free commitment"
            isDark={isDark}
            colors={colors}
          />

          <FeatureItem
            icon="⏱️"
            title="Pomodoro Timer"
            description="Optional 25-minute timer helps you stay focused and productive"
            isDark={isDark}
            colors={colors}
          />

          <FeatureItem
            icon="✨"
            title="Celebration"
            description="Haptic feedback and animations when you mark the habit complete"
            isDark={isDark}
            colors={colors}
          />

          <FeatureItem
            icon="🌙"
            title="Dark Mode"
            description="Fully supports dark mode with adaptive colors and contrasts"
            isDark={isDark}
            colors={colors}
          />
        </View>
      </ScrollView>

      {/* Focus Mode Overlay */}
      {selectedHabit && (
        <FocusMode
          habitId={selectedHabit.id}
          habitName={selectedHabit.name}
          habitIcon={selectedHabit.icon}
          habitColor={selectedHabit.color}
          completed={selectedHabit.completed}
          timerDuration={25}
          enableTimer={true}
          onComplete={handleComplete}
          onDismiss={handleDismiss}
        />
      )}
    </SafeAreaView>
  );
}

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
  isDark: boolean;
  colors: any;
}

function FeatureItem({ icon, title, description, colors }: FeatureItemProps) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureText}>
        <Text style={[typography.heading3, { color: colors.text.primary }]}>
          {title}
        </Text>
        <Text
          style={[
            typography.body,
            { color: colors.text.secondary, marginTop: 4 },
          ]}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  habitsList: {
    marginBottom: spacing.xl,
  },
  habitCard: {
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  habitCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitIcon: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  habitInfo: {
    flex: 1,
  },
  focusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  descriptionSection: {
    marginTop: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  featureText: {
    flex: 1,
  },
});

export default FocusModeDemo;
