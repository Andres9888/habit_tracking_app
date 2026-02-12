/**
 * AnalyticsHeader - Screen header with title and subtitle
 * OPTIMIZED: FadeInDown animation, type scale 28/17
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export const AnalyticsHeader: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      accessible
      accessibilityLabel='Analytics Screen'
      accessibilityRole='header'
      style={[styles.header, { paddingTop: Math.max(insets.top + 8, 16) }]}
    >
      <Animated.Text
        accessibilityLabel='Analytics'
        accessibilityRole='text'
        entering={FadeInDown.delay(0).springify().damping(18)}
        style={styles.headerTitle}
      >
        Analytics
      </Animated.Text>
      <Animated.Text
        accessibilityLabel='Track your habit journey'
        accessibilityRole='text'
        entering={FadeInDown.delay(50).springify().damping(18)}
        style={styles.headerSubtitle}
      >
        Track your habit journey
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerSubtitle: {
    color: colors.text.secondary,
    fontSize: 17,
    letterSpacing: -0.41,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.35,
    lineHeight: 28,
  },
});
