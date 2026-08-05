/**
 * Science drill-down — block styles: "What you'll feel" benefits and
 * "How to start" steps. Timeline styles live in scienceTimeline.styles.ts.
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
    borderRadius: 11,
    height: 22,
    justifyContent: 'center',
    marginTop: 1,
    width: 22,
  },
  stepNumText: { color: '#FFFFFF', ...typography.caption, fontWeight: fontWeights.bold },
  stepText: {
    color: colors.gray[700],
    fontFamily: fontFamilies.primary.text,
    fontSize: 15.5,
    lineHeight: 22,
  },
  cadenceRow: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.base,
    paddingTop: spacing.base,
  },
  cadenceLabel: {
    color: colors.streak[700],
    ...typography.bodySmall,
    fontWeight: fontWeights.bold,
  },
  cadenceValue: { color: colors.gray[600], ...typography.bodySmall, marginLeft: 'auto' },
});
