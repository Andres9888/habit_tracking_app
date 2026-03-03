/**
 * Science section styles for TemplateScienceModal
 */

import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { borderRadius } from '@/theme/spacing';
import { typography } from '@/theme/typography';

/** Blue-200 border for science link button */
const LINK_BORDER = '#BFDBFE';

export const scienceStyles = StyleSheet.create({
  citationDot: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.xs,
    height: 8,
    width: 8,
  },
  citationHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  citationLabel: {
    color: colors.gray[500],
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  citationText: {
    color: colors.gray[700],
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  linkButton: {
    alignItems: 'center',
    backgroundColor: colors.secondary[100],
    borderColor: LINK_BORDER,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  linkText: {
    color: colors.secondary[600],
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '700',
  },
  whyItWorksContainer: {
    backgroundColor: colors.primary[100],
    borderColor: colors.primary[300],
    borderRadius: borderRadius.large,
    borderWidth: 1,
    padding: 18,
  },
  whyItWorksEmoji: {
    fontSize: 18,
  },
  whyItWorksHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  whyItWorksText: {
    color: colors.primary[700],
    fontSize: 15,
    lineHeight: 24,
  },
  whyItWorksTitle: {
    color: colors.primary[700],
    fontSize: 15,
    fontWeight: '700',
  },
});
