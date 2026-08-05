/**
 * Science drill-down — "Why it works" credibility card styles: a flat surface
 * header (badge + read-paper pill), then the Literata lead and evidence callout.
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const scienceWhyStyles = StyleSheet.create({
  whyCard: {
    backgroundColor: colors.light.cardElevated,
    borderColor: colors.border,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.card,
  },
  whyHeader: {
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  whyBadge: {
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  whyBadgeText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.bold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  whyReadBtn: {
    alignItems: 'center',
    backgroundColor: colors.light.cardElevated,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 7,
    marginLeft: 'auto',
    paddingHorizontal: 13,
    paddingVertical: 7,
  },
  whyReadText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.bold,
  },
  whyBody: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
  },
  whyOverline: {
    color: colors.gray[500],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.bold,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  whyLead: {
    color: colors.gray[800],
    fontFamily: fontFamilies.primary.display,
    fontSize: 18,
    letterSpacing: -0.2,
    lineHeight: 27,
  },
});
