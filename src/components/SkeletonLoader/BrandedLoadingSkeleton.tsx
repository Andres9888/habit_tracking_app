/**
 * BrandedLoadingSkeleton - Replaces the spinner in AuthGate's loading screen
 * Shows branded Chain Day shimmer while auth initializes
 * Layout: chain icon, app name shimmer, 3 habit card placeholders
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';
import { HabitCardSkeleton } from './HabitCardSkeleton';

function ChainIcon() {
  return (
    <View style={styles.iconContainer}>
      <Text style={styles.iconText}>🔗</Text>
    </View>
  );
}

export function BrandedLoadingSkeleton() {
  return (
    <View
      accessible
      accessibilityLabel='Loading Chain Day'
      accessibilityRole='progressbar'
      style={styles.container}
    >
      <View style={styles.header}>
        <ChainIcon />
        <Text style={styles.appName}>Chain Day</Text>
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
    color: '#1c1917',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.35,
    marginTop: 12,
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  container: {
    backgroundColor: '#FAF8F5',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderRadius: 20,
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
