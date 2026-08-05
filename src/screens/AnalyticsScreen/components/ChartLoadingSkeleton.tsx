/**
 * ChartLoadingSkeleton - Loading state for analytics charts
 * Uses the central SkeletonLoader with gradient shimmer.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';
import { SkeletonLoader } from '../../../components/SkeletonLoader';

export const ChartLoadingSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <SkeletonLoader borderRadius={4} height={20} width={180} />
      <View style={styles.chartArea}>
        <View style={{ flex: 1 }}>
          <SkeletonLoader borderRadius={4} height={120} />
        </View>
        <View style={{ flex: 1 }}>
          <SkeletonLoader borderRadius={4} height={80} />
        </View>
        <View style={{ flex: 1 }}>
          <SkeletonLoader borderRadius={4} height={150} />
        </View>
        <View style={{ flex: 1 }}>
          <SkeletonLoader borderRadius={4} height={100} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartArea: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.md,
    height: 180,
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  container: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
});
