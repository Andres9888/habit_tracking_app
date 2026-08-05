/**
 * Science & Evidence section styles — citation footnote layout.
 *
 * Two-zone layout: green gradient hero + neutral tips zone.
 * Pill, citation lines, and "why it works" overline.
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const evidenceStyles = StyleSheet.create({
  bottomZone: {
    backgroundColor: colors.gray[50],
    borderTopColor: colors.gray[200],
    borderTopWidth: 1,
    padding: spacing.lg,
  },
  citation: {
    marginBottom: spacing.lg,
  },
  paperText: {
    color: colors.gray[600],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  pill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    gap: 7,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    ...shadows.subtle,
  },
  pillText: {
    color: colors.primary[700],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.overline.fontSize,
    fontWeight: fontWeights.bold,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderLeftColor: colors.primary[600],
    borderLeftWidth: 3,
    borderRadius: borderRadius.large,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  sourceText: {
    color: colors.gray[800],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.semibold,
    marginBottom: 4,
  },
  topZone: {
    padding: spacing.lg,
  },
  whyOverline: {
    color: colors.primary[700],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.overline.fontSize,
    fontWeight: fontWeights.bold,
    letterSpacing: 1.6,
    marginBottom: spacing.lg,
    marginTop: spacing.lg,
    textTransform: 'uppercase',
  },
});
