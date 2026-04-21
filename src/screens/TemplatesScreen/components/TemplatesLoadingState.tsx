/** TemplatesLoadingState - Shimmer animation, stagger, shadows */
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { ShimmerBox } from './ShimmerBox';
import { SkeletonCard } from './SkeletonCard';

const CHIP_WIDTHS = [64, 86, 78, 74, 68, 82];

export function TemplatesLoadingState() {
  const { colors } = useThemeColors();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[typography.heading1, { color: colors.text.primary }]}>
          Templates
        </Text>
        <Text
          style={[
            typography.body,
            { color: colors.text.secondary, marginTop: spacing.xs },
          ]}
        >
          Start with a category, a curated collection, or a quick add
        </Text>
      </View>
      <Animated.View
        entering={FadeInDown.duration(280).springify().damping(18)}
        style={styles.searchShimmer}
      >
        <ShimmerBox height={48} style={styles.searchShimmerBox} width='100%' />
      </Animated.View>
      <View style={styles.chipRow}>
        {CHIP_WIDTHS.map((w, i) => (
          <ShimmerBox
            key={i}
            height={36}
            style={styles.chipShimmer}
            width={w}
          />
        ))}
      </View>
      {[0, 1, 2, 3].map((i) => (
        <SkeletonCard key={i} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.base,
    paddingHorizontal: spacing.base,
  },
  chipShimmer: {
    borderRadius: borderRadius.full,
  },
  header: {
    paddingBottom: spacing.base,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  root: {
    flex: 1,
  },
  searchShimmer: {
    marginBottom: spacing.base,
    marginHorizontal: spacing.lg,
  },
  searchShimmerBox: {
    borderRadius: borderRadius.xl,
  },
});
