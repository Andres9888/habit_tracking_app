/**
 * Science & Evidence section layout and header styles
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography, fontWeights, fontFamilies } from '@/theme/typography';

export const evidenceStyles = StyleSheet.create({
  divider: {
    backgroundColor: `${colors.primary[500]}20`,
    height: 1,
    marginBottom: 14,
  },
  gradient: {
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  headerLabel: {
    color: colors.primary[700],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.bold,
  },
  quoteText: {
    color: colors.primary[700],
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  researchLink: {
    ...typography.caption,
    alignSelf: 'flex-start',
    borderBottomColor: `${colors.primary[600]}66`,
    borderBottomWidth: 1,
    color: colors.primary[600],
    fontWeight: fontWeights.semibold,
    marginTop: spacing.sm,
    paddingBottom: 1,
  },
  section: {
    borderLeftColor: colors.primary[500],
    borderLeftWidth: 3,
    borderRadius: borderRadius.large,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
});
