/**
 * BrandedLoadingScreen Component
 * Shows Chain Day branding during auth loading with a 10-second timeout.
 * Supports dark mode via useThemeColors.
 */

import { StyleSheet, Text, View } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';

import { LoadingTimeoutCard } from './LoadingTimeoutCard';
import { SkeletonLoader, HabitCardSkeleton } from '../SkeletonLoader';
import { useThemeColors } from '../../theme/ThemeContext';

const LOADING_TIMEOUT_MS = 10_000;

export function BrandedLoadingScreen() {
  const [timedOut, setTimedOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { colors, isDark } = useThemeColors();

  useEffect(() => {
    timerRef.current = setTimeout(() => setTimedOut(true), LOADING_TIMEOUT_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleRetry = useCallback(() => {
    setTimedOut(false);
    timerRef.current = setTimeout(() => setTimedOut(true), LOADING_TIMEOUT_MS);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: isDark ? '#064E3B' : '#ecfdf5' },
          ]}
        >
          <Text style={styles.iconText}>🔗</Text>
        </View>
        <Text style={[styles.appName, { color: colors.text.primary }]}>
          Chain Day
        </Text>
        {timedOut ? (
          <LoadingTimeoutCard onRetry={handleRetry} />
        ) : (
          <View style={styles.shimmerBar}>
            <SkeletonLoader borderRadius={4} height={4} width={120} />
          </View>
        )}
      </View>

      {/* Ghost habit cards */}
      <View style={styles.cardsPreview}>
        <HabitCardSkeleton />
        <HabitCardSkeleton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appName: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 32,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  content: { alignItems: 'center' },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 24,
    height: 64,
    justifyContent: 'center',
    marginBottom: 16,
    width: 64,
  },
  iconText: { fontSize: 28 },
  cardsPreview: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  shimmerBar: {
    marginTop: 12,
  },
});
