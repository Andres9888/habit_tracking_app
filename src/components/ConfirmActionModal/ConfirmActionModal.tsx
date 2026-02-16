/**
 * ConfirmActionModal - Confirmation dialog for destructive swipe actions
 *
 * Prevents accidental deletion/archival by requiring explicit confirmation.
 * Follows iOS-style alert pattern for familiarity.
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { AlertTriangle, Archive, Trash2 } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography } from '@/theme/typography';
import { borderRadius, spacing } from '@/theme/spacing';

export type ActionType = 'delete' | 'archive';

interface ConfirmActionModalProps {
  visible: boolean;
  actionType: ActionType;
  habitName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmActionModal({
  visible,
  actionType,
  habitName,
  onConfirm,
  onCancel,
}: ConfirmActionModalProps) {
  const { colors, isDark } = useThemeColors();

  const config = {
    archive: {
      icon: Archive,
      title: 'Archive Habit?',
      message: `"${habitName}" will be moved to your archived habits. You can restore it anytime from Settings.`,
      confirmText: 'Archive',
      confirmColor: '#f59e0b', // amber-500
    },
    delete: {
      icon: Trash2,
      title: 'Delete Habit?',
      message: `"${habitName}" will be permanently deleted. This cannot be undone.`,
      confirmText: 'Delete',
      confirmColor: '#dc2626', // red-600
    },
  }[actionType];

  const Icon = config.icon;
  const backgroundColor = isDark ? colors.card : '#FFFFFF';
  const overlayColor = isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)';

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        <View
          style={[
            styles.dialog,
            {
              backgroundColor,
              borderColor: isDark ? colors.border : '#E5E7EB',
            },
          ]}
        >
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: config.confirmColor + '20' },
            ]}
          >
            <Icon color={config.confirmColor} size={28} strokeWidth={2} />
          </View>

          {/* Title */}
          <Text
            style={[
              styles.title,
              { color: colors.text?.primary ?? '#000000' },
            ]}
          >
            {config.title}
          </Text>

          {/* Message */}
          <Text
            style={[
              styles.message,
              { color: colors.text?.secondary ?? '#6B7280' },
            ]}
          >
            {config.message}
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable
              accessibilityLabel="Cancel"
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                {
                  backgroundColor: isDark ? colors.border : '#F3F4F6',
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={onCancel}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: colors.text?.primary ?? '#000000' },
                ]}
              >
                Cancel
              </Text>
            </Pressable>

            <Pressable
              accessibilityLabel={config.confirmText}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.button,
                styles.confirmButton,
                {
                  backgroundColor: config.confirmColor,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              onPress={onConfirm}
            >
              <Text style={[styles.buttonText, styles.confirmButtonText]}>
                {config.confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: borderRadius.md,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    width: '100%',
  },
  buttonText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  cancelButton: {
    // Styles applied inline
  },
  confirmButton: {
    // Styles applied inline
  },
  confirmButtonText: {
    color: '#FFFFFF',
  },
  dialog: {
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    elevation: 8,
    marginHorizontal: spacing.xl,
    maxWidth: 400,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    width: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 64,
    justifyContent: 'center',
    marginBottom: spacing.md,
    width: 64,
  },
  message: {
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  overlay: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
