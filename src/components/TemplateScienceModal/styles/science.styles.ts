/**
 * Science section styles for TemplateScienceModal
 */

import { StyleSheet } from 'react-native';
import { borderRadius } from '../../../theme/spacing';
import { typography } from '@/theme/typography';
import type { SemanticColors } from '../../../theme/darkColors';

export const scienceStyles = StyleSheet.create({
  citationDot: {
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
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  citationText: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  linkButton: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  linkText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '700',
  },
  whyItWorksContainer: {
    borderRadius: borderRadius.large,
    borderWidth: 1,
    padding: 18,
  },
  whyItWorksEmoji: {
    fontSize: 17,
  },
  whyItWorksHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  whyItWorksText: {
    fontSize: 13,
    lineHeight: 24,
  },
  whyItWorksTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export function themedScienceStyles(colors: SemanticColors, isDark: boolean) {
  return {
    citationDot: { backgroundColor: isDark ? colors.primary[400] : '#10B981' },
    citationLabel: { color: colors.text.tertiary },
    citationText: { color: colors.text.secondary },
    linkButton: {
      backgroundColor: isDark ? colors.gray[100] : '#EFF6FF',
      borderColor: isDark ? colors.gray[200] : '#BFDBFE',
    },
    linkText: { color: isDark ? colors.primary[400] : '#2563EB' },
    whyItWorksContainer: {
      backgroundColor: isDark ? colors.primary[100] : '#F0FDF4',
      borderColor: isDark ? colors.primary[300] : '#BBF7D0',
    },
    whyItWorksText: { color: isDark ? colors.primary[500] : '#166534' },
    whyItWorksTitle: { color: isDark ? colors.primary[400] : '#15803D' },
  } as const;
}
