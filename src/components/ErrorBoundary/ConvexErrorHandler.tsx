/**
 * ConvexErrorHandler - Detects and handles Convex-specific errors
 * Provides better error messages and recovery suggestions
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../theme/ThemeContext';

interface ConvexErrorHandlerProps {
  error: Error | null;
  onRetry: () => void;
  onGoBack?: () => void;
}

/**
 * Detect common Convex error patterns
 */
function analyzeConvexError(error: Error | null): {
  type: 'network' | 'timeout' | 'permission' | 'auth' | 'quota' | 'unknown';
  message: string;
  suggestion: string;
} {
  if (!error) {
    return {
      type: 'unknown',
      message: 'An unknown error occurred',
      suggestion: 'Try again or contact support if the problem persists.',
    };
  }

  const msg = error.message.toLowerCase();

  if (msg.includes('network') || msg.includes('fetch') || msg.includes('connection')) {
    return {
      type: 'network',
      message: 'Network Connection Error',
      suggestion:
        'Check your internet connection and try again. Your data will sync when you reconnect.',
    };
  }

  if (msg.includes('timeout') || msg.includes('took too long')) {
    return {
      type: 'timeout',
      message: 'Request Timed Out',
      suggestion:
        'The request took too long. Check your connection and try again.',
    };
  }

  if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('unauthenticated')) {
    return {
      type: 'auth',
      message: 'Authentication Error',
      suggestion: 'Your session has expired. Please sign in again.',
    };
  }

  if (msg.includes('403') || msg.includes('permission') || msg.includes('forbidden')) {
    return {
      type: 'permission',
      message: 'Permission Denied',
      suggestion:
        "You don't have permission to perform this action. Try signing out and back in.",
    };
  }

  if (msg.includes('quota') || msg.includes('limit')) {
    return {
      type: 'quota',
      message: 'Limit Exceeded',
      suggestion:
        'You may have reached a limit. Contact support if you need an increase.',
    };
  }

  return {
    type: 'unknown',
    message: 'Something went wrong',
    suggestion:
      'An unexpected error occurred. Your data is safe. Try again or contact support.',
  };
}

export function ConvexErrorHandler({
  error,
  onRetry,
  onGoBack,
}: ConvexErrorHandlerProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const errorInfo = analyzeConvexError(error);

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: colors.background,
      flex: 1,
      justifyContent: 'center',
      paddingBottom: insets.bottom,
      paddingHorizontal: 24,
      paddingTop: insets.top,
    },
    emoji: {
      fontSize: 64,
      marginBottom: 16,
    },
    header: {
      color: colors.text.primary,
      fontSize: 22,
      fontWeight: '600',
      marginBottom: 8,
      textAlign: 'center',
    },
    message: {
      color: colors.text.secondary,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: 16,
      textAlign: 'center',
    },
    suggestion: {
      backgroundColor: colors.card,
      borderLeftColor: colors.primary[600],
      borderLeftWidth: 4,
      borderRadius: 8,
      marginBottom: 24,
      marginTop: 16,
      padding: 12,
    },
    suggestionText: {
      color: colors.text.secondary,
      fontSize: 13,
      lineHeight: 18,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      width: '100%',
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: colors.primary[600],
      borderRadius: 12,
      flex: 1,
      paddingVertical: 12,
    },
    primaryButtonText: {
      color: colors.text.inverse,
      fontSize: 17,
      fontWeight: '600',
    },
    secondaryButton: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      flex: 1,
      paddingVertical: 12,
    },
    secondaryButtonText: {
      color: colors.text.secondary,
      fontSize: 17,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={styles.header}>{errorInfo.message}</Text>
      <Text style={styles.message}>Your data is safe.</Text>

      <View style={styles.suggestion}>
        <Text style={styles.suggestionText}>{errorInfo.suggestion}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.primaryButton} onPress={onRetry}>
          <Text style={styles.primaryButtonText}>Try Again</Text>
        </Pressable>
        {onGoBack && (
          <Pressable style={styles.secondaryButton} onPress={onGoBack}>
            <Text style={styles.secondaryButtonText}>Go Back</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
