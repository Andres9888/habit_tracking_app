/**
 * BrandedLoadingSkeleton - Replaces the spinner in AuthGate's loading screen
 * Shows branded Chain Day shimmer while auth initializes
 * Layout: chain icon, app name shimmer, 3 habit card hints
 * Supports dark mode via useSkeletonTheme.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';
import { HabitCardSkeleton } from './HabitCardSkeleton';
import { useSkeletonTheme } from './useSkeletonTheme';
import { borderRadius } from '@/theme/spacing';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';

function ChainIcon({ isDark }: { isDark: boolean }) {
  return (
    <View
      style={[
        styles.iconContainer,
        { backgroundColor: isDark ? '#064E3B' : '#ecfdf5' },
      ]}
    >
      <Text style={styles.iconText}>🔗</Text>
    </View>
  );
}

export function BrandedLoadingSkeleton() {
  const { pageBg, isDark } = useSkeletonTheme();
  return (
    <View
      accessible
      accessibilityLabel='Loading Chain Day'
      accessibilityRole='progressbar'
      style={[styles.container, { backgroundColor: pageBg }]}
    >
      <View style={styles.header}>
        <ChainIcon isDark={isDark} />
        <Text
          style={[
            styles.appName,
            { color: isDark ? '#F9FAFB' : '#1c1917' },
          ]}
        >
          Chain Day
        </Text>
        {/* Subtle shimmer bar below title */}
        <View style={styles.shimmerBar}>
          <SkeletonLoader borderRadius={4} height={4} width={120} />
        </View>
      </View>

      {/* Ghost habit cards */}
      <View style={styles.cardsContainer}>
        <HabitCardSkeleton />
        <HabitCardSkeleton />
        <HabitCardSkeleton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appName: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.heading1.fontSize,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.35,
    marginTop: 12,
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  iconText: {
    fontSize: 32,
  },
  shimmerBar: {
    marginTop: 12,
  },
});
