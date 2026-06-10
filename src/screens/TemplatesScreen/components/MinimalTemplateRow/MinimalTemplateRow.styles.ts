/**
 * Styles for MinimalTemplateRow.
 */

import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

export const styles = StyleSheet.create({
  body: {
    flex: 1,
    minWidth: 0,
  },
  description: {
    ...typography.caption,
    fontWeight: fontWeights.regular,
    marginTop: 1,
  },
  icon: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  iconText: {
    fontSize: 22,
  },
  metaLine: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  name: {
    ...typography.body,
    fontWeight: fontWeights.semibold,
  },
  pill: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  pillLabel: {
    ...typography.caption,
    fontSize: 11.5,
  },
  row: {
    alignItems: 'center',
    borderRadius: borderRadius.card,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.base,
    padding: spacing.md,
  },
  science: {
    ...typography.caption,
    fontSize: 11.5,
  },
});
