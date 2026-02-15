/**
 * Error Fallback Component
 * Displays user-friendly error message with retry option.
 */

import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

import { useThemeColors } from '../../../theme/ThemeContext';

interface ErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
}

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.text.primary,
      borderRadius: 12,
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    buttonText: {
      color: colors.text.inverse,
      fontSize: 14,
      fontWeight: '600',
    },
    container: {
      alignItems: 'center',
      backgroundColor: colors.background,
      flex: 1,
      justifyContent: 'center',
      padding: 24,
    },
    content: {
      alignItems: 'center',
      maxWidth: 300,
    },
    emoji: {
      fontSize: 48,
      marginBottom: 16,
    },
    errorDetail: {
      backgroundColor: colors.card,
      borderRadius: 8,
      color: '#dc2626',
      fontFamily: 'monospace',
      fontSize: 12,
      marginBottom: 24,
      padding: 12,
      textAlign: 'center',
    },
    message: {
      color: colors.text.secondary,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 24,
      textAlign: 'center',
    },
    title: {
      color: colors.text.primary,
      fontSize: 22,
      fontWeight: '600',
      marginBottom: 8,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>😔</Text>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>
          We've been notified and are working to fix this.
        </Text>
        {__DEV__ && error && (
          <Text style={styles.errorDetail}>{error.message}</Text>
        )}
        <Pressable
          accessibilityLabel='Try again'
          accessibilityRole='button'
          style={styles.button}
          onPress={onRetry}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default ErrorFallback;
