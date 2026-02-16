/**
 * LoadingSkeleton - Animated skeleton placeholders for loading state
 *
 * Renders skeleton placeholders matching the layout:
 * - Hero icon (80x80)
 * - Headline (260x32)
 * - Input (100%x56)
 * - Chips (3 pill shapes)
 * - CTA button (100%x56)
 */

import { StyleSheet, View } from 'react-native';

import { BORDER_RADIUS } from '../constants';
import { SKELETON_DIMENSIONS } from './constants';
import { ShimmerSkeleton } from './ShimmerSkeleton';

export function LoadingSkeleton() {
  return (
    <View
      accessibilityLabel='Loading your habits...'
      accessibilityRole='progressbar'
      style={styles.container}
    >
      {/* Hero Icon Skeleton */}
      <ShimmerSkeleton
        borderRadius={BORDER_RADIUS.heroIcon}
        height={SKELETON_DIMENSIONS.hero.height}
        width={SKELETON_DIMENSIONS.hero.width}
      />

      {/* Headline Skeleton */}
      <ShimmerSkeleton
        borderRadius={8}
        height={SKELETON_DIMENSIONS.headline.height}
        style={styles.headline}
        width={SKELETON_DIMENSIONS.headline.width}
      />

      {/* Input Skeleton */}
      <View style={styles.inputContainer}>
        <ShimmerSkeleton
          borderRadius={BORDER_RADIUS.input}
          height={SKELETON_DIMENSIONS.input.height}
          width='100%'
        />
      </View>

      {/* Chips Row Skeleton - 3 pill shapes */}
      <View style={styles.chipsContainer}>
        <ShimmerSkeleton
          borderRadius={BORDER_RADIUS.chip}
          height={SKELETON_DIMENSIONS.chip.height}
          width={SKELETON_DIMENSIONS.chip.width}
        />
        <ShimmerSkeleton
          borderRadius={BORDER_RADIUS.chip}
          height={SKELETON_DIMENSIONS.chip.height}
          style={styles.chipSpacing}
          width={SKELETON_DIMENSIONS.chip.width}
        />
        <ShimmerSkeleton
          borderRadius={BORDER_RADIUS.chip}
          height={SKELETON_DIMENSIONS.chip.height}
          style={styles.chipSpacing}
          width={SKELETON_DIMENSIONS.chip.width}
        />
      </View>

      {/* CTA Button Skeleton */}
      <View style={styles.ctaContainer}>
        <ShimmerSkeleton
          borderRadius={BORDER_RADIUS.cta}
          height={SKELETON_DIMENSIONS.cta.height}
          width='100%'
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chipsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    width: '100%',
  },
  chipSpacing: {
    marginLeft: 12,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  ctaContainer: {
    width: '100%',
  },
  headline: {
    marginBottom: 32,
    marginTop: 32,
  },
  inputContainer: {
    marginBottom: 24,
    width: '100%',
  },
});
