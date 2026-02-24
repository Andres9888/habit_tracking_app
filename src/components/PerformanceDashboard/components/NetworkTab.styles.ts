/**
 * NetworkTab Styles
 */

import { StyleSheet } from 'react-native';
import { fontFamilies } from '@/theme/typography';

export const networkStyles = StyleSheet.create({
  requestDuration: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'monospace',
    fontSize: 10,
  },
  requestInfo: { flex: 1, flexDirection: 'row', gap: 6 },
  requestMethod: {
    color: '#15793C',
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '600',
    width: 32,
  },
  requestRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  requests: { gap: 4 },
  requestUrl: { color: 'rgba(255,255,255,0.6)', flex: 1, fontFamily: fontFamilies.monospace, fontSize: 10 },
  slowRequest: { color: '#f59e0b' },
});
