/**
 * SuggestedHabitsQuickStart
 *
 * Shows 3 common habits that first-time users can tap to instantly add.
 * Disappears after the user creates any habit or dismisses.
 *
 * Created by Opus.
 */

import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { trackSuggestedHabitTapped } from '../../../lib/analytics/onboarding';

const SUGGESTED_HABITS = [
  { emoji: '💧', name: 'Drink Water', description: 'Stay hydrated daily' },
  { emoji: '🧘', name: 'Meditate', description: '5 minutes of calm' },
  { emoji: '📖', name: 'Read', description: '10 pages a day' },
] as const;

interface SuggestedHabitsQuickStartProps {
  onSelectHabit: (habitName: string) => Promise<void>;
  onDismiss: () => void;
}

export function SuggestedHabitsQuickStart({
  onSelectHabit,
  onDismiss,
}: SuggestedHabitsQuickStartProps) {
  const [creatingIndex, setCreatingIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  const handleSelect = useCallback(
    async (index: number) => {
      if (creatingIndex !== null) return;
      const habit = SUGGESTED_HABITS[index];
      setCreatingIndex(index);
      trackSuggestedHabitTapped(habit.name, index);
      try {
        await onSelectHabit(`${habit.emoji} ${habit.name}`);
      } finally {
        setCreatingIndex(null);
      }
    },
    [creatingIndex, onSelectHabit]
  );

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeIn.duration(280)}
      exiting={reduceMotion ? undefined : FadeOut.duration(200)}
      style={styles.container}
    >
      <Text style={styles.title}>Quick Start</Text>
      <Text style={styles.subtitle}>Tap to add instantly</Text>

      <View style={styles.habitsRow}>
        {SUGGESTED_HABITS.map((habit, index) => (
          <Animated.View
            key={habit.name}
            entering={
              reduceMotion
                ? undefined
                : FadeInDown.delay(100 + index * 60)
                    .springify()
                    .damping(18)
            }
          >
            <Pressable
              accessibilityLabel={`Add ${habit.name} habit`}
              accessibilityRole="button"
              disabled={creatingIndex !== null}
              style={[
                styles.habitCard,
                creatingIndex === index && styles.habitCardActive,
              ]}
              onPress={() => void handleSelect(index)}
            >
              <Text style={styles.habitEmoji}>{habit.emoji}</Text>
              <Text style={styles.habitName}>{habit.name}</Text>
              <Text style={styles.habitDesc}>{habit.description}</Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>

      <Pressable
        accessibilityLabel="Dismiss suggested habits"
        accessibilityRole="button"
        hitSlop={16}
        style={styles.dismissButton}
        onPress={onDismiss}
      >
        <Text style={styles.dismissText}>I'll create my own</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    color: '#047857',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 20,
  },
  habitsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  habitCard: {
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    elevation: 2,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    width: 100,
  },
  habitCardActive: {
    opacity: 0.6,
  },
  habitEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  habitName: {
    color: '#047857',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  habitDesc: {
    color: '#9CA3AF',
    fontSize: 11,
    textAlign: 'center',
  },
  dismissButton: {
    marginTop: 16,
    minHeight: 44,
    justifyContent: 'center',
  },
  dismissText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '500',
  },
});
