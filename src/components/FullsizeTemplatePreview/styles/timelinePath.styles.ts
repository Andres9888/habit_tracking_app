/**
 * Science drill-down — "What to expect" timeline path: a vertical spine with
 * 42px milestone nodes; the peak node + row gets a gold wash.
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { borderRadius } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const timelinePathStyles = StyleSheet.create({
  spine: {
    backgroundColor: colors.border,
    borderRadius: 2,
    bottom: 22,
    left: 19,
    position: 'absolute',
    top: 20,
    width: 4,
  },
  row: { flexDirection: 'row', gap: 14, position: 'relative' },
  node: {
    alignItems: 'center',
    backgroundColor: colors.light.cardElevated,
    borderColor: colors.primary[600],
    borderRadius: 21,
    borderWidth: 3,
    boxShadow: '0 2px 0 rgba(4,120,87,0.18)',
    height: 42,
    justifyContent: 'center',
    width: 42,
    zIndex: 1,
  },
  nodePeak: {
    backgroundColor: colors.streak[100],
    borderColor: colors.streak[300],
    boxShadow: `0 3px 0 ${colors.streak[300]}`,
  },
  when: {
    color: colors.primary[700],
    fontFamily: fontFamilies.monospace,
    fontSize: 11,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.4,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  whenPeak: { color: colors.streak[700] },
  title: {
    color: colors.gray[800],
    fontFamily: fontFamilies.primary.text,
    fontSize: 15.5,
    fontWeight: fontWeights.semibold,
    lineHeight: 20,
    marginTop: 2,
  },
  desc: { color: colors.gray[600], ...typography.caption, lineHeight: 18, marginTop: 2 },
  peakWash: {
    backgroundColor: colors.streak[100],
    borderRadius: borderRadius.medium,
    marginHorizontal: -8,
    marginTop: -4,
    paddingHorizontal: 10,
    paddingTop: 6,
  },
});
