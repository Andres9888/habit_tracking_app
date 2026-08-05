/**
 * Science drill-down — "From the research" evidence callout: a boxed stat with a
 * mono label, body sentence, and a derived citation line.
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const scienceEvidenceStyles = StyleSheet.create({
  callout: {
    backgroundColor: colors.gray[50],
    borderColor: colors.border,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    marginTop: spacing.base,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  label: {
    color: colors.gray[500],
    fontFamily: fontFamilies.monospace,
    fontSize: 10,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.8,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  body: {
    color: colors.gray[600],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    lineHeight: 20,
  },
  cite: {
    color: colors.gray[500],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.semibold,
    marginTop: 8,
  },
  citeJournal: { fontStyle: 'italic', fontWeight: fontWeights.medium },
});
