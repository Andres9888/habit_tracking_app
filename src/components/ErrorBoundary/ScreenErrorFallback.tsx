/* eslint-disable max-lines */
/**
 * ScreenErrorFallback - Lightweight error fallback for individual screens
 * Designed to prevent one screen crash from killing the entire app
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../theme/ThemeContext';
import { fontFamilies } from '../../theme/typography';

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
      borderRadius: 8,
      marginTop: 24,
      padding: 12,
      width: '100%',
    },
    errorStack: {
      color: colors.text.tertiary,
      fontFamily: 'Courier',
      fontSize: 10,
      marginTop: 8,
    },
    errorText: {
      color: colors.text.secondary,
      fontSize: 13,
      fontFamily: 'Courier',
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: colors.primary[500],
      borderRadius: 12,
      marginTop: 24,
      paddingHorizontal: 32,
      paddingVertical: 16,
      shadowColor: colors.primary[500],
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    primaryButtonText: {
      color: colors.text.inverse,
      fontFamily: fontFamilies.primary.text,
      fontSize: 17,
      fontWeight: '600',
    },
    secondaryButton: {
      alignItems: 'center',
      marginTop: 12,
      paddingVertical: 12,
    },
    secondaryButtonText: {
      color: colors.text.secondary,
      fontFamily: fontFamilies.primary.text,
      fontSize: 17,
      fontWeight: '500',
    },
    subtitle: {
      color: colors.text.secondary,
      fontFamily: fontFamilies.primary.text,
      fontSize: 14,
      lineHeight: 22,
      marginTop: 8,
      textAlign: 'center',
    },
    title: {
      color: colors.text.primary,
      fontFamily: fontFamilies.primary.display,
      fontSize: 22,
      fontWeight: '600',
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
