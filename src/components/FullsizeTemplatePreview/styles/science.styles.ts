/**
 * Science box styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { borderRadius } from '../../../theme/spacing';
import { typography } from '@/theme/typography';

/** Blue-200 border for research link button */
const LINK_BORDER = '#BFDBFE';

export const scienceStyles = StyleSheet.create({
  researchLinkButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary[100],
    borderColor: LINK_BORDER,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  researchLinkText: {
    color: colors.secondary[600],
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
  },
  scienceBox: {
    backgroundColor: colors.primary[100],
    borderColor: colors.primary[300],
    borderRadius: borderRadius.large,
    borderWidth: 2,
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
  },
  scienceDivider: {
    backgroundColor: colors.primary[300],
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
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  scienceQuote: {
    color: colors.primary[700],
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 24,
  },
});
