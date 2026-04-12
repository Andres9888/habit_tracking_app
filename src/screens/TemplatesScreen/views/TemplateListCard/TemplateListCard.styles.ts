/**
 * Styles for TemplateListCard and its sub-components.
 */

import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { typography, fontWeights } from '../../../../theme/typography';

export const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.large,
    borderWidth: 1,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
    padding: spacing.base,
  },
  contentColumn: {
    flex: 1,
    gap: spacing.xs,
  },
  description: {
    ...typography.bodySmall,
  },
  iconText: {
    fontSize: 22,
  },
  iconWrapper: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  matchRow: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  matchText: {
    ...typography.caption,
    fontWeight: fontWeights.bold,
  },
  metaLabel: {
    ...typography.caption,
    fontWeight: fontWeights.semibold,
  },
  metaPill: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  title: {
    ...typography.body,
    fontWeight: fontWeights.semibold,
  },
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
});
