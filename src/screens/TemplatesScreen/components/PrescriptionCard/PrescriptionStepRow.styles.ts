import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

export const stepStyles = StyleSheet.create({
  body: { flex: 1, minWidth: 0 },
  chevron: {
    flexShrink: 0,
    fontSize: 16,
    fontWeight: fontWeights.semibold,
  },
  icon: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    flexShrink: 0,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  iconText: { fontSize: 20 },
  meta: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: 2,
  },
  name: { ...typography.bodySmall, fontWeight: fontWeights.semibold },
  reason: {
    ...typography.caption,
    flexShrink: 1,
    fontSize: 11.5,
  },
  row: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  stepBadge: {
    borderRadius: borderRadius.full,
    flexShrink: 0,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  stepBadgeText: { fontSize: 10, fontWeight: fontWeights.bold },
});
