/**
 * StreakRecoveryModal - Premium feature to restore broken streaks
 *
 * Shows "Recover broken streak" button when streak is broken
 * Cost scales with streak length (1 week = 1 coin, 1 month = 3 coins)
 * Limits: 3/month for premium, 1/month for free users
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { api } from '../../convex/_generated/api';
import { useQuery, useMutation } from 'convex/react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StreakRecoveryModalProps {
  visible: boolean;
  onClose: () => void;
  habitId: string;
  habitName: string;
  onSuccess?: () => void;
}

export function StreakRecoveryModal({
  visible,
  onClose,
  habitId,
  habitName,
  onSuccess,
}: StreakRecoveryModalProps) {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if recovery is possible
  const canRecover = useQuery(api.habits.recoverStreak.canRecoverStreak, {
    habitId: habitId as any,
  });

  // Get recovery history
  const recoveryHistory = useQuery(api.habits.recoverStreak.getRecoveryHistory, {
    habitId: habitId as any,
  });

  // Recover mutation
  const recoverStreak = useMutation(api.habits.recoverStreak.recoverStreak);

  useEffect(() => {
    if (visible) {
      setError(null);
    }
  }, [visible]);

  const handleRecover = async () => {
    if (!canRecover?.canRecover) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await recoverStreak({
        habitId: habitId as any,
      });

      if (result.success) {
        onSuccess?.();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to recover streak');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCost = (streakLength: number, cost: number) => {
    if (streakLength < 7) return 'Free';
    if (cost === 1) return `${cost} coin`;
    return `${cost} coins`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { paddingBottom: insets.bottom }]}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Recover Streak</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Habit Info */}
            <View style={styles.habitInfo}>
              <Text style={styles.habitName}>{habitName}</Text>
              {canRecover?.canRecover ? (
                <>
                  <Text style={styles.streakInfo}>
                    Recovering {canRecover.streakLength} day streak
                  </Text>
                  <View style={styles.costContainer}>
                    <Text style={styles.costLabel}>Cost:</Text>
                    <Text style={styles.costValue}>
                      {formatCost(canRecover.streakLength, canRecover.cost)}
                    </Text>
                  </View>
                  <Text style={styles.remainingInfo}>
                    {canRecover.remainingRecoveries} recovery{canRecover.remainingRecoveries !== 1 ? 'ies' : ''} remaining this month
                  </Text>
                </>
              ) : (
                <Text style={styles.errorText}>
                  {canRecover?.reason || 'Cannot recover streak'}
                </Text>
              )}
            </View>

            {/* Pricing Info */}
            {canRecover?.canRecover && (
              <View style={styles.pricingInfo}>
                <Text style={styles.pricingTitle}>Recovery Cost</Text>
                <View style={styles.pricingItem}>
                  <Text style={styles.pricingRange}>{'< 7 days'}</Text>
                  <Text style={styles.pricingCost}>Free</Text>
                </View>
                <View style={styles.pricingItem}>
                  <Text style={styles.pricingRange}>7-29 days</Text>
                  <Text style={styles.pricingCost}>1-2 coins</Text>
                </View>
                <View style={styles.pricingItem}>
                  <Text style={styles.pricingRange}>{'≥ 30 days'}</Text>
                  <Text style={styles.pricingCost}>3 coins</Text>
                </View>
              </View>
            )}

            {/* Recovery History */}
            {recoveryHistory && recoveryHistory.length > 0 && (
              <View style={styles.historyContainer}>
                <Text style={styles.historyTitle}>Recovery History</Text>
                {recoveryHistory.map((recovery) => (
                  <View key={recovery._id} style={styles.historyItem}>
                    <View>
                      <Text style={styles.historyDate}>
                        {new Date(recovery.createdAt).toLocaleDateString()}
                      </Text>
                      <Text style={styles.historyStreak}>
                        Recovered {recovery.recoveredStreakLength} day streak
                      </Text>
                    </View>
                    <Text style={styles.historyCost}>
                      {recovery.cost === 0 ? 'Free' : `${recovery.cost} coin${recovery.cost > 1 ? 's' : ''}`}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Error Message */}
            {error && <Text style={styles.errorMessage}>{error}</Text>}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.recoverButton,
                (!canRecover?.canRecover || isLoading) && styles.recoverButtonDisabled,
              ]}
              onPress={handleRecover}
              disabled={!canRecover?.canRecover || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.recoverButtonText}>
                  {canRecover?.canRecover
                    ? `Recover ${formatCost(canRecover.streakLength, canRecover.cost)}`
                    : 'Cannot Recover'}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6b7280',
  },
  content: {
    padding: 20,
  },
  habitInfo: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  streakInfo: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  costLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  costValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  remainingInfo: {
    fontSize: 13,
    color: '#6b7280',
  },
  pricingInfo: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  pricingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 12,
  },
  pricingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  pricingRange: {
    fontSize: 14,
    color: '#166534',
  },
  pricingCost: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
  },
  historyContainer: {
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  historyDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  historyStreak: {
    fontSize: 14,
    color: '#374151',
  },
  historyCost: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  errorMessage: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  recoverButton: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  recoverButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  recoverButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
});
