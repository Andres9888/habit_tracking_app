/**
 * Science drill-down — block styles: "What you'll feel" benefits,
 * "What to expect" timeline, and "How to start" steps.
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const scienceBlockStyles = StyleSheet.create({
  // Benefits
  benefitRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: 13,
  },
  benefitIcon: {
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    borderRadius: borderRadius.medium,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  benefitTitle: {
    color: colors.gray[800],
    fontFamily: fontFamilies.primary.text,
    fontSize: 15.5,
    fontWeight: fontWeights.semibold,
    lineHeight: 20,
  },
  benefitDesc: { color: colors.gray[600], ...typography.caption, marginTop: 1 },
  // How to start
  stepRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md },
  stepNum: {
    alignItems: 'center',
    backgroundColor: colors.primary[600],
    borderRadius: 14,
    boxShadow: `0 2px 0 ${colors.primary[700]}`,
    height: 28,
    justifyContent: 'center',
    marginTop: 1,
    width: 28,
  },
  stepNumText: { color: '#FFFFFF', ...typography.bodySmall, fontWeight: fontWeights.bold },
  stepText: {
    color: colors.gray[700],
    fontFamily: fontFamilies.primary.text,
    fontSize: 15.5,
    lineHeight: 22,
  },
  cadenceRow: {
    alignItems: 'center',
    backgroundColor: colors.streak[100],
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.base,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  cadenceLabel: {
    color: colors.streak[700],
    ...typography.bodySmall,
    fontWeight: fontWeights.bold,
  },
  cadenceValue: { color: colors.gray[600], ...typography.bodySmall, marginLeft: 'auto' },
});
