/**
 * NetworkTab Styles
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const networkStyles = StyleSheet.create({
  requestDuration: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'monospace',
    fontSize: 10,
  },
  requestInfo: { flex: 1, flexDirection: 'row', gap: 6 },
  requestMethod: {
    color: colors.success,
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '600',
    width: 32,
  },
  requestRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  requests: { gap: spacing.xs },
  requestUrl: { color: 'rgba(255,255,255,0.6)', flex: 1, fontSize: 10 },
  slowRequest: { color: colors.warning[500] },
});
