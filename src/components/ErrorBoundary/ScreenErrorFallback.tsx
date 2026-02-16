/* eslint-disable max-lines */
/**
 * ScreenErrorFallback - Lightweight error fallback for individual screens
 * Designed to prevent one screen crash from killing the entire app.
 * Theme-aware: reads system color scheme directly (works outside ThemeColorProvider).
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useErrorTheme } from './useErrorTheme';

interface ScreenErrorFallbackProps {
  screenName: string;
  error: Error | null;
  onRetry: () => void;
  onGoBack?: () => void;
}

export function ScreenErrorFallback({
  screenName,
  error,
  onRetry,
  onGoBack,
}: ScreenErrorFallbackProps) {
  const { colors } = useErrorTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.emoji}>😕</Text>
      <Text style={[styles.title, { color: colors.text.primary }]}>
        Something went wrong
      </Text>
      <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
        {screenName} encountered an error, but your data is safe.
      </Text>

      <Pressable
        accessibilityLabel='Retry loading screen'
        accessibilityRole='button'
        style={[styles.primaryButton, {
          backgroundColor: colors.primary[500],
          shadowColor: colors.primary[500],
        }]}
        onPress={onRetry}
      >
        <Text style={styles.primaryButtonText}>Try Again</Text>
      </Pressable>

      {onGoBack && (
        <Pressable
          accessibilityLabel='Go back to previous screen'
          accessibilityRole='button'
          style={styles.secondaryButton}
          onPress={onGoBack}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.text.secondary }]}>
            Go Back
          </Text>
        </Pressable>
      )}

      {__DEV__ && error && (
        <View style={[styles.errorDetails, {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          borderWidth: 1,
        }]}>
          <Text style={[styles.errorText, { color: colors.text.secondary }]}>
            {error.message}
          </Text>
          <Text style={[styles.errorStack, { color: colors.text.tertiary }]}>
            {error.stack?.slice(0, 200)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorDetails: {
    borderRadius: 8,
    marginTop: 24,
    padding: 12,
    width: '100%',
  },
  errorStack: {
    fontFamily: 'Courier',
    fontSize: 10,
    marginTop: 8,
  },
  errorText: {
    fontFamily: 'Courier',
    fontSize: 13,
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryButton: {
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
});
