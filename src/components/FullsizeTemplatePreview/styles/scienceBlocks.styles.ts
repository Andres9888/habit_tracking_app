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
  // Timeline
  spine: {
    backgroundColor: colors.border,
    borderRadius: 1,
    bottom: 14,
    left: 7,
    position: 'absolute',
    top: 8,
    width: 2,
  },
  tlRow: { flexDirection: 'row', gap: spacing.base, position: 'relative' },
  tlDot: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    height: 16,
    justifyContent: 'center',
    marginTop: 3,
    width: 16,
    zIndex: 1,
  },
  tlWhen: {
    fontFamily: fontFamilies.monospace,
    fontSize: 11,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  tlTitle: {
    color: colors.gray[800],
    fontFamily: fontFamilies.primary.text,
    fontSize: 15.5,
    fontWeight: fontWeights.semibold,
    lineHeight: 20,
    marginTop: 2,
  },
  tlDesc: { color: colors.gray[600], ...typography.caption, lineHeight: 18, marginTop: 2 },
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
