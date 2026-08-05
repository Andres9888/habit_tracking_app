import { Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { durations, enterEasing } from '../../../theme/animations';
import { useThemeColors } from '../../../theme/ThemeContext';
import { spacing, borderRadius, shadows } from '../../../theme/spacing';
import { typography, fontWeights } from '../../../theme/typography';
import type { StatCardProps } from '../types';

export function StatCard({
  emoji,
  value,
  label,
  delay = 0,
}: StatCardProps & { delay?: number }) {
  const { colors } = useThemeColors();
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(durations.enter).easing(enterEasing)}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          shadowColor: colors.text.primary,
        },
      ]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text
        style={[styles.value, { color: colors.text.primary }]}
      >
        {value}
      </Text>
      <Text
        style={[styles.label, { color: colors.text.secondary }]}
      >
        {label}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.floatingActionButton,
    alignItems: 'center',
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'column',
    gap: spacing.xs,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
  },
  emoji: {
    fontSize: typography.heading2.fontSize,
    lineHeight: 28,
  },
  label: {
    fontSize: typography.caption.fontSize,
    lineHeight: 18,
    textAlign: 'center',
  },
  value: {
    fontSize: typography.body.fontSize,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.41,
    lineHeight: 22,
  },
});
