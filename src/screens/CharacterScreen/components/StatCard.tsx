import { Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { spacing, borderRadius } from '../../../theme/spacing';
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
      entering={FadeInDown.delay(delay).springify().damping(18)}
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
    alignItems: 'center',
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'column',
    gap: spacing.xs,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  emoji: {
    fontSize: 24,
    lineHeight: 32,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  value: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    lineHeight: 22,
  },
});
