/**
 * QueryErrorState - Inline error state for failed data fetches
 * Shows error message with retry button, supports dark mode
 * Use when a query/API call fails but the app shouldn't crash
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';

interface QueryErrorStateProps {
  error?: Error | string | null;
  message?: string;
  onRetry?: () => void;
  compact?: boolean;
}

export function QueryErrorState({
  error,
  message = 'Failed to load data',
  onRetry,
  compact = false,
}: QueryErrorStateProps) {
  const { colors, isDark } = useThemeColors();

  const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      backgroundColor: colors.primary[500],
      borderRadius: 12,
      marginTop: compact ? 12 : 16,
      paddingHorizontal: compact ? 16 : 24,
      paddingVertical: compact ? 8 : 12,
      shadowColor: isDark ? '#000' : colors.primary[500],
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: isDark ? 0.4 : 0.2,
      shadowRadius: 8,
    },
    buttonText: {
      color: '#FFF',
      fontSize: compact ? 15 : 17,
      fontWeight: '600',
    },
    container: {
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : colors.card,
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
      borderRadius: 16,
      borderWidth: 1,
      padding: compact ? 20 : 32,
    },
    errorDetails: {
      color: isDark ? '#FCA5A5' : '#DC2626',
      fontSize: 12,
      fontFamily: 'monospace',
      marginTop: 12,
      textAlign: 'center',
    },
    icon: {
      fontSize: compact ? 32 : 48,
      marginBottom: compact ? 8 : 12,
    },
    message: {
      color: colors.text.primary,
      fontSize: compact ? 15 : 17,
      fontWeight: '600',
      textAlign: 'center',
    },
    submessage: {
      color: colors.text.secondary,
      fontSize: compact ? 13 : 15,
      marginTop: 4,
      textAlign: 'center',
    },
  });

  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(18)}
      style={styles.container}
    >
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.submessage}>Please try again</Text>
      {__DEV__ && errorMessage && (
        <Text numberOfLines={3} style={styles.errorDetails}>
          {errorMessage}
        </Text>
      )}
      {onRetry && (
        <Pressable
          accessibilityLabel="Retry loading data"
          accessibilityRole="button"
          style={styles.button}
          onPress={onRetry}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}
