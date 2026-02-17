/**
 * StreakRecoveryPrompt
 *
 * Modal that appears when a user's streak breaks, offering to
 * recover it by filling in the missed day. Shows remaining
 * recoveries and premium upsell when limit is reached.
 */

import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Modal } from '../Modal';
import { useStreakRecovery } from '../../hooks/useStreakRecovery';
import type { Id } from '../../../convex/_generated/dataModel';

interface StreakRecoveryPromptProps {
  /** The habit whose streak broke */
  habitId: Id<'habits'>;
  /** Habit display name */
  habitName: string;
  /** The missed date in YYYY-MM-DD */
  missedDate: string;
  /** Called after successful recovery or dismiss */
  onDismiss: () => void;
  /** The streak length before it broke */
  streakLength: number;
  /** Whether the modal is visible */
  visible: boolean;
}

export function StreakRecoveryPrompt({
  habitId,
  habitName,
  missedDate,
  onDismiss,
  streakLength,
  visible,
}: StreakRecoveryPromptProps) {
  const { error, isPremium, isRecovering, limit, recover, remaining } =
    useStreakRecovery();
  const [success, setSuccess] = useState(false);

  const handleRecover = useCallback(async () => {
    try {
      await recover(habitId, missedDate);
      setSuccess(true);
      setTimeout(onDismiss, 1500);
    } catch {
      // error is set in hook
    }
  }, [recover, habitId, missedDate, onDismiss]);

  const canRecover = remaining > 0;

  return (
    <Modal
      accessibilityViewIsModal
      onRequestClose={onDismiss}
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {success ? (
            <>
              <Text style={styles.emoji}>🔥</Text>
              <Text style={styles.title}>Streak Recovered!</Text>
              <Text style={styles.subtitle}>
                Your {streakLength}-day streak on {habitName} is back!
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.emoji}>💔</Text>
              <Text style={styles.title}>Streak Broken</Text>
              <Text style={styles.subtitle}>
                Your {streakLength}-day streak on {habitName} just broke.
                {canRecover
                  ? ' Want to recover it?'
                  : ''}
              </Text>

              {canRecover ? (
                <>
                  <Text style={styles.info}>
                    Recovery fills in the missed day ({missedDate}).{'\n'}
                    {remaining} of {limit} recoveries remaining this month.
                  </Text>

                  <TouchableOpacity
                    accessibilityLabel="Recover streak"
                    accessibilityRole="button"
                    disabled={isRecovering}
                    onPress={handleRecover}
                    style={styles.recoverButton}
                  >
                    {isRecovering ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.recoverButtonText}>
                        🔄 Recover Streak
                      </Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.limitReached}>
                  <Text style={styles.limitText}>
                    {isPremium
                      ? `You've used all ${limit} recoveries this month. Resets next month.`
                      : `Free users get ${limit} recovery per month.`}
                  </Text>
                  {!isPremium && (
                    <Text style={styles.upsell}>
                      ⭐ Upgrade to Premium for 3 recoveries per month
                    </Text>
                  )}
                </View>
              )}

              {error ? (
                <Text style={styles.error}>{error}</Text>
              ) : null}

              <TouchableOpacity
                accessibilityLabel="Dismiss"
                onPress={onDismiss}
                style={styles.dismissButton}
              >
                <Text style={styles.dismissText}>
                  {canRecover ? 'No thanks' : 'OK'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 24,
    maxWidth: 360,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    width: '100%',
  },
  dismissButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  dismissText: {
    color: '#6b7280',
    fontSize: 15,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  error: {
    color: '#dc2626',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  info: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    textAlign: 'center',
  },
  limitReached: {
    alignItems: 'center',
    marginTop: 12,
  },
  limitText: {
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  recoverButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    width: '100%',
  },
  recoverButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    color: '#374151',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  upsell: {
    color: '#d97706',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});
