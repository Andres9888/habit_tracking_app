/**
 * Styles for FeaturedPickCard.
 */

import { StyleSheet } from 'react-native';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

export const styles = StyleSheet.create({
  accent: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 4,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  card: {
    ...shadows.card,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    marginHorizontal: spacing.base,
    overflow: 'hidden',
    padding: spacing.base,
  },
  description: {
    ...typography.bodySmall,
    marginTop: 2,
  },
  icon: {
    alignItems: 'center',
    borderRadius: borderRadius.large,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  iconText: {
    fontSize: 26,
  },
  label: {
    ...typography.overline,
    marginBottom: spacing.sm,
  },
  metaLine: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  name: {
    ...typography.heading3,
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
    fontWeight: fontWeights.medium,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  science: {
    ...typography.caption,
    fontSize: 11.5,
  },
});
