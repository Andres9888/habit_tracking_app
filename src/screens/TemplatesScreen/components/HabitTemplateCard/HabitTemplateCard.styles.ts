/**
 * Styles for HabitTemplateCard.
 */

import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

export const styles = StyleSheet.create({
  addSlot: { flexShrink: 0 },
  body: { flex: 1, minWidth: 0 },
  bottomRail: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // Align with the text column: icon (44) + topRow gap (spacing.md).
    marginLeft: 44 + spacing.md,
    marginTop: spacing.sm + 3,
    paddingTop: spacing.sm + 2,
  },
  card: {
    borderRadius: borderRadius.large,
    borderWidth: 1,
    marginBottom: spacing.sm + 1,
    marginHorizontal: spacing.base,
    padding: 14,
  },
  description: {
    fontSize: 13,
    fontWeight: fontWeights.regular,
    lineHeight: 18.85,
    marginTop: spacing.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  icon: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  iconText: { fontSize: 22 },
  metaPillLabel: {
    ...typography.caption,
    borderRadius: borderRadius.full,
    fontSize: 11.5,
    lineHeight: 16,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  name: { ...typography.body, fontWeight: fontWeights.semibold },
  topPickBadge: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.small,
    borderWidth: 1,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  topRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md },
  viewDetails: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: fontWeights.bold,
  },
});
