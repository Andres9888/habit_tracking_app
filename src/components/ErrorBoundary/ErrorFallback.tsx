/**
 * ErrorFallback Component
 * Default UI shown when ErrorBoundary catches an error
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';
import { fontFamilies } from '@/theme/typography';
import { RetryButton } from './RetryButton';

interface ErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
}

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  return (
    <View
      accessibilityLabel='Error occurred'
      accessibilityLiveRegion='assertive'
      accessibilityRole='alert'
      style={styles.container}
    >
      <Text accessibilityLabel='Error icon' style={styles.emoji}>
        😕
      </Text>
      <Text accessibilityRole='header' style={styles.headline}>
        Something went wrong
      </Text>
      <Text style={styles.description}>
        We encountered an unexpected error. Please try again.
      </Text>
      <RetryButton onRetry={onRetry} />
      {__DEV__ && error && (
        <Text
          accessibilityLabel={`Error details: ${error.message}`}
          style={styles.errorMessage}
        >
          {error.message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.light.surfaceMuted,
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  description: {
    color: colors.text.secondary,
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorMessage: {
    color: colors.error,
    fontFamily: fontFamilies.monospace,
    fontSize: 12,
    marginTop: 24,
    maxWidth: 300,
    textAlign: 'left',
  },
  headline: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
});
