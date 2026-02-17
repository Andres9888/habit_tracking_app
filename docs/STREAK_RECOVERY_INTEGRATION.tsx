/**
 * Integration Example: Streak Recovery in Habit Detail Screen
 *
 * This example shows how to integrate the streak recovery feature
 * into an existing habit detail screen.
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { StreakRecoveryButton, StreakRecoveryModal } from '../src/components/StreakRecoveryModal';
import { useStreakRecovery } from '../src/hooks/useStreakRecovery';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

interface HabitDetailWithRecoveryProps {
  habitId: string;
}

/**
 * Example 1: Using the useStreakRecovery hook (Recommended)
 *
 * This approach gives you full control over the recovery modal
 * and provides all the recovery state in one hook.
 */
export function HabitDetailWithRecovery({ habitId }: HabitDetailWithRecoveryProps) {
  const router = useRouter();

  // Get habit data
  const habit = useQuery(api.habits.get, { id: habitId as any });

  // Use the streak recovery hook
  const {
    canRecover,
    streakLength,
    cost,
    remainingRecoveries,
    showRecoveryModal,
    StreakRecoveryModal,
  } = useStreakRecovery({
    habitId,
    habitName: habit?.name ?? 'Habit',
    onRecoverySuccess: () => {
      // Refetch habit data after recovery
      console.log('Streak recovered successfully!');
      // In production, you'd refetch: router.refresh() or query refetch
    },
  });

  if (!habit) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Habit Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Current Streak</Text>
          <Text style={styles.statValue}>{habit.currentStreak || 0} days</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Best Streak</Text>
          <Text style={styles.statValue}>{habit.bestStreak || 0} days</Text>
        </View>
      </View>

      {/* Streak Recovery Button */}
      {canRecover && (
        <View style={styles.recoverySection}>
          <StreakRecoveryButton
            habitId={habitId}
            onPress={showRecoveryModal}
            style={styles.recoveryButton}
          />
          {remainingRecoveries > 0 && (
            <Text style={styles.remainingText}>
              {remainingRecoveries} recovery{remainingRecoveries !== 1 ? 'ies' : ''} remaining this month
            </Text>
          )}
        </View>
      )}

      {/* Recovery Modal */}
      <StreakRecoveryModal />

      {/* Other habit details... */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.text}>{habit.name}</Text>
      </View>
    </ScrollView>
  );
}

/**
 * Example 2: Manual Modal State (For more control)
 *
 * Use this if you need to manage modal state separately
 * or want to conditionally render based on other factors.
 */
export function HabitDetailManualRecovery({ habitId }: HabitDetailWithRecoveryProps) {
  const [modalVisible, setModalVisible] = React.useState(false);

  // Get habit data
  const habit = useQuery(api.habits.get, { id: habitId as any });

  // Check if recovery is possible
  const canRecover = useQuery(api.habits.recoverStreak.canRecoverStreak, {
    habitId: habitId as any,
  });

  if (!habit) return null;

  return (
    <ScrollView style={styles.container}>
      {/* Habit content... */}

      {/* Show recovery button */}
      {canRecover?.canRecover && (
        <StreakRecoveryButton
          habitId={habitId}
          onPress={() => setModalVisible(true)}
          style={styles.recoveryButton}
        />
      )}

      {/* Recovery Modal */}
      <StreakRecoveryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        habitId={habitId}
        habitName={habit.name}
        onSuccess={() => {
          console.log('Recovery successful!');
          setModalVisible(false);
          // Refetch or refresh
        }}
      />
    </ScrollView>
  );
}

/**
 * Example 3: Adding to Settings/Menu
 *
 * Show a link to recovery history in the settings or menu
 */
export function HabitSettingsWithRecovery({ habitId }: HabitDetailWithRecoveryProps) {
  const router = useRouter();

  const navigateToRecoveryHistory = () => {
    router.push('/screens/RecoveryHistoryScreen');
  };

  return (
    <View style={styles.container}>
      {/* Other settings... */}

      {/* Recovery History Link */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={navigateToRecoveryHistory}
      >
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemText}>Recovery History</Text>
          <Text style={styles.menuItemSubtext}>View past streak recoveries</Text>
        </View>
        <Text style={styles.menuItemArrow}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  recoverySection: {
    margin: 16,
  },
  recoveryButton: {
    marginBottom: 8,
  },
  remainingText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  menuItemSubtext: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  menuItemArrow: {
    fontSize: 24,
    color: '#9ca3af',
    fontWeight: '300',
  },
});
