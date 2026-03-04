/**
 * UsageBanner - Shows free habit usage (e.g. "1 of 3 free habits used")
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';
import { useUsageBanner } from './UsageBanner.hooks';
import type { UsageBannerProps } from './UsageBanner.types';

export function UsageBanner({
  isPremiumUser,
  onShowPaywall,
  userHabitCount,
}: UsageBannerProps) {
  const { dots, limit, showBanner, showUnlockCta, used } = useUsageBanner(
    userHabitCount,
    isPremiumUser
  );

  if (!showBanner) return null;

  return (
    <View testID="templates-usage-banner" style={s.container}>
      <View style={s.content}>
        <Text style={s.label}>
          {used} of {limit} free habits used
        </Text>
        <View testID="templates-usage-dots" accessibilityLabel={`${used} of ${limit} habits used`} accessibilityRole="progressbar" style={s.dots}>
          {dots.map((filled, i) => (
            <View
              key={i}
              style={[s.dot, filled ? s.dotFilled : s.dotEmpty]}
            />
          ))}
        </View>
      </View>
      {showUnlockCta && (
        <Pressable
          testID="templates-usage-unlock-cta"
          accessibilityLabel="Unlock all habits"
          accessibilityRole="button"
          style={s.cta}
          onPress={onShowPaywall}
        >
          <Text style={s.ctaText}>Unlock All</Text>
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.light.surfaceMuted,
    borderColor: colors.border,
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
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.small,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  ctaText: {
    ...typography.caption,
    color: colors.text.inverse,
    fontWeight: '700',
  },
  dot: {
    borderRadius: borderRadius.full,
    height: 8,
    width: 8,
  },
  dotEmpty: {
    backgroundColor: colors.gray[200],
  },
  dotFilled: {
    backgroundColor: colors.primary[600],
  },
  dots: { flexDirection: 'row', gap: spacing.xs },
  label: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});
