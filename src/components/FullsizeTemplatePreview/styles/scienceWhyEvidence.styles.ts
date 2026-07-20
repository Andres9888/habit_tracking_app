/**
 * "Why it works" — the bordered "from the research" evidence callout box.
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const scienceWhyEvidenceStyles = StyleSheet.create({
  whyEvidenceBox: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  whyEvidenceLabel: {
    color: colors.gray[500],
    fontFamily: fontFamilies.monospace,
    fontSize: 10,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  whyEvidence: {
    color: colors.gray[600],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    lineHeight: 20,
  },
  whyEvidenceCite: {
    color: colors.gray[500],
    fontFamily: fontFamilies.primary.text,
    fontSize: 12,
    fontWeight: fontWeights.semibold,
    marginTop: spacing.sm,
  },
});
