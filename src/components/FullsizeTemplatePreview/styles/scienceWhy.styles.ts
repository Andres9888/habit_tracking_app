/**
 * Science drill-down — "Why it works" credibility card styles: accent bar,
 * gradient header with badge + read-paper pill, and the lead/evidence body.
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const scienceWhyStyles = StyleSheet.create({
  whyCard: {
    backgroundColor: colors.gray[50],
    borderColor: colors.border,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    ...shadows.card,
  },
  whyAccentBar: { bottom: 0, left: 0, position: 'absolute', top: 0, width: 4, zIndex: 2 },
  whyHeader: {
    alignItems: 'flex-start',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingLeft: spacing.base + 2,
    paddingVertical: spacing.base,
  },
  whyBadge: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 7,
    ...shadows.subtle,
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
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  whyReadText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.bold,
  },
  whyBody: {
    paddingHorizontal: spacing.base,
    paddingLeft: spacing.base + 2,
    paddingVertical: spacing.base,
  },
  whyOverline: {
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
