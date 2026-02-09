/**
 * ChartLoadingSkeleton - Loading state for analytics charts
 */
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export const ChartLoadingSkeleton: React.FC = () => {
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          duration: 1000,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          duration: 1000,
          toValue: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.titleSkeleton, { opacity }]} />
      <View style={styles.chartArea}>
        <Animated.View style={[styles.chartBar, { height: 120, opacity }]} />
        <Animated.View style={[styles.chartBar, { height: 80, opacity }]} />
        <Animated.View style={[styles.chartBar, { height: 150, opacity }]} />
        <Animated.View style={[styles.chartBar, { height: 100, opacity }]} />
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
  chartBar: {
    backgroundColor: colors.border,
    borderRadius: 4,
    flex: 1,
  },
  container: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  titleSkeleton: {
    backgroundColor: colors.border,
    borderRadius: 4,
    height: 20,
    width: 180,
  },
});
