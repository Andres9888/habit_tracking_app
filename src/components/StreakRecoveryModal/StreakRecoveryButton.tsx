/**
 * StreakRecoveryButton - Button to recover broken streaks
 *
 * Shows when streak is broken and recovery is available
 * Displays cost and remaining recoveries
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface StreakRecoveryButtonProps {
  habitId: string;
  onPress: () => void;
  style?: any;
}

export function StreakRecoveryButton({ habitId, onPress, style }: StreakRecoveryButtonProps) {
  // Check if recovery is possible
  const canRecover = useQuery(api.habits.recoverStreak.canRecoverStreak, {
    habitId: habitId as any,
  });

  if (!canRecover?.canRecover) {
    return null;
  }

  const formatCost = (cost: number) => {
    if (cost === 0) return 'Free';
    return `${cost} coin${cost > 1 ? 's' : ''}`;
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Recover Streak</Text>
        <Text style={styles.subtitle}>
          {canRecover.streakLength} days • {formatCost(canRecover.cost)}
        </Text>
      </View>
      <View style={styles.arrow}>
        <Text style={styles.arrowText}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#047857',
  },
  arrow: {
    marginLeft: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  arrowText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
});
