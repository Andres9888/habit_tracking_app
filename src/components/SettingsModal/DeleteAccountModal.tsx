/* eslint-disable max-lines */
/**
 * DeleteAccountModal Component
 *
 * Confirmation modal for account deletion with warning display.
 * Shows user's data stats before deletion.
 * Includes haptic feedback and accessible button states.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SETTINGS_COLORS } from './types';
import type { DeleteAccountModalProps } from './types';

export function DeleteAccountModal({
  isVisible,
  onClose,
  onConfirm,
  stats,
  isLoading = false,
}: DeleteAccountModalProps) {
  const [confirming, setConfirming] = useState(false);

  const handleDelete = useCallback(async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setConfirming(true);
    try {
      await onConfirm();
    } finally {
      setConfirming(false);
    }
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);

  if (!isVisible) return null;

  const isDisabled = isLoading || confirming;

  return (
    <Modal transparent animationType='none' visible={isVisible}>
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={handleCancel} />
        <Animated.View
          entering={SlideInDown.springify().damping(15)}
          style={styles.modal}
        >
          {/* Warning Icon */}
          <Text accessibilityLabel='Warning' style={styles.icon}>
            ⚠️
          </Text>

          {/* Title */}
          <Text style={styles.title}>Delete Account?</Text>

          {/* Description */}
          <Text style={styles.description}>
            This will permanently delete all your habits, streaks, and progress.
            This action cannot be undone.
          </Text>

          {/* Stats Card */}
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>What you'll lose:</Text>
            <Text style={styles.statItem}>
              • {stats.habitsCount} habits tracked
            </Text>
            <Text style={styles.statItem}>
              • {stats.totalDays} days of progress
            </Text>
            <Text style={styles.statItem}>• All streaks & achievements</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            <Pressable
              accessibilityHint='Double tap to permanently delete your account'
              accessibilityLabel={
                confirming ? 'Deleting account' : 'Delete account forever'
              }
              accessibilityRole='button'
              disabled={isDisabled}
              style={[styles.deleteButton, isDisabled && styles.buttonDisabled]}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>
                {confirming ? 'Deleting...' : 'Delete Forever'}
              </Text>
            </Pressable>

            <Pressable
              accessibilityLabel='Keep my account'
              accessibilityRole='button'
              disabled={isDisabled}
              style={[styles.cancelButton, isDisabled && styles.buttonDisabled]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Keep My Account</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttons: {
    gap: 12,
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 16,
  },
  cancelButtonText: {
    color: SETTINGS_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: SETTINGS_COLORS.danger,
    borderRadius: 14,
    padding: 16,
  },
  deleteButtonText: {
    color: SETTINGS_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    color: SETTINGS_COLORS.textDanger,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  icon: {
    fontSize: 56,
    marginBottom: 16,
    textAlign: 'center',
  },
  modal: {
    backgroundColor: SETTINGS_COLORS.backgroundGradientEnd,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 24,
    borderWidth: 1,
    maxWidth: 340,
    padding: 32,
    width: '90%',
  },
  overlay: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statItem: {
    color: SETTINGS_COLORS.textDanger,
    fontSize: 14,
    marginBottom: 6,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 24,
    padding: 16,
  },
  statsLabel: {
    color: SETTINGS_COLORS.textSecondary,
    fontSize: 12,
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    color: SETTINGS_COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
});
