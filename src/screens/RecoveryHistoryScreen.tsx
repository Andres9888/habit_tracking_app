/**
 * RecoveryHistoryScreen - Shows past streak recoveries
 *
 * Displays all streak recoveries across all habits
 * Shows streak length, cost, and date
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export function RecoveryHistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Get all user recoveries
  const userRecoveries = useQuery(api.habits.recoverStreak.getUserRecoveries);

  const formatCost = (cost: number) => {
    if (cost === 0) return 'Free';
    return `${cost} coin${cost > 1 ? 's' : ''}`;
  };

  const groupByMonth = (recoveries: any[]) => {
    const groups: Record<string, any[]> = {};
    recoveries.forEach((recovery) => {
      const date = new Date(recovery.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(recovery);
    });
    return groups;
  };

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const groupedRecoveries = userRecoveries ? groupByMonth(userRecoveries) : {};

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Recovery History</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {userRecoveries === undefined ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#059669" />
          </View>
        ) : userRecoveries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recovery history yet</Text>
            <Text style={styles.emptySubtext}>
              When you break a streak, you can recover it using coins.
            </Text>
          </View>
        ) : (
          Object.entries(groupedRecoveries)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([monthKey, recoveries]) => (
              <View key={monthKey} style={styles.monthGroup}>
                <Text style={styles.monthHeader}>{formatMonth(monthKey)}</Text>
                {recoveries.map((recovery) => (
                  <View key={recovery._id} style={styles.recoveryItem}>
                    <View style={styles.recoveryHeader}>
                      <Text style={styles.habitName}>{recovery.habitName}</Text>
                      <View style={styles.costBadge}>
                        <Text style={styles.costText}>{formatCost(recovery.cost)}</Text>
                      </View>
                    </View>
                    <View style={styles.recoveryDetails}>
                      <Text style={styles.detailText}>
                        Recovered {recovery.recoveredStreakLength} day streak
                      </Text>
                      <Text style={styles.dateText}>
                        {new Date(recovery.createdAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ))
        )}
      </ScrollView>

      {/* Stats Footer */}
      {userRecoveries && userRecoveries.length > 0 && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userRecoveries.length}</Text>
              <Text style={styles.statLabel}>Total Recoveries</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {userRecoveries.reduce((sum, r) => sum + r.cost, 0)}
              </Text>
              <Text style={styles.statLabel}>Total Coins Spent</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: '#374151',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  monthGroup: {
    marginBottom: 24,
  },
  monthHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  recoveryItem: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  recoveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  costBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  costText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  recoveryDetails: {
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
  },
  dateText: {
    fontSize: 13,
    color: '#6b7280',
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#059669',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
  },
});
