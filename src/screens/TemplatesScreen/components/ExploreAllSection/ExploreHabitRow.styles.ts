/**
 * Styles for ExploreHabitRow
 */

import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

export const s = StyleSheet.create({
  addBtn: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    flexShrink: 0,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  badge: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 10, fontWeight: fontWeights.semibold },
  desc: { ...typography.caption, lineHeight: 17 },
  dot: { borderRadius: 4, height: 3, width: 3 },
  emoji: { fontSize: 20 },
  freq: { ...typography.caption },
  iconBox: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    flexShrink: 0,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  info: { flex: 1, gap: spacing.xs, minWidth: 0 },
  meta: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  name: { ...typography.body, fontWeight: fontWeights.semibold },
  row: {
    alignItems: 'center',
    borderRadius: borderRadius.large,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.base,
    marginVertical: spacing.xs,
    padding: spacing.md,
  },
});
