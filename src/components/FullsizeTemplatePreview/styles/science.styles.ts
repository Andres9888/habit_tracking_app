/**
 * Science box styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography, fontWeights, fontFamilies } from '@/theme/typography';

export const scienceStyles = StyleSheet.create({
  scienceBox: {
    backgroundColor: colors.primary[100],
    borderColor: colors.primary[100],
    borderRadius: borderRadius.large,
    borderWidth: 2,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  scienceDivider: {
    backgroundColor: colors.primary[100],
    height: 1,
    marginBottom: 12,
  },
  scienceHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  scienceIcon: {
    fontSize: typography.heading2.fontSize,
  },
  scienceLabel: {
    color: colors.primary[700],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  scienceQuote: {
    color: colors.primary[700],
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 24,
  },
});
