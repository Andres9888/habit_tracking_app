/**
 * "What to expect" timeline — Duolingo-weight path nodes (done/current/peak)
 * connected by a vertical spine.
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const scienceTimelineStyles = StyleSheet.create({
  spine: {
    backgroundColor: colors.border,
    borderRadius: 2,
    bottom: 14,
    left: 13,
    position: 'absolute',
    top: 14,
    width: 2,
  },
  tlRow: { flexDirection: 'row', gap: spacing.base, position: 'relative' },
  tlDot: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 2.5,
    height: 28,
    justifyContent: 'center',
    width: 28,
    zIndex: 1,
  },
  tlDotDone: { backgroundColor: colors.primary[600], borderColor: colors.primary[600] },
  tlDotCurrent: { backgroundColor: '#FFFFFF', borderColor: colors.primary[600] },
  tlDotPeak: { backgroundColor: colors.streak[300], borderColor: colors.streak[300] },
  tlWhen: {
    fontFamily: fontFamilies.monospace,
    fontSize: 11,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.3,
    marginTop: 4,
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
});
