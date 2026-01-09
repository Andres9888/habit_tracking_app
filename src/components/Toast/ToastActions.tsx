/**
 * Toast Action Buttons
 */

import React from 'react';
import { Text, Pressable } from 'react-native';

import { useAppTheme } from '../../theme';
import type { ToastVariant } from './types';
import { styles } from './styles';

interface ToastActionsProps {
  variant: ToastVariant;
  textColor: string;
  actionLabel: string;
  onAction?: () => void;
  onDismiss: () => void;
}

export function ToastActions({
  variant,
  textColor,
  actionLabel,
  onAction,
  onDismiss,
}: ToastActionsProps) {
  const theme = useAppTheme();

  if (variant === 'undo' && onAction) {
    return (
      <Pressable
        accessibilityLabel={actionLabel}
        accessibilityRole='button'
        style={styles.actionButton}
        onPress={() => {
          onAction();
          onDismiss();
        }}
      >
        <Text
          style={[
            theme.custom.typography.button,
            { color: theme.custom.colors.primary[400] },
          ]}
        >
          {actionLabel}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityLabel='Dismiss'
      accessibilityRole='button'
      hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
      style={styles.dismissButton}
      onPress={onDismiss}
    >
      <Text style={[styles.dismissIcon, { color: textColor }]}>✕</Text>
    </Pressable>
  );
}
