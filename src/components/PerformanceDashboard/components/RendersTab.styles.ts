/**
 * RendersTab Styles
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const rendersStyles = StyleSheet.create({
  compDuration: {
    color: colors.success,
    fontFamily: 'monospace',
    fontSize: 10,
    width: 45,
  },
  compName: { color: 'rgba(255,255,255,0.8)', flex: 1, fontSize: 10 },
  compRenders: {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'monospace',
    fontSize: 10,
    width: 30,
  },
  compRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: 3,
  },
  compStats: { flexDirection: 'row', gap: spacing.sm },
  list: { gap: spacing.xs },
  scrollView: { maxHeight: 70 },
  slowDuration: { color: colors.warning[500] },
  slowLabel: { color: colors.warning[500], fontWeight: '600' },
});
