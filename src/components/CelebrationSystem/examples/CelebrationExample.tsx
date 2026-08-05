/**
 * Celebration System Example Component
 *
 * Demonstrates how to use the enhanced celebration system
 * in a real-world scenario.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import {
  ConfettiSystem,
  useCelebration,
  determineBurstType,
  type CompletionContext,
} from '../index';
import { fontFamilies } from '@/theme/typography';

/**
 * Example component showing all celebration burst types
 */
export function CelebrationExample() {
  const { triggerCelebration, activeBurst, config, clearCelebration } = useCelebration({
    soundEnabled: true,
    hapticsEnabled: true,
  });

  return (
    <View style={styles.container}>
      {activeBurst ? <ConfettiSystem
          burstType={activeBurst}
          shouldReduceMotion={false}
          isDarkMode={false}
          {...config}
        /> : null}

      <Text style={styles.title}>Celebration System Demo</Text>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={() => triggerCelebration('default')}
        >
          <Text style={styles.buttonText}>Default Completion</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => triggerCelebration('chainCompletion')}
        >
          <Text style={styles.buttonText}>Chain Completion (3+)</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => triggerCelebration('streakMilestone')}
        >
          <Text style={styles.buttonText}>Streak Milestone (7+)</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => triggerCelebration('levelUp')}
        >
          <Text style={styles.buttonText}>Level Up</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => triggerCelebration('perfectWeek')}
        >
          <Text style={styles.buttonText}>Perfect Week 🎉</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.clearButton]}
          onPress={clearCelebration}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * Example of auto-determining burst type based on context
 */
export function HabitCardExample() {
  const { triggerCelebration, activeBurst, config } = useCelebration({
    soundEnabled: true,
    hapticsEnabled: true,
  });

  // Simulated habit data
  const habit = {
    name: 'Morning Meditation',
    streak: 7,
    strength: 65,
    chainCount: 4,
  };

  const handleComplete = () => {
    // Determine which celebration to show based on context
    const context: CompletionContext = {
      streak: habit.streak,
      strength: habit.strength,
      chainCount: habit.chainCount,
    };

    const burstType = determineBurstType(context);
    triggerCelebration(burstType);
  };

  return (
    <View style={styles.container}>
      {activeBurst ? <ConfettiSystem
          burstType={activeBurst}
          shouldReduceMotion={false}
          isDarkMode={false}
          {...config}
        /> : null}

      <View style={styles.card}>
        <Text style={styles.habitName}>{habit.name}</Text>
        <View style={styles.stats}>
          <Text style={styles.stat}>🔥 {habit.streak} day streak</Text>
          <Text style={styles.stat}>💪 {habit.strength}% strength</Text>
        </View>
        <Pressable style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeButtonText}>Complete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: fontFamilies.primary.text,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    padding: 20,
    width: '100%',
  },
  card: {
    backgroundColor: '#EDEAE5',
    borderRadius: 16,
    padding: 20,
  },
  clearButton: {
    backgroundColor: '#6B6560',
    marginTop: 8,
  },
  completeButton: {
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 8,
    marginTop: 12,
    padding: 12,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontFamily: fontFamilies.primary.text,
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  habitName: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  stat: {
    fontFamily: fontFamilies.monospace,
    fontSize: 14,
    marginBottom: 4,
  },
  stats: {
    marginBottom: 8,
  },
  title: {
    fontFamily: fontFamilies.primary.display,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
});
