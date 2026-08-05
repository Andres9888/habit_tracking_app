/**
 * LoadingState - Skeleton loader for archived habits
 * Uses the central SkeletonLoader with gradient shimmer.
 * Supports dark mode via useSkeletonTheme.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../theme/spacing';
import { SkeletonLoader } from '../../SkeletonLoader';
import { useSkeletonTheme } from '../../SkeletonLoader/useSkeletonTheme';

export const LoadingState: React.FC = () => {
  const { surfaceBg, borderColor } = useSkeletonTheme();
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((key) => (
        <View
          key={key}
          style={[
            styles.cardSkeleton,
            { backgroundColor: surfaceBg, borderColor },
          ]}
        >
          <View style={styles.header}>
            <SkeletonLoader borderRadius={24} height={48} width={48} />
            <View style={styles.textBlock}>
              <SkeletonLoader
                borderRadius={4}
                height={16}
                style={{ marginBottom: spacing.xs }}
                width={140}
              />
              <SkeletonLoader borderRadius={4} height={12} width={80} />
            </View>
          </View>
          <View style={styles.buttonRow}>
            <View style={{ flex: 1 }}>
              <SkeletonLoader borderRadius={8} height={40} />
            </View>
            <View style={{ flex: 1 }}>
              <SkeletonLoader borderRadius={8} height={40} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  cardSkeleton: {
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  container: {
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  textBlock: {
    flex: 1,
  },
});
