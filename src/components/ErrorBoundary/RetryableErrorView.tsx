/* eslint-disable max-lines */
/**
 * RetryableErrorView — inline error card with retry button.
 * Use inside screens when a query/mutation fails but the whole screen
 * shouldn't be replaced by a fallback.
 *
 * Usage:
 *   {error ? (
 *     <RetryableErrorView error={error} onRetry={refetch} />
 *   ) : (
 *     <Content />
 *   )}
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius } from '@/theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

interface RetryableErrorViewProps {
  /** The error object or message string */
  error: Error | string | null;
  /** Called when user taps "Try Again" */
  onRetry: () => void;
  /** Optional secondary action (e.g. go back) */
  onSecondaryAction?: () => void;
  secondaryLabel?: string;
  /** Optional title override */
  title?: string;
  /** Compact mode for inline use within a list */
  compact?: boolean;
}

export function RetryableErrorView({
  error,
  onRetry,
  onSecondaryAction,
  secondaryLabel = 'Go Back',
  title = 'Something went wrong',
  compact = false,
}: RetryableErrorViewProps) {
  const { colors } = useThemeColors();

  const errorMessage =
    typeof error === 'string'
      ? error
      : (error?.message ?? 'An unexpected error occurred');

  const styles = StyleSheet.create({
    compact: {
      paddingVertical: 24,
    },
    container: {
      alignItems: 'center',
      flex: compact ? 0 : 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingVertical: compact ? 24 : 0,
    },
    description: {
      ...typography.caption,
      color: colors.text.secondary,
      lineHeight: 20,
      marginBottom: 20,
      maxWidth: 280,
      textAlign: 'center',
    },
    emoji: {
      fontSize: compact ? 32 : 34,
      marginBottom: 12,
    },
    retryButton: {
      alignItems: 'center',
      backgroundColor: colors.primary[500],
      borderRadius: borderRadius.button,
      paddingHorizontal: 28,
      paddingVertical: 12,
      shadowColor: colors.primary[500],
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    retryText: {
      ...typography.bodySmall,
      color: colors.text.inverse,
      fontWeight: fontWeights.semibold,
    },
    secondaryButton: {
      marginTop: 12,
      paddingVertical: 8,
    },
    secondaryText: {
      ...typography.bodySmall,
      color: colors.text.secondary,
      fontWeight: fontWeights.medium,
    },
    title: {
      color: colors.text.primary,
      fontFamily: fontFamilies.primary.text,
      fontSize: compact ? 17 : 20,
      fontWeight: fontWeights.semibold,
      marginBottom: 6,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>
        {compact
          ? 'Tap to try again.'
          : `${errorMessage.slice(0, 120)}${errorMessage.length > 120 ? '…' : ''}`}
      </Text>
      <Pressable
        accessibilityLabel='Retry'
        accessibilityRole='button'
        style={styles.retryButton}
        onPress={onRetry}
      >
        <Text style={styles.retryText}>Try Again</Text>
      </Pressable>
      {onSecondaryAction ? <Pressable
          accessibilityLabel={secondaryLabel}
          accessibilityRole='button'
          style={styles.secondaryButton}
          onPress={onSecondaryAction}
        >
          <Text style={styles.secondaryText}>{secondaryLabel}</Text>
        </Pressable> : null}
    </View>
  );
}
