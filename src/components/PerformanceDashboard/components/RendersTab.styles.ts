/**
 * RendersTab Styles
 */

import { StyleSheet } from 'react-native';

export const rendersStyles = StyleSheet.create({
  compDuration: {
    color: '#15793C',
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
    gap: 8,
    paddingVertical: 3,
  },
  compStats: { flexDirection: 'row', gap: 8 },
  list: { gap: 4 },
  scrollView: { maxHeight: 70 },
  slowDuration: { color: '#f59e0b' },
  slowLabel: { color: '#f59e0b', fontWeight: '600' },
});
