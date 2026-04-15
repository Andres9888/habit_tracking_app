/**
 * Styles for TemplatesListEmpty
 */

import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';

export const s = StyleSheet.create({
  actions: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.base },
  createBtn: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  createText: { ...typography.bodySmall, fontWeight: fontWeights.semibold },
  pill: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  pillIcon: { fontSize: 14 },
  pillLabel: { ...typography.caption, fontWeight: fontWeights.semibold },
  pillScroll: { marginTop: spacing.base },
  pills: { gap: spacing.sm, paddingHorizontal: spacing.base },
  wrapper: { alignItems: 'center', paddingVertical: spacing.xl },
});
