/**
 * UsageBanner - Shows free habit usage (e.g. "1 of 3 free habits used")
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { typography, fontWeights } from '../../../../theme/typography';
import { useUsageBanner } from './UsageBanner.hooks';
import type { UsageBannerProps } from './UsageBanner.types';

export function UsageBanner({
  isPremiumUser,
  onShowPaywall,
  userHabitCount,
}: UsageBannerProps) {
  const { colors } = useThemeColors();
  const { dots, limit, showBanner, showUnlockCta, used } = useUsageBanner(
    userHabitCount,
    isPremiumUser
  );

  if (!showBanner) return null;

  return (
    <View testID="templates-usage-banner" style={[s.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={s.content}>
        <Text style={[s.label, { color: colors.text.secondary }]}>
          {used} of {limit} free habits used
        </Text>
        <View testID="templates-usage-dots" accessibilityLabel={`${used} of ${limit} habits used`} accessibilityRole="progressbar" style={s.dots}>
          {dots.map((filled, i) => (
            <View
              key={i}
              style={[s.dot, { backgroundColor: filled ? colors.primary[600] : colors.gray[200] }]}
            />
          ))}
        </View>
      </View>
      {showUnlockCta ? <Pressable
          testID="templates-usage-unlock-cta"
          accessibilityLabel="Unlock all habits"
          accessibilityRole="button"
          style={[s.cta, { backgroundColor: colors.primary[600] }]}
          onPress={onShowPaywall}
        >
          <Text style={[s.ctaText, { color: colors.text.inverse }]}>Unlock All</Text>
        </Pressable> : null}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.base,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  content: { flex: 1, gap: spacing.xs },
  cta: {
    borderRadius: borderRadius.small,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  ctaText: {
    ...typography.caption,
    fontWeight: fontWeights.bold,
  },
  dot: {
    borderRadius: borderRadius.full,
    height: 8,
    width: 8,
  },
  dots: { flexDirection: 'row', gap: spacing.xs },
  label: {
    ...typography.caption,
  },
});
