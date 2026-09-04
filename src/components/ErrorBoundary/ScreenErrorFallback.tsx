/* eslint-disable max-lines */
/**
 * ScreenErrorFallback - Lightweight error fallback for individual screens
 * Designed to prevent one screen crash from killing the entire app
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius } from '../../theme/spacing';
import { fontWeights, typography } from '../../theme/typography';

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
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();

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
    errorDetails: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.small,
      marginTop: 24,
      padding: 12,
      width: '100%',
    },
    errorStack: {
      color: colors.text.tertiary,
      fontFamily: 'Courier',
      fontSize: typography.tabBar.fontSize,
      marginTop: 8,
    },
    errorText: {
      color: colors.text.secondary,
      fontSize: typography.caption.fontSize,
      fontFamily: 'Courier',
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: colors.primary[700],
      borderRadius: borderRadius.button,
      marginTop: 24,
      paddingHorizontal: 32,
      paddingVertical: 16,
      shadowColor: colors.primary[500],
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    primaryButtonText: {
      ...typography.button,
      color: colors.text.inverse,
    },
    secondaryButton: {
      alignItems: 'center',
      marginTop: 12,
      paddingVertical: 12,
    },
    secondaryButtonText: {
      ...typography.body,
      color: colors.text.secondary,
      fontWeight: fontWeights.medium,
    },
    subtitle: {
      ...typography.bodySmall,
      color: colors.text.secondary,
      lineHeight: 22,
      marginTop: 8,
      textAlign: 'center',
    },
    title: {
      ...typography.heading1,
      color: colors.text.primary,
      fontWeight: fontWeights.semibold,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>😕</Text>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.subtitle}>
        {screenName} encountered an error, but your data is safe.
      </Text>

      <Pressable
        accessibilityLabel='Retry loading screen'
        accessibilityRole='button'
        style={styles.primaryButton}
        onPress={onRetry}
      >
        <Text style={styles.primaryButtonText}>Try Again</Text>
      </Pressable>

      {onGoBack ? <Pressable
          accessibilityLabel='Go back to previous screen'
          accessibilityRole='button'
          style={styles.secondaryButton}
          onPress={onGoBack}
        >
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </Pressable> : null}

      {__DEV__ && error ? <View style={styles.errorDetails}>
          <Text style={styles.errorText}>{error.message}</Text>
          <Text style={styles.errorStack}>{error.stack?.slice(0, 200)}</Text>
        </View> : null}
    </View>
  );
}
